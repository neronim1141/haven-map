import { Role } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "~/pages/api/auth/[...nextauth]";
import { canAccess } from "./routers/user/utils";
export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const session = await unstable_getServerSession(req, res, authOptions);

  return {
    req,
    res,
    session,
    canAccess: async (role: Role) => canAccess(role, session?.user.id),
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
