import { Role } from "@prisma/client";
import crypto from "crypto";
export const canAccess = (requiredRole: Role, role?: Role) => {
  if (!role || getAccessLevel(requiredRole) > getAccessLevel(role))
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
