import { Resolvers } from "./types";
import * as mapper from "features/map/api/graphql";
import { GraphqlContext } from "./context";

export const config = {
  api: {
    bodyParser: false,
  },
};
export const resolvers: Resolvers<GraphqlContext> = {
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
