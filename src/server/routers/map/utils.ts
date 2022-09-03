import { createCanvas, createImageData } from "canvas";
import sharp from "sharp";
import { Tile } from "@prisma/client";
import { prisma } from "utils/prisma";
import fs from "fs/promises";
import path from "path";
import { SocketIO } from "~/pages/api/socketio";
import { HnHMaxZoom, HnHMinZoom } from "./config";

export class Coord {
  x = 0;
  y = 0;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  parent = () => {
    const tmp = { x: this.x, y: this.y };
    // if (tmp.x < 0) tmp.x--;
    // if (tmp.y < 0) tmp.y--;

    return new Coord(Math.floor(tmp.x / 2), Math.floor(tmp.y / 2));
  };
  toString = () => {
    return `${this.x}_${this.y}`;
  };
}

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

export async function processZoom(
  needProcess: Map<string, Coord>,
  mapId: number
) {
  for (let z = HnHMinZoom; z < HnHMaxZoom; z++) {
    const process = new Map(needProcess);
    needProcess.clear();
    for (let p of process.values()) {
      const tile = await updateZoomLevel(mapId, p.x, p.y, z);
      if (tile) {
        const coord = p.parent();
        needProcess.set(coord.toString(), coord);
      }
    }
  }
}

export const saveTile = async (
  mapId: number,
  x: number,
  y: number,
  z: number,
  file: Buffer,
  socket?: SocketIO,

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
  socket?.emit("tileUpdate", tile);

  return tile;
};

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
