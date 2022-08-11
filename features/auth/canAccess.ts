import { Role } from "@prisma/client";
import { getAccessLevel } from "./getAccessLevel";

export const canAccess = (accessRole: Role, role?: Role) => {
  if (!role || getAccessLevel(accessRole) > getAccessLevel(role)) return false;
  return true;
};
