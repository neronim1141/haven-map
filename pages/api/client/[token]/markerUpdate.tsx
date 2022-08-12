import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import * as logger from "lib/logger";
import { MarkersRequest, markerUpdate } from "features/map/api/markerUpdate";
import { prisma } from "lib/prisma";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  logger.log("markerUpdate");
  if (!req.query.token) {
    logger.error("gridUpdate from: no token");
    return res.status(403).end();
  }
  const user = await prisma.user.findFirst({
    where: {
      token: req.query.token as string,
    },
  });
  logger.log("markerUpdate from: " + user?.name);

  if (!user) return res.status(403).end();

  await markerUpdate(req.body as MarkersRequest, user?.role);

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
