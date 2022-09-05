import { createRouter } from "next-connect";
import { prisma } from "utils/prisma";
import { logger } from "utils/logger";
import type { NextApiRequest, NextApiResponse } from "next";
import jszip, { JSZipObject } from "jszip";
import { parallel } from "radash/dist/async";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const zip = new jszip();
  const maps = await prisma.map.findMany();
  zip.file(`maps.json`, JSON.stringify(maps));

  for (let map of maps) {
    const grids = await prisma.grid.findMany({
      where: {
        mapId: map.id,
      },
      select: {
        id: true,
        x: true,
        y: true,
        mapId: true,
        tileData: true,
      },
    });
    await parallel(25, grids, async (grid) => {
      if (grid.tileData) {
        zip.file(`${map.id}/${grid.id}.png`, grid.tileData);
      } else {
        logger.error("Tile was supposed to be found");
      }
      const markers = await prisma.marker.findMany({
        where: {
          gridId: grid.id,
        },
      });
      zip.file(`${map.id}/markers.json`, JSON.stringify(markers));
    });
    const gridsWithoutTile = grids.map(({ tileData, ...rest }) => rest);
    zip.file(`${map.id}/grids.json`, JSON.stringify(gridsWithoutTile));
  }
  const stream = await zip.generateAsync({ type: "nodebuffer" });
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="export.zip"`);
  res.setHeader("Content-Length", stream.byteLength);

  return res.end(stream);
});
export const config = {
  api: {
    responseLimit: false,
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
