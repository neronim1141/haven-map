import { Role } from "@prisma/client";
import crypto from "crypto";
import { prisma } from "utils/prisma";

export const canAccess = async (requiredRole: Role, id?: number) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || getAccessLevel(requiredRole) > getAccessLevel(user.role))
    return false;
  return true;
};
export const getAccessLevel = (role: Role) =>
  ({
    [Role.ADMIN]: 4,
    [Role.VILLAGER]: 3,
    [Role.ALLY]: 2,
    [Role.NEED_CHECK]: 1,
  }[role]);

export const createHash = () => {
  return crypto.randomBytes(8).toString("hex");
};
