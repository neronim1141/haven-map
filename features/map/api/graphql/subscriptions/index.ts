import { map, pipe, Repeater } from "@graphql-yoga/node";
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
      return Repeater.merge([
        // cause an initial event so the
        // globalCounter is streamed to the client
        // upon initiating the subscription
        undefined,
        pubsub.subscribe("tileUpdate", id),
      ]);
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
      return Repeater.merge([
        // cause an initial event so the
        // globalCounter is streamed to the client
        // upon initiating the subscription
        undefined,
        pubsub.subscribe("merge"),
      ]);
    },
    resolve: (payload: MapMerge) => payload,
  },
  characters: {
    subscribe: (_, {}, ctx) => {
      if (!canAccess(Role.VILLAGER, ctx?.session?.user?.role)) {
        handleForbidden();
      }
      return pipe(pubsub.subscribe("characters"));
    },
    resolve: (payload: Character[]) => payload,
  },
};
