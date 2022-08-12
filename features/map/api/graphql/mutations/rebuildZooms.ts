import { prisma } from "lib/prisma";
import { Coord, processZoom } from "../../utils";

export const rebuildZooms = async (mapId: number) => {
  let needProcess = new Map<string, Coord>([]);
  for (let grid of await prisma.grid.findMany({ where: { mapId: mapId } })) {
    const coord = new Coord(grid.x, grid.y).parent();
    if (grid.x == -4 && grid.y == 4) console.log(grid.x, grid.y, mapId);

    needProcess.set(coord.toString(), coord);
    if (grid.x == -4 && grid.y == 4) console.log(coord);
  }
  await prisma.tile.deleteMany({
    where: {
      mapId,
      gridId: null,
    },
  });

  await processZoom(needProcess, mapId);
};
