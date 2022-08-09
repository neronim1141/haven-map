// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { createServer } from "@graphql-yoga/node";
import type { NextApiRequest, NextApiResponse } from "next";

import { server } from "../../graphql/server";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default createServer<{
  req: NextApiRequest;
  res: NextApiResponse;
}>(server);
