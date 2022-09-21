import { createRouter } from "next-connect";

import type { NextApiRequest } from "next";
import { File, IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { prisma } from "utils/prisma";
import { logger } from "utils/logger";
import { NextApiResponseServerIO } from "../../socketio";
import { Coord, saveTile, updateZoomLevel } from "~/server/routers/map/utils";
import { HnHMaxZoom, HnHMinZoom } from "~/server/routers/map/config";
const router = createRouter<NextApiRequest, NextApiResponseServerIO>();

export type RequestData = {
  id: string;
  extraData: { season: number };
  file: File;
};

router.post(async (req, res) => {
  if (!req.query.token) {
    return res.status(403).end();
  }

  const socket = res?.socket?.server?.io;
  const user = await prisma.user.findFirst({
    where: {
      token: req.query.token as string,
    },
  });
  if (!user) return res.status(403).end();

  const tile = await getTileFromRequest(req);
  try {
    const tileData = await fs.readFile(tile.file.filepath);
    const grid = await prisma.grid.findUnique({
      where: { id: tile.id },
    });

    if (!grid) {
      throw new Error(`Unknown grid id: ${tile.id}`);
    }
    const map = await prisma.map.findUnique({
      where: {
        id: grid.mapId,
      },
    });
    if (!map) {
      throw new Error(`Unknown map id: ${grid.mapId}`);
    }
    const updated = await saveTile(
      grid.mapId,
      grid.x,
      grid.y,
      0,
      tileData,
      socket,
      grid.id,
      map.winterUpdate || tile.extraData.season !== 3 || grid.tileData === null
    );
    if (updated) {
      let coord = { x: grid.x, y: grid.y };

      for (let z = HnHMinZoom; z < HnHMaxZoom; z++) {
        coord = new Coord(coord.x, coord.y).parent();
        await updateZoomLevel(grid.mapId, coord.x, coord.y, z);
      }
    }
  } catch (e) {
    logger.error(e);
  } finally {
    await fs.rm(tile.file.filepath);
  }
  res.end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});

const getTileFromRequest = async (req: NextApiRequest) => {
  return await new Promise<RequestData>((resolve, reject) => {
    const form = new IncomingForm({
      keepExtensions: true,
      uploadDir: "./tmp",
      multiples: true,
    });
    form.parse(req, async (err, _, files) => {
      if (err) reject(err);
      let id, extraData, tile;
      try {
        for (let [fileField, filesArray] of Object.entries(files)) {
          const file = (filesArray as File[])[0];
          switch (fileField) {
            case "id":
              id = await fileToString(file.filepath);
              fs.rm(file.filepath);
              break;
            case "extraData":
              extraData = JSON.parse(await fileToString(file.filepath));
              fs.rm(file.filepath);
              break;
            default:
              tile = file;
              break;
          }
        }
        if (id && tile) {
          resolve({ id, extraData, file: tile });
        } else {
          reject("data missing");
        }
      } catch (err) {
        for (let [_, filesArray] of Object.entries(files)) {
          const file = (filesArray as File[])[0];
          fs.rm(file.filepath);
        }
        reject(err);
      }
    });
  });
};

export const fileToString = async (path: string) => {
  return (await fs.readFile(path)).toString("utf-8");
};
