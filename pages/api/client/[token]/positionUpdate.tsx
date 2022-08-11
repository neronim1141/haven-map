import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import * as logger from "lib/logger";
import {
  PositionUpdateRequest,
  updatePosition,
} from "features/map/api/positionUpdate";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  logger.log("positionUpdate");

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
