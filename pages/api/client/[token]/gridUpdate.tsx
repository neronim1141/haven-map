import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

import { gridUpdate, HavenGrids } from "features/map/api/gridUpdate";
import * as logger from "lib/logger";
import { prisma } from "lib/prisma";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  logger.log("gridUpdate");
  const grids = (
    req.body as {
      grids: HavenGrids;
    }
  ).grids;
  if (!req.query.token) return res.status(403).end();
  const user = await prisma.user.findFirst({
    where: {
      token: req.query.token as string,
    },
  });
  if (!user) return res.status(403).end();
  res.json(await gridUpdate(grids));
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
