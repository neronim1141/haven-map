import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "lib/prisma";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const gridId = req.query.gridID as string | undefined;
  if (gridId) {
    const grid = await prisma.grid.findUnique({ where: { id: gridId } });
    if (grid) {
      return res.send(`${grid.mapId};${grid.x};${grid.y}`);
    }
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
