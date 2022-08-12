import { prisma } from "lib/prisma";

export const hideMap = async (mapId: number) => {
  await prisma.map.update({
    where: {
      id: mapId,
    },
    data: {
      hidden: true,
    },
  });
};
