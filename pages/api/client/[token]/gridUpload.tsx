import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { File, IncomingForm } from "formidable";
import { promises as fs } from "fs";
import { fileToString } from "features/map/api/gridUpload/fileToString";
import { gridUpload, RequestData } from "features/map/api/gridUpload";
import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
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

  await gridUpload(tile);
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
