import { Coord, processZoom } from "../utils";
import { Grid, Tile } from "@prisma/client";
import { prisma } from "lib/prisma";
import { pubsub } from "../../../../lib/pubsub";
import { cache } from "lib/cache";
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

  let needProcess = new Map<string, Coord>([]);
  for (let grid of grids) {
    tiles.push(await updateGrid(mapsOffsets, grid, mapId, offset));
  }

  for (let tile of tiles) {
    const coord = new Coord(tile.x, tile.y).parent();
    needProcess.set(coord.toString(), coord);
    const key = `${tile.mapId}_${tile.x}_${tile.y}_${tile.z}`;
    cache.del(key);
    pubsub.publish("tileUpdate", mapId, tile);
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

      pubsub.publish("merge", {
        from: Number(mergeId),
        to: mapId,
        shift: { x: offset.x - merge.x, y: offset.y - merge.y },
      });
    }
  }
}
