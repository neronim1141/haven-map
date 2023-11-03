import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { getMapTileData } from "~/server/routers/map/utils";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const [map, data] = req.query.slug as String[];
  const [z, x, y] = data.split("_").map(Number);
  res.setHeader("Content-Type", "image/webp");
  const tile = await getMapTileData(
    Number(map),
    Number(x),
    Number(y),
    Number(z)
  );
  let response = tile
    ? Buffer.from(tile)
    : "data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
  return res.send(response);
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
