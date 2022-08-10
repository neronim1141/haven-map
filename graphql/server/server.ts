import { readFileSync } from "node:fs";
import { resolvers } from "./resolvers";
import { YogaNodeServerOptions } from "@graphql-yoga/node";
import { NextApiRequest, NextApiResponse } from "next";
import { Context, CreateContext } from "./context";

const typeDefs = readFileSync(
  process.cwd() + "/graphql/schema.graphql",
  "utf8"
);

export const server: YogaNodeServerOptions<
  { req: NextApiRequest; res: NextApiResponse },
  Context,
  {}
> = {
  schema: {
    typeDefs,
    resolvers,
  },
  context: CreateContext,
};
