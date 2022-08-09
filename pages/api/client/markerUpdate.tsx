import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
const router = createRouter<NextApiRequest, NextApiResponse>();

type MarkersRequest = {
  id: number;
  image: string;
  x: number;
  y: number;
  gridID: string;
  name: string;
  type: string;
}[];

router.post(async (req, res) => {
  logger.log("markerUpdate");
  const markers = req.body as MarkersRequest;
  for (let marker of markers) {
    const { gridID, ...data } = marker;
    const grid = await prisma.grid.findUnique({ where: { id: gridID } });
    if (!grid) continue;

    if (data.type === "player") continue;
    if (data.image == "") {
      data.image = "gfx/terobjs/mm/custom";
      data.type = "custom";
    }

    await prisma.marker.upsert({
      where: {
        id: data.id,
      },
      update: {
        ...data,
        gridId: gridID,
      },
      create: {
        ...data,
        gridId: gridID,
      },
    });
  }

  res.end();
});

export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
