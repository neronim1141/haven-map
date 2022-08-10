import { Resolvers } from "./types";
import * as mapper from "features/map/api/graphql";
import { Context } from "./context";

export const config = {
  api: {
    bodyParser: false,
  },
};
export const resolvers: Resolvers<Context> = {
  Query: {
    ...mapper.Query,
  },
  Subscription: {
    ...mapper.Subscriptions,
  },
  Mutation: {
    ...mapper.Mutations,
  },
};
