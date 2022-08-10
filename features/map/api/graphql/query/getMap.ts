import { prisma } from "lib/prisma";

export const getMap = (id: number) => {
  return prisma.tile.findMany({
    where: {
      AND: [{ mapId: id }],
    },
  });
};
