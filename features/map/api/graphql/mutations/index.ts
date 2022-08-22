import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { handleForbidden } from "features/auth/handleForbidden";
import { GraphqlContext } from "graphql/server";
import { MutationResolvers } from "graphql/server/types";
import { deleteMap } from "./deleteMap";
import { hideMap } from "./hideMap";
import { importMap } from "./importMap";
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
  deleteMap: async (_, { mapId }, ctx) => {
    if (!canAccess(Role.ADMIN, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    await deleteMap(mapId);
    return true;
  },
  hideMap: async (_, { mapId }, ctx) => {
    if (!canAccess(Role.ADMIN, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    await hideMap(mapId);
    return true;
  },
  importMap: async (_, { file }: { file: File }) => {
    await importMap(file);
    return "test";
  },
};
