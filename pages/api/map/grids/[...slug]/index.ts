import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { getMapTile } from "features/map/api";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const [map, data] = req.query.slug as String[];
  const [z, x, y] = data.split("_").map(Number);
  const tile = await getMapTile(Number(map), Number(x), Number(y), Number(z));
  if (tile) return res.send(Buffer.from(tile.tileData));
  return res.status(404).end();
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
