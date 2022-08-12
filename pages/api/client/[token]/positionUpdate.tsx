import { createRouter } from "next-connect";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import * as logger from "lib/logger";
import {
  PositionUpdateRequest,
  updatePosition,
} from "features/map/api/positionUpdate";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  if (!req.query.token) {
    logger.error("positionUpdate from: no token");
    return res.status(403).end();
  }
  const user = await prisma.user.findFirst({
    where: {
      token: req.query.token as string,
    },
  });
  logger.log("positionUpdate from: " + user?.name);
  if (!user) return res.status(403).end();

  await updatePosition(req.body as PositionUpdateRequest);
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
