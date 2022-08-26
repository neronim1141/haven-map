import { createRouter } from "next-connect";
import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
import type { NextApiRequest, NextApiResponse } from "next";
import jszip, { JSZipObject } from "jszip";
import { File, IncomingForm } from "formidable";
import { promises as fs } from "fs";

const router = createRouter<NextApiRequest, NextApiResponse>();

router.get(async (req, res) => {
  return res.end();
});

export const config = {
  api: {
    bodyParser: false,
  },
};
export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
