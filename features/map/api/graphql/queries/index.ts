import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { handleForbidden } from "features/auth/handleForbidden";
import { GraphqlContext } from "graphql/server";
import { Marker, QueryResolvers } from "graphql/server/types";
import { prisma } from "lib/prisma";

export const Query: QueryResolvers<GraphqlContext> = {
  maps: async (_, {}, ctx) => {
    if (!canAccess(Role.ALLY, ctx?.session?.user?.role)) {
      handleForbidden();
    }
    return await prisma.map.findMany();
  },
  markers: async (_, { hidden }, ctx) => {
    if (!canAccess(Role.ALLY, ctx?.session?.user?.role)) {
      handleForbidden();
    }

    const markers = await prisma.marker.findMany({
      where: { hidden },
    });
    const toSend: Marker[] = [];
    //TODO: optimize
    for (let marker of markers) {
      const grid = await prisma.grid.findUnique({
        where: { id: marker.gridId },
      });

      if (grid)
        toSend.push({
          ...marker,
          image: marker.image,
          mapId: grid.mapId,
          x: marker.x + grid.x * 100,
          y: marker.y + grid.y * 100,
        });
    }
    return toSend;
  },
};
