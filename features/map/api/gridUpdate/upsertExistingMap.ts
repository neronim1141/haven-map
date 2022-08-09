import { Coord } from "../models";
import { prisma } from "lib/prisma";
import { HavenGrids } from ".";

export const updateExistingMap = async (
  grids: HavenGrids,
  mapId: number,
  offset: Coord
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
