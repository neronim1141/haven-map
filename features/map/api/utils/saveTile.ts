import { prisma } from "lib/prisma";
import { pubsub } from "lib/pubsub";
import fs from "fs/promises";
import path from "path";
export const saveTile = async (
  mapId: number,
  x: number,
  y: number,
  z: number,
  file: Buffer,
  gridId?: string
) => {
  let dir = path.join("public", "grids", mapId.toString(), z.toString());
  await fs.mkdir(dir, { recursive: true });
  dir = path.join(dir, `${x}_${y}.webp`);
  await fs.writeFile(dir, file);
  let tile = await prisma.tile.findFirst({
    where: {
      mapId,
      x,
      y,
      z,
    },
  });
  if (tile) {
    tile = await prisma.tile.update({
      where: {
        id: tile.id,
      },
      data: {
        tileData: file,
        lastUpdated: Date.now().toString(),
      },
    });
  } else {
    tile = await prisma.tile.create({
      data: {
        mapId,
        x,
        y,
        z,
        tileData: file,
        lastUpdated: Date.now().toString(),
        gridId,
      },
    });
  }
  pubsub.publish("tileUpdate", mapId, tile);

  return tile;
};
