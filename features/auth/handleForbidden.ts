import { GraphQLYogaError } from "@graphql-yoga/node";

export const handleForbidden = () => {
  throw new GraphQLYogaError("Forbidden");
};
