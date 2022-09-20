import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "utils/prisma";
import { Prisma } from "@prisma/client";

const router = createRouter<NextApiRequest, NextApiResponse>();
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  role: true,
  token: true,
});
router.get(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(req.query.id) },
    select: defaultUserSelect,
  });

  return res.json(user);
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
