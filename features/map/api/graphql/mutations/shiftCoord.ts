import { Tile } from "@prisma/client";
import { prisma } from "lib/prisma";
import { Coord, processZoom } from "../../utils";
import fs from "fs/promises";

export async function shiftCoord(
  mapId: number,
  shiftBy: { x: number; y: number }
) {
  const grids = await prisma.grid.findMany({
    where: {
      mapId,
    },
  });
  const tiles: Tile[] = [];

  for (let grid of grids) {
    await prisma.grid.update({
      where: { id: grid.id },
      data: {
        x: { increment: shiftBy.x },
        y: { increment: shiftBy.y },
      },
    });
    tiles.push(
      await prisma.tile.update({
        where: { gridId: grid.id },
        data: {
          x: { increment: shiftBy.x },
          y: { increment: shiftBy.y },
        },
      })
    );
  }

  for (let tile of await prisma.tile.findMany({
    where: {
      gridId: null,

      mapId,
    },
  })) {
    await prisma.tile.delete({
      where: {
        id: tile.id,
      },
    });
    await fs.rm(tile.tileUrl);
  }
  let needProcess = new Map<string, Coord>([]);
  for (let tile of tiles) {
    const coord = new Coord(tile.x, tile.y).parent();

    needProcess.set(coord.toString(), coord);
    pubsub?.publish("tileUpdate", mapId, tile);
  }

  await processZoom(needProcess, mapId);
}
