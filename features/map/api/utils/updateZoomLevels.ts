import { createCanvas, createImageData } from "canvas";
import { saveTile } from "./saveTile";
import sharp from "sharp";
import { getMapTile } from "./getMapTile";
import { Tile } from "@prisma/client";
export const updateZoomLevel = async (
  mapId: number,
  x: number,
  y: number,
  z: number
) => {
  const coord = { x, y };
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext("2d");
  let anyTile = false;

  for (let x = 0; x <= 1; x++) {
    for (let y = 0; y <= 1; y++) {
      const newX = coord.x * 2 + x;
      const newY = coord.y * 2 + y;

      const tile = await getMapTile(mapId, newX, newY, z - 1);

      if (!tile) continue;

      anyTile = true;
      ctx.putImageData(await bufferToImageData(tile), x * 50, y * 50);
    }
  }

  if (!anyTile) return;
  return await saveTile(mapId, coord.x, coord.y, z, canvas.toBuffer());
};

async function bufferToImageData(tile: Tile) {
  const buffer = await sharp(tile.tileData)
    .raw()
    .resize(50, 50)
    .toBuffer({ resolveWithObject: true });
  const ImageData = createImageData(
    Uint8ClampedArray.from(buffer.data),
    50,
    50
  );
  return ImageData;
}
