import { Role } from "@prisma/client";
import { getAccessLevel } from "./getAccessLevel";

export const canAccess = (requiredRole: Role, role?: Role) => {
  if (!role || getAccessLevel(requiredRole) > getAccessLevel(role))
    return false;
  return true;
};
