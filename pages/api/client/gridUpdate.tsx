import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

import { gridUpdate, HavenGrids } from "features/map/api/gridUpdate";
import * as logger from "lib/logger";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  logger.log("gridUpdate");
  const grids = (
    req.body as {
      grids: HavenGrids;
    }
  ).grids;
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
