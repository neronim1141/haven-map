import { Grid, Map } from "@prisma/client";
import jszip from "jszip";
import { Coord } from "../../utils/coord";
import { prisma } from "lib/prisma";
import { defaultHidden } from "features/map/config";
// import { processZoom } from "../../utils";
import { rebuildZooms } from "./rebuildZooms";
import path from "path";
export const importMap = async (file: File) => {
  console.log("TBD");
  //   const zip = await jszip.loadAsync(file.arrayBuffer());
  //   const mapsRaw = zip.file("maps.json");
  //   if (!mapsRaw) return "something went wrong!";
  //   const maps = JSON.parse(await mapsRaw.async("string")) as Map[];
  //   for (let map of maps) {
  //     let folder = zip.folder(map.id.toString());
  //     if (!folder) continue;
  //     const gridsRaw = folder.file("grids.json");
  //     if (!gridsRaw) continue;
  //     const grids = JSON.parse(await gridsRaw.async("string")) as Grid[];
  //     const mapsOffsets = await getMapsOffsets(grids);

  //     if (Object.keys(mapsOffsets).length === 0) {
  //       await createNewMap(grids);
  //       return;
  //     }

  //     const { mapId, offset } = await GetPriorityMapData(mapsOffsets);
  //     await updateExistingMap(grids, mapId, offset);
  //     if (Object.keys(mapsOffsets).length > 1) {
  //       await mergeMaps(mapId, mapsOffsets, offset);
  //     }
  //     await createTiles(folder, grids)
  //     await rebuildZooms(mapId);

  //     await cleanupAfterMerge(mapsOffsets, mapId, offset);
  //   }
};

export const getMapsOffsets = async (grids: Grid[]) => {
  const mapsOffsets: { [key: number]: Coord } = {};

  for (let data of grids) {
    const grid = await prisma.grid.findUnique({ where: { id: data.id } });
    if (grid) {
      mapsOffsets[grid.mapId] = new Coord(grid.x - data.x, grid.y - data.y);
    }
  }
  return mapsOffsets;
};

export const createNewMap = async (grids: Grid[]) => {
  const map = await prisma.map.create({
    data: {
      hidden: defaultHidden,
    },
  });
  for (let data of grids) {
    await prisma.grid.create({
      data: { ...data, mapId: map.id },
    });
  }
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
  grids: Grid[],
  mapId: number,
  offset: { x: number; y: number }
) => {
  for (let { x, y, id } of grids) {
    const grid = await prisma.grid.findUnique({ where: { id: id } });
    if (grid) {
      continue;
    }
    await prisma.grid.create({
      data: {
        id: id,
        mapId: mapId,
        x: x + offset.x,
        y: y + offset.y,
      },
    });
  }
};

//#region merge maps
export async function mergeMaps(
  mapId: number,
  mapsOffsets: { [key: number]: Coord },
  offset: { x: number; y: number }
) {
  const grids = await prisma.grid.findMany({
    where: {
      AND: [
        { NOT: { mapId: mapId } },
        { mapId: { in: Object.keys(mapsOffsets).map(Number) } },
      ],
    },
  });

  for (let grid of grids) {
    await updateGrid(mapsOffsets, grid, mapId, offset);
  }
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
  offset: { x: number; y: number }
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
    }
  }
}

//#endregion
