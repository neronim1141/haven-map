import { prisma } from "lib/prisma";

export async function getMapTile(
  mapId: number,
  x: number,
  y: number,
  z: number
) {
  if (x == -4 && y == 4 && z == 0) console.log(x, y, mapId);

  return await prisma.tile.findFirst({
    where: {
      mapId,
      x,
      y,
      z,
    },
  });
}
