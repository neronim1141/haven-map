import { prisma } from "lib/prisma";
import fs from "fs/promises";

export const deleteMap = async (mapId: number) => {
  await prisma.map.delete({
    where: { id: mapId },
  });
  await prisma.grid.deleteMany({
    where: { mapId: mapId },
  });
  for (let tile of await prisma.tile.findMany({
    where: {
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
};
