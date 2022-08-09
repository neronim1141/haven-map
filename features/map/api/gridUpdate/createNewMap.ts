import * as logger from "lib/logger";
import { HavenGrids } from ".";
import { prisma } from "lib/prisma";
/**
 * creates new map
 * @param grids
 * @returns array of gridIDs to upload
 */
export const createNewMap = async (grids: HavenGrids) => {
  const toUpload = [];
  //TODO: create in database
  const map = await prisma.map.create({ data: {} });

  logger.log(`client made map: ${map.id}`);

  for (let [x, row] of grids.entries()) {
    for (let [y, gridId] of row.entries()) {
      await prisma.grid.create({
        data: {
          id: gridId,
          mapId: map.id,
          x: x - 1,
          y: y - 1,
        },
      });
      toUpload.push(gridId);
    }
  }
  return toUpload;
};
