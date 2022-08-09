import { createPubSub, PubSub } from "@graphql-yoga/node";
import { Tile } from "@prisma/client";

type PubSubData = {
  tileUpdate: [mapId: number, payload: Tile];
  merge: [
    from: number,
    payload: { to: number; shift: { x: number; y: number } }
  ];
};

declare global {
  // allow global `var` declarations
  // eslint-disable-next-line no-var
  var pubsub: PubSub<PubSubData> | undefined;
}

export const pubsub = global.pubsub || createPubSub<PubSubData>();

if (process.env.NODE_ENV !== "production") global.pubsub = pubsub;
