import { Role } from "@prisma/client";

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
