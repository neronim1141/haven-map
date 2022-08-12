import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { handleForbidden } from "features/auth/handleForbidden";
import { GraphqlContext } from "graphql/server";
import { MutationResolvers } from "graphql/server/types";
import { verify } from "node:crypto";
import { assignRole } from "./assignRole";
import { changePassword } from "./changePassword";
import { createUser } from "./createUser";
import { deleteUser } from "./deleteUser";

export const Mutations: MutationResolvers<GraphqlContext> = {
  createUser: async (_, { name, password }, ctx) => {
    return (await createUser(name, password)).name;
  },
  deleteUser: async (_, { name }, ctx) => {
    if (!canAccess(Role.ADMIN, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    return await deleteUser(name);
  },
  changePassword: async (_, { name, password, newPassword }, ctx) => {
    if (
      ctx?.session?.user?.name !== name &&
      !canAccess(Role.ADMIN, ctx?.session?.user?.role)
    ) {
      handleForbidden();
    }
    return (await changePassword(name, password, newPassword)).name;
  },
  assignRole: async (_, { name, role }, ctx) => {
    if (!canAccess(Role.ADMIN, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    return (await assignRole(name, role as Role)).name;
  },
};
