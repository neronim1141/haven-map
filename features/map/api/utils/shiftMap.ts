import { getParentCoords, processZoom, saveTile } from "..";
import { Coord } from "../models";
import { Grid, Tile } from "@prisma/client";
import { prisma } from "lib/prisma";

export async function shiftMap(mapId: number, shiftBy: Coord) {
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
  await prisma.tile.deleteMany({
    where: {
      gridId: null,
      mapId,
    },
  });
  let needProcess = new Map<{ mapId: number; x: number; y: number }, boolean>(
    []
  );
  for (let tile of tiles) {
    const coord = getParentCoords(tile.x, tile.y);

    needProcess.set({ mapId, x: coord.x, y: coord.y }, true);
    pubsub?.publish("tileUpdate", mapId, tile);
  }

  await processZoom(needProcess, mapId);
}
