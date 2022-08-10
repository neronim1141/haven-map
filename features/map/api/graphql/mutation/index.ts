import { MutationResolvers } from "graphql/server/types";
import { shiftCoord } from "./shiftCoord";

export const Mutations: MutationResolvers = {
  shiftCoord: async (_, { mapId, shiftBy }) => {
    await shiftCoord(mapId, shiftBy);
    return true;
  },
};
