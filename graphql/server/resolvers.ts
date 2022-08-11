import { Resolvers } from "./types";
import * as mapper from "features/map/api/graphql";
import * as auth from "features/auth/graphql";
import { GraphqlContext } from "./context";

export const config = {
  api: {
    bodyParser: false,
  },
};
export const resolvers: Resolvers<GraphqlContext> = {
  Query: {
    ...mapper.Query,
    ...auth.Query,
  },
  Subscription: {
    ...mapper.Subscriptions,
  },
  Mutation: {
    ...mapper.Mutations,
    ...auth.Mutations,
  },
};
