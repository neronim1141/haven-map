import { map, pipe } from "@graphql-yoga/node";
import { Context } from "graphql/server/context";
import {
  Character,
  MapMerge,
  SubscriptionResolvers,
  Tile,
} from "graphql/server/types";
import { pubsub } from "lib/pubsub";

export const Subscriptions: SubscriptionResolvers<Context, {}> = {
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
};
