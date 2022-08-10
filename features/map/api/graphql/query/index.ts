import { Context } from "graphql/server";
import { QueryResolvers } from "graphql/server/types";
import { getMap } from "./getMap";
import { getMaps } from "./getMaps";
import { getMarkers } from "./getMarkers";

export const Query: QueryResolvers<Context> = {
  map: async (_, { id }, ctx) => {
    if (!!ctx.session?.user?.role) {
      throw new Error("forbidden");
    }
    return await getMap(id);
  },
  maps: async () => {
    return await getMaps();
  },
  markers: async (_, { hidden }) => {
    return await getMarkers(hidden);
  },
};
