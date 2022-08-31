import { createRouter } from "next-connect";
import { prisma } from "lib/prisma";
import type { NextApiRequest } from "next";
import { logger } from "lib/logger";
import { NextApiResponseServerIO } from "../../socketio";
export type PositionUpdateRequest = {
  [id: string]: {
    name: string;
    gridID: string;
    type: string;
    coords: {
      x: number;
      y: number;
    };
  };
};

export interface CharacterData {
  id: string;
  name: string;
  type: string;
  inMap: number;
  x: number;
  y: number;
  expire: number;
}

const router = createRouter<NextApiRequest, NextApiResponseServerIO>();

router.post(async (req, res) => {
  if (!req.query.token) {
    logger.error("positionUpdate from: no token");
    return res.status(403).end();
  }
  const user = await prisma.user.findFirst({
    where: {
      token: req.query.token as string,
    },
  });
  logger.log("positionUpdate from: " + user?.name);
  if (!user) return res.status(403).end();

  const flatData: CharacterData[] = [];
  for (let [id, { coords, gridID, ...characterData }] of Object.entries(
    req.body as PositionUpdateRequest
  )) {
    const grid = await prisma?.grid.findUnique({
      where: { id: gridID },
    });
    if (grid && characterData.name) {
      logger.log("position for: " + characterData.name);
      flatData.push({
        ...characterData,
        id,
        inMap: grid.mapId,
        x: coords.x + grid.x * 100,
        y: coords.y + grid.y * 100,
        expire: new Date(Date.now() + 10000).getTime(),
      });
    }
  }
  res?.socket?.server?.io?.emit("characters", flatData);
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
