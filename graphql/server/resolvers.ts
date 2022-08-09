import { pubsub } from "../../lib/pubsub";
import { prisma } from "../../lib/prisma";
import { Resolvers, Tile, MapMerge, Marker } from "./types";
import { shiftMap } from "features/map/api/utils/shiftMap";

export const config = {
  api: {
    bodyParser: false,
  },
};
export const resolvers: Resolvers = {
  Query: {
    getMapData: async (_, { id }) => {
      return await prisma.tile.findMany({
        where: {
          AND: [{ mapId: id }],
        },
      });
    },
    getMaps: async () => {
      return await prisma.map.findMany();
    },
    getMarkers: async (_, { hidden }) => {
      const markers = await prisma.marker.findMany({
        where: { hidden },
      });
      const toSend: Marker[] = [];
      //TODO: optimize
      for (let marker of markers) {
        const grid = await prisma.grid.findUnique({
          where: { id: marker.gridId },
        });
        const icon = await prisma.markerIcon.findUnique({
          where: { image: marker.image },
        });
        if (grid)
          toSend.push({
            ...marker,
            image: !!icon ? marker.image : undefined,
            mapId: grid.mapId,
            x: marker.x + grid.x * 100,
            y: marker.y + grid.y * 100,
          });
      }
      return toSend;
    },
  },
  Subscription: {
    getMapUpdates: {
      subscribe: (_, { id }) => pubsub.subscribe("tileUpdate", id),
      resolve: (payload: Tile) => {
        return payload;
      },
    },
    MapMerges: {
      subscribe: (_, { id }) => pubsub.subscribe("merge", id),
      resolve: (payload: MapMerge) => payload,
    },
  },
  Mutation: {
    setCenterCoord: async (_, { mapId, shiftBy }) => {
      await shiftMap(mapId, shiftBy);
      return { x: 0, y: 0 };
    },
  },
};
