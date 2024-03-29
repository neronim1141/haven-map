import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

import { logger } from "utils/logger";
import { prisma } from "utils/prisma";
import { Grid, Tile } from "@prisma/client";
import { NextApiResponseServerIO, SocketIO } from "../../socketio";
import { Coord, processZoom } from "~/server/routers/map/utils";
import { defaultHidden } from "~/server/routers/map/config";
export type HavenGrids = [
  [string, string, string],
  [string, string, string],
  [string, string, string]
];

type GridRequest = {
  gridRequests: string[];
  map: number;
  coord: { x: number; y: number };
};

const router = createRouter<NextApiRequest, NextApiResponseServerIO>();

router.post(async (req, res) => {
  const grids = (
    req.body as {
      grids: HavenGrids;
    }
  ).grids;
  if (!req.query.token) {
    logger.error("gridUpdate from: no token");
    return res.status(403).end();
  }
  const user = await prisma.user.findFirst({
    where: {
      token: req.query.token as string,
    },
  });

  if (!user) return res.status(403).end();
  logger.log("gridUpdate from: " + user?.name);

  const gridRequests: GridRequest = {
    gridRequests: [],
    map: 0,
    coord: { x: 0, y: 0 },
  };
  const mapsOffsets = await getMapsOffsets(grids);
  const socket = res?.socket?.server?.io;
  if (Object.keys(mapsOffsets).length === 0) {
    gridRequests.gridRequests = await createNewMap(grids);
    return gridRequests;
  }

  const { mapId, offset } = await GetPriorityMapData(mapsOffsets);
  logger.log(`client in mapID: ${mapId}`);

  gridRequests.gridRequests = await updateExistingMap(grids, mapId, offset);
  const centerGrid = (await prisma.grid.findUnique({
    where: { id: grids[1][1] },
  }))!;
  gridRequests.coord = { x: centerGrid.x, y: centerGrid.y };
  gridRequests.map = centerGrid.mapId;

  if (Object.keys(mapsOffsets).length > 1) {
    await mergeMaps(mapId, mapsOffsets, offset, socket);
  }
  res.json(gridRequests);
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

export const getMapsOffsets = async (grids: HavenGrids) => {
  const mapsOffsets: { [key: number]: Coord } = {};

  for (let [x, row] of grids.entries()) {
    for (let [y, gridId] of row.entries()) {
      const grid = await prisma.grid.findUnique({ where: { id: gridId } });
      if (grid) {
        mapsOffsets[grid.mapId] = new Coord(grid.x - x, grid.y - y);
      }
    }
  }
  return mapsOffsets;
};

export const createNewMap = async (grids: HavenGrids) => {
  const toUpload = [];
  const map = await prisma.map.create({
    data: {
      hidden: defaultHidden,
    },
  });

  logger.log(`client made map: ${map.id}`);

  for (let [x, row] of grids.entries()) {
    for (let [y, gridId] of row.entries()) {
      await prisma.grid.create({
        data: {
          id: gridId,
          mapId: map.id,
          x: x - 1,
          y: y - 1,
        },
      });
      toUpload.push(gridId);
    }
  }
  return toUpload;
};

export const GetPriorityMapData = async (mapsOffsets: {
  [key: number]: { x: number; y: number };
}) => {
  let mapId: number = -1,
    offset = { x: 1, y: 1 };
  for (let [thisMapId, thisMapOffset] of Object.entries(mapsOffsets)) {
    const id = Number(thisMapId);
    const mapInfo = await prisma.map.findUnique({ where: { id: Number(id) } });
    if (mapInfo?.priority) {
      mapId = id;
      offset = thisMapOffset;
      break;
    }
    if (mapId === -1 || id < mapId) {
      mapId = id;
      offset = thisMapOffset;
    }
  }
  return {
    mapId,
    offset,
  };
};

export const updateExistingMap = async (
  grids: HavenGrids,
  mapId: number,
  offset: { x: number; y: number }
) => {
  const toUpload = [];

  for (let [x, row] of grids.entries()) {
    for (let [y, gridId] of row.entries()) {
      const grid = await prisma.grid.findUnique({ where: { id: gridId } });
      if (grid) {
        toUpload.push(gridId);
        continue;
      }
      await prisma.grid.create({
        data: {
          id: gridId,
          mapId: mapId,
          x: x + offset.x,
          y: y + offset.y,
        },
      });
      toUpload.push(gridId);
    }
  }
  return toUpload;
};

//#region merge maps
export async function mergeMaps(
  mapId: number,
  mapsOffsets: { [key: number]: Coord },
  offset: { x: number; y: number },
  socket: SocketIO
) {
  const grids = await prisma.grid.findMany({
    where: {
      AND: [
        { NOT: { mapId: mapId } },
        { mapId: { in: Object.keys(mapsOffsets).map(Number) } },
      ],
    },
  });
  const tiles: Tile[] = [];

  let needProcess = new Map<string, Coord>([]);
  for (let grid of grids) {
    tiles.push(await updateGrid(mapsOffsets, grid, mapId, offset));
  }

  for (let tile of tiles) {
    const coord = new Coord(tile.x, tile.y).parent();
    needProcess.set(coord.toString(), coord);
    socket.emit("tileUpdate", tile);
  }

  await processZoom(needProcess, mapId);

  await cleanupAfterMerge(mapsOffsets, mapId, offset, socket);
}

async function updateGrid(
  mapsOffsets: { [key: number]: Coord },
  grid: Grid,
  mapId: number,
  offset: { x: number; y: number }
) {
  const mergeOffset = mapsOffsets[grid.mapId];
  const data = {
    mapId,
    x: grid.x + offset.x - mergeOffset.x,
    y: grid.y + offset.y - mergeOffset.y,
  };
  const tile = await prisma.tile.update({
    where: {
      gridId: grid.id,
    },
    data: {
      ...data,
      lastUpdated: Date.now().toString(),
    },
  });

  await prisma.grid.update({
    where: {
      id: grid.id,
    },
    data,
  });
  return tile;
}

async function cleanupAfterMerge(
  mapsOffsets: { [key: number]: Coord },
  mapId: number,
  offset: { x: number; y: number },
  socket: SocketIO
) {
  for (let [mergeId, merge] of Object.entries(mapsOffsets)) {
    if (Number(mergeId) !== mapId) {
      await prisma.map.delete({
        where: {
          id: Number(mergeId),
        },
      });
      await prisma.grid.deleteMany({
        where: {
          mapId: Number(mergeId),
        },
      });
      await prisma.tile.deleteMany({
        where: {
          mapId: Number(mergeId),
        },
      });

      socket.emit("merge", {
        from: Number(mergeId),
        to: mapId,
        shift: { x: offset.x - merge.x, y: offset.y - merge.y },
      });
    }
  }
}

//#endregion
