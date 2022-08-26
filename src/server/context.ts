import { PrismaClient } from "@prisma/client";
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";
import { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/declarations/src/adapters/node-http";
import { IncomingMessage } from "http";
import ws from "ws";
import * as logger from "../../lib/logger";
import { prisma } from "../../lib/prisma";

export const createContext = async ({
  req,
  res,
}:
  | trpcNext.CreateNextContextOptions
  | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>) => {
  return {
    req,
    res,
    prisma,
    logger,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
