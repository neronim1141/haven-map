import { getParentCoords, processZoom } from "../utils";
import { Coord } from "../models";
import { Grid, Tile } from "@prisma/client";
import { prisma } from "lib/prisma";

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
  const tiles: Tile[] = [];

  let needProcess = new Map<{ mapId: number; x: number; y: number }, boolean>(
    []
  );
  for (let grid of grids) {
    tiles.push(await updateGrid(mapsOffsets, grid, mapId, offset));
  }

  for (let tile of tiles) {
    const coord = getParentCoords(tile.x, tile.y);
    needProcess.set({ mapId, x: coord.x, y: coord.y }, true);
    pubsub?.publish("tileUpdate", mapId, tile);
  }

  await processZoom(needProcess, mapId);

  await cleanupAfterMerge(mapsOffsets, mapId, offset);
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
      await prisma.tile.deleteMany({
        where: {
          mapId: Number(mergeId),
        },
      });
      pubsub?.publish("merge", Number(mergeId), {
        to: mapId,
        shift: { x: offset.x - merge.x, y: offset.y - merge.y },
      });
    }
  }
}
