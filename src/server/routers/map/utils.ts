import sharp from "sharp";
import { prisma } from "utils/prisma";
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

export async function getMapTileData(
  mapId: number,
  x: number,
  y: number,
  z: number
) {
  if (z !== 0) {
    const tile = await prisma.tile.findFirst({
      where: {
        mapId,
        x,
        y,
        z,
      },
    });
    return tile?.tileData;
  } else {
    const grid = await prisma.grid.findFirst({
      where: {
        mapId,
        x,
        y,
      },
    });
    return grid?.tileData;
  }
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
  if (z !== 0) {
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
        },
      });
      socket?.emit("tileUpdate", tile);
      return true;
    } else {
      tile = await prisma.tile.create({
        data: {
          mapId,
          x,
          y,
          z,
          tileData: file,
        },
      });
      socket?.emit("tileUpdate", tile);
      return true;
    }
  }
  if (gridId) {
    let grid = await prisma.grid.update({
      where: {
        id: gridId,
      },
      data: {
        mapId,
        x,
        y,
        tileData: file,
        lastUpdated: Date.now().toString(),
      },
    });
    socket?.emit("tileUpdate", {
      x: grid.x,
      y: grid.y,
      z: 0,
      mapId: grid.mapId,
      updatedAt: grid.updatedAt ?? new Date(),
    });
    return true;
  }
  return false;
};

export const updateZoomLevel = async (
  mapId: number,
  x: number,
  y: number,
  z: number
) => {
  const coord = { x, y };
  let tiles = [];
  for (let x = 0; x <= 1; x++) {
    for (let y = 0; y <= 1; y++) {
      const newX = coord.x * 2 + x;
      const newY = coord.y * 2 + y;

      const tile = await getMapTileData(mapId, newX, newY, z - 1);

      if (!tile) continue;
      tiles.push({
        tileBuffer: tile,
        x,
        y,
      });
    }
  }

  if (tiles.length === 0) {
    return;
  }
  let tile = sharp({
    create: {
      width: 200,
      height: 200,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .png()
    .composite(
      tiles.map((t) => {
        return { input: t.tileBuffer, left: t.x * 100, top: t.y * 100 };
      })
    );
  tile = sharp(await tile.toBuffer()).resize({
    width: 100,
    height: 100,
  });
  return await saveTile(mapId, coord.x, coord.y, z, await tile.toBuffer());
};
