import { prisma } from "lib/prisma";
import { Coord, processZoom } from "../../utils";
import fs from "fs/promises";

export const rebuildZooms = async (mapId: number) => {
  let needProcess = new Map<string, Coord>([]);
  for (let grid of await prisma.grid.findMany({ where: { mapId: mapId } })) {
    const coord = new Coord(grid.x, grid.y).parent();

    needProcess.set(coord.toString(), coord);
  }
  for (let tile of await prisma.tile.findMany({
    where: {
      mapId,
      gridId: null,
    },
  })) {
    await prisma.tile.delete({
      where: {
        id: tile.id,
      },
    });
    await fs.rm(tile.tileUrl);
  }

  await processZoom(needProcess, mapId);
};
