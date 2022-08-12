import { prisma } from "lib/prisma";

export async function getMapTile(
  mapId: number,
  x: number,
  y: number,
  z: number
) {
  return await prisma.tile.findFirst({
    where: {
      mapId,
      x,
      y,
      z,
    },
  });
}
