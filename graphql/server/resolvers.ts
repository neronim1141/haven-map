import { pubsub } from "../../lib/pubsub";
import { prisma } from "../../lib/prisma";
import { Resolvers, Tile, MapMerge, Marker, Character } from "./types";
import { shiftMap } from "features/map/api/utils/shiftMap";
import { map, pipe } from "@graphql-yoga/node";

export const config = {
  api: {
    bodyParser: false,
  },
};
export const resolvers: Resolvers = {
  Query: {
    map: async (_, { id }) => {
      return await prisma.tile.findMany({
        where: {
          AND: [{ mapId: id }],
        },
      });
    },
    maps: async () => {
      return await prisma.map.findMany();
    },
    markers: async (_, { hidden }) => {
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
    mapUpdates: {
      subscribe: (_, { id }) => pubsub.subscribe("tileUpdate", id),
      resolve: (payload: Tile) => {
        return payload;
      },
    },
    mapMerges: {
      subscribe: (_, { id }) => pubsub.subscribe("merge", id),
      resolve: (payload: MapMerge) => payload,
    },
    characters: {
      subscribe: (_, { ids }) =>
        pipe(
          pubsub.subscribe("characters"),
          map((characters) =>
            characters.filter((character) => ids.includes(character.inMap))
          )
        ),
      resolve: (payload: Character[]) => payload,
    },
  },
  Mutation: {
    shiftCoord: async (_, { mapId, shiftBy }) => {
      await shiftMap(mapId, shiftBy);
      return { x: 0, y: 0 };
    },
  },
};
