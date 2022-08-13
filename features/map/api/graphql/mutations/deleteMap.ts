import { prisma } from "lib/prisma";

export const deleteMap = async (mapId: number) => {
  await prisma.map.delete({
    where: { id: mapId },
  });
  await prisma.grid.deleteMany({
    where: { mapId: mapId },
  });
  await prisma.tile.deleteMany({
    where: {
      mapId,
    },
  });
};
