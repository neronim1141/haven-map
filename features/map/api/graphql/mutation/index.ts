import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { handleForbidden } from "features/auth/handleForbidden";
import { Context } from "graphql/server";
import { MutationResolvers } from "graphql/server/types";
import { shiftCoord } from "./shiftCoord";

export const Mutations: MutationResolvers<Context> = {
  shiftCoord: async (_, { mapId, shiftBy }, ctx) => {
    if (!canAccess(Role.ALLY, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    await shiftCoord(mapId, shiftBy);
    return true;
  },
};
