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

      const mappedMarker = mapMarkerType(marker);
      if (grid)
        toSend.push({
          ...mappedMarker,
          image: mappedMarker.image,
          mapId: grid.mapId,
          x: marker.x + grid.x * 100,
          y: marker.y + grid.y * 100,
        });
    }
    return toSend;
  },
};

const mapMarkerType = ({
  type: markerType,
  image,
  name,
  ...rest
}: Omit<Marker, "mapId">) => {
  let type = markerType;
  if (["cave", "exit"].includes(name.toLowerCase())) {
    image = "gfx/terobjs/mm/cavein";
    name = "Cave";
    type = "shared";
  }
  if (name.toLowerCase() === "tarpit") {
    image = "gfx/terobjs/mm/tarpit";
    name = "Tarpit";
    type = "shared";
  }
  if (
    image === "gfx/invobjs/small/bush" ||
    image === "gfx/invobjs/small/bumling"
  ) {
    type = "quest";
  }
  return { ...rest, name, image, type };
};
