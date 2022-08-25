import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { File, IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
import { Coord, saveTile, updateZoomLevel } from "features/map/api/utils";
import { Tile } from "@prisma/client";
import { HnHMaxZoom, HnHMinZoom } from "features/map/config";
const router = createRouter<NextApiRequest, NextApiResponse>();

export type RequestData = {
  id: string;
  extraData: { season: number };
  file: File;
};

router.post(async (req, res) => {
  return res.end();
  if (!req.query.token) {
    return res.status(403).end();
  }
  const user = await prisma.user.findFirst({
    where: {
      token: req.query.token as string,
    },
  });
  if (!user) return res.status(403).end();

  const tile = await getTileFromRequest(req);
  logger.log(`map Tile for: ${tile.id} by: ${user.name}`);

  try {
    const tileData = await fs.readFile(tile.file.filepath);
    const grid = await prisma.grid.findUnique({
      where: { id: tile.id },
    });
    if (!grid) {
      throw new Error(`Unknown grid id: ${tile.id}`);
    }
    const tiles: Tile[] = [];
    await saveTile(grid.mapId, grid.x, grid.y, 0, tileData, grid.id);
    let coord = { x: grid.x, y: grid.y };

    for (let z = HnHMinZoom; z < HnHMaxZoom; z++) {
      coord = new Coord(coord.x, coord.y).parent();
      await updateZoomLevel(grid.mapId, coord.x, coord.y, z);
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
