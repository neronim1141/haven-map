import { readFileSync } from "node:fs";
import { resolvers } from "./server/resolvers";
import { pubsub } from "../lib/pubsub";
const typeDefs = readFileSync(
  process.cwd() + "/graphql/schema.graphql",
  "utf8"
);
export const server = {
  schema: {
    typeDefs,
    resolvers,
  },
  context: { pubsub },
};
