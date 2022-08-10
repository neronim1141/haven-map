import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
import { MarkersRequest, markerUpdate } from "features/map/api/markerUpdate";
const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  logger.log("markerUpdate");
  await markerUpdate(req.body as MarkersRequest);

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
