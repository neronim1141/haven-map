import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";
import { pubsub } from "lib/pubsub";
import * as logger from "lib/logger";
export type GraphqlContext = {
  pubsub: typeof pubsub;
  session?: Session | null;
};

export const CreateContext = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<GraphqlContext> => {
  try {
    const session = await unstable_getServerSession(req, res, authOptions);

    return { pubsub, session };
  } catch (e) {
    logger.error(e);
    return { pubsub };
  }
};
