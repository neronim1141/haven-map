import { NextApiRequest, NextApiResponse } from "next";
import { Session, unstable_getServerSession } from "next-auth";
import { authOptions } from "pages/api/auth/[...nextauth]";

export type Context = {
  pubsub: typeof pubsub;
  session?: Session | null;
};

export const CreateContext = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}): Promise<Context> => {
  const session = await unstable_getServerSession(req, res, authOptions);

  return { pubsub, session };
};
