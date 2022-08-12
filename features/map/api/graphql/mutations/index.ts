import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { handleForbidden } from "features/auth/handleForbidden";
import { GraphqlContext } from "graphql/server";
import { MutationResolvers } from "graphql/server/types";
import { rebuildZooms } from "./rebuildZooms";
import { shiftCoord } from "./shiftCoord";

export const Mutations: MutationResolvers<GraphqlContext> = {
  shiftCoord: async (_, { mapId, shiftBy }, ctx) => {
    if (!canAccess(Role.ALLY, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    await shiftCoord(mapId, shiftBy);
    return true;
  },
  rebuildZooms: async (_, { mapId }, ctx) => {
    if (!canAccess(Role.ADMIN, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    await rebuildZooms(mapId);
    return true;
  },
};
