import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import * as logger from "lib/logger";

const router = createRouter<NextApiRequest, NextApiResponse>();

type PositionUpdateRequest = {
  [key: string]: {
    name: string;
    gridID: string;
    type: string;
    coords: {
      x: number;
      y: number;
    };
  };
};

router.post(async (req, res) => {
  logger.log("positionUpdate");
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
