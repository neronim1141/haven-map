import { createRouter } from "next-connect";
import { prisma } from "lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs/promises";
import path from "path";
const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  try {
    const image = (req.query.slug as string[]).join("/");
    const icon = await prisma.markerIcon.findUnique({ where: { image } });
    if (icon) {
      return res.send(icon);
    }
    const filePath = path.join(process.cwd(), "public" + image + ".png");
    const iconFile = await fs.readFile(filePath);
    res.setHeader("content-type", "application/octet-stream");
    return res.send(iconFile);
  } catch (err: any) {
    if (err.code !== "ENOENT") throw err;
    return res.status(404).end();
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
