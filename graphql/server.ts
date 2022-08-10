import { readFileSync } from "node:fs";
import { resolvers } from "./server/resolvers";
import { pubsub } from "../lib/pubsub";
import { YogaNodeServerOptions } from "@graphql-yoga/node";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { Session } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

const typeDefs = readFileSync(
  process.cwd() + "/graphql/schema.graphql",
  "utf8"
);

export type Context = {
  pubsub: typeof pubsub;
  session?: Session | null;
};
export const server: YogaNodeServerOptions<
  { req: NextApiRequest; res: NextApiResponse },
  Context,
  {}
> = {
  schema: {
    typeDefs,
    resolvers,
  },
  context: async ({ req, res }) => {
    const session = await unstable_getServerSession(req, res, authOptions);

    return { pubsub, session };
  },
};
