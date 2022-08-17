import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { getMapTile } from "features/map/api/utils";
import { cache } from "lib/cache";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  const [map, data] = req.query.slug as String[];
  const [z, x, y] = data.split("_").map(Number);
  const key = `${map}_${x}_${y}_${z}`;
  const cached = cache.get(key);
  res.setHeader("Content-Type", "image/webp");
  if (!cached) {
    const tile = await getMapTile(Number(map), Number(x), Number(y), Number(z));
    let response = tile
      ? Buffer.from(tile.tileData)
      : "data:image/webp;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    cache.put(key, response);
    return res.send(response);
  } else {
    return res.send(cached);
  }
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
