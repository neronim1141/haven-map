import { prisma } from "lib/prisma";
import { processZoom } from "../../utils";
import { Coord } from "../../utils/coord";

export const rebuildZooms = async (mapId: number) => {
  let needProcess = new Map<string, Coord>([]);
  for (let grid of await prisma.grid.findMany({ where: { mapId: mapId } })) {
    const coord = new Coord(grid.x, grid.y).parent();

    needProcess.set(coord.toString(), coord);
  }
  await prisma.tile.deleteMany({
    where: {
      mapId,
      gridId: null,
    },
  });

  await processZoom(needProcess, mapId);
};
