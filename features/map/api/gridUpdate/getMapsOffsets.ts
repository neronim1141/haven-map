import { prisma } from "../../../../lib/prisma";
import { HavenGrids } from ".";
import { Coord } from "../utils";

/**
 * gets map offsets based on provided grids
 * @param grids
 * @returns \{[mapId]:Coords} where coords is offset for that map
 */
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
