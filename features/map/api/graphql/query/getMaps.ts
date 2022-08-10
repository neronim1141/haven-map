import { prisma } from "lib/prisma";

export const getMaps = () => {
  return prisma.map.findMany();
};
