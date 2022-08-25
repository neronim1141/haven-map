import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import * as logger from "lib/logger";
import { prisma } from "lib/prisma";
import { canAccess } from "features/auth/canAccess";
import { Role } from "@prisma/client";

export type MarkersRequest = {
  id: number;
  image: string;
  x: number;
  y: number;
  gridID: string;
  name: string;
  type: string;
  color?: string;
}[];

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res) => {
  return res.end();

  // logger.log("markerUpdate");
  // if (!req.query.token) {
  //   logger.error("gridUpdate from: no token");
  //   return res.status(403).end();
  // }
  // const user = await prisma.user.findFirst({
  //   where: {
  //     token: req.query.token as string,
  //   },
  // });
  // logger.log("markerUpdate from: " + user?.name);

  // if (!user) return res.status(403).end();

  // if (!canAccess(Role.VILLAGER, user?.role)) return;

  // for (let marker of req.body as MarkersRequest) {
  //   const { gridID, color, ...data } = marker;
  //   const grid = await prisma.grid.findUnique({ where: { id: gridID } });
  //   if (!grid) continue;

  //   const id = `${grid.id}_${data.x}_${data.y}`;
  //   await prisma.marker.upsert({
  //     where: {
  //       id,
  //     },
  //     update: {
  //       ...data,
  //       id,
  //       gridId: gridID,
  //     },
  //     create: {
  //       ...data,
  //       id,
  //       gridId: gridID,
  //     },
  //   });
  // }

  // res.end();
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
