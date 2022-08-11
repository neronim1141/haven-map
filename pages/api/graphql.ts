// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createServer } from "@graphql-yoga/node";
import { GraphqlContext, server } from "graphql/server";
import type { NextApiRequest, NextApiResponse } from "next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createServer<
  {
    req: NextApiRequest;
    res: NextApiResponse;
  },
  GraphqlContext,
  {}
>(server);
