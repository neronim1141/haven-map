import { GraphqlContext } from "graphql/server";
import { MutationResolvers } from "graphql/server/types";
import { createUser } from "./createUser";

export const Mutations: MutationResolvers<GraphqlContext> = {
  createUser: async (_, { login, password }, ctx) => {
    return await createUser(login, password);
  },
};
