import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  if (req.query.version === "4") {
    return res.status(200).end();
  }
  res.status(400).end();
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
