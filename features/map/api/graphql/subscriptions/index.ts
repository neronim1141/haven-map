import { map, pipe } from "@graphql-yoga/node";
import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { handleForbidden } from "features/auth/handleForbidden";
import { GraphqlContext } from "graphql/server/context";
import {
  Character,
  MapMerge,
  SubscriptionResolvers,
  Tile,
} from "graphql/server/types";
import { pubsub } from "lib/pubsub";

export const Subscriptions: SubscriptionResolvers<GraphqlContext, {}> = {
  mapUpdates: {
    subscribe: (_, { id }, ctx) => {
      if (!canAccess(Role.ALLY, ctx?.session?.user?.role)) {
        handleForbidden();
      }
      return pubsub.subscribe("tileUpdate", id);
    },
    resolve: (payload: Tile) => {
      return payload;
    },
  },
  mapMerges: {
    subscribe: (_, {}, ctx) => {
      if (!canAccess(Role.ALLY, ctx?.session?.user?.role)) {
        handleForbidden();
      }
      return pubsub.subscribe("merge");
    },
    resolve: (payload: MapMerge) => payload,
  },
  characters: {
    subscribe: (_, { ids }, ctx) => {
      if (!canAccess(Role.ALLY, ctx?.session?.user?.role)) {
        handleForbidden();
      }
      return pipe(
        pubsub.subscribe("characters"),
        map((characters) =>
          characters.filter((character) => ids.includes(character.inMap))
        )
      );
    },
    resolve: (payload: Character[]) => payload,
  },
};
