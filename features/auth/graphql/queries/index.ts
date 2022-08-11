import { GraphQLYogaError } from "@graphql-yoga/node";
import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { handleForbidden } from "features/auth/handleForbidden";
import { excludeFields } from "features/auth/utils/excludePassword";
import { GraphqlContext } from "graphql/server";
import { QueryResolvers } from "graphql/server/types";
import { prisma } from "lib/prisma";

export const Query: QueryResolvers<GraphqlContext> = {
  users: async (_, {}, ctx) => {
    if (!canAccess(Role.ADMIN, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    return (await prisma.user.findMany()).map((user) =>
      excludeFields(user, "password")
    );
  },
  user: async (_, { name }, ctx) => {
    if (
      ctx?.session?.user?.role !== name ||
      !canAccess(Role.ADMIN, ctx?.session?.user?.role)
    ) {
      handleForbidden();
    }
    const user = await prisma.user.findUnique({ where: { name } });
    if (!user) throw new GraphQLYogaError("Not Found");
    return excludeFields(user, "password");
  },
};
