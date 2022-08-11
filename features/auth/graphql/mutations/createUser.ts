import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
import bcrypt from "bcrypt";
import { createToken } from "../../createToken";
import { GraphQLYogaError } from "@graphql-yoga/node";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const createUser = async (login: string, password: string) => {
  try {
    const { password: _, ...user } = await prisma.user.create({
      data: {
        name: login,
        password: await bcrypt.hash(password, 10),
        token: createToken(login),
      },
    });
    logger.log(`created User: ${user.name}`);
    return user;
  } catch (e) {
    console.log(e);
    if ((e as PrismaClientKnownRequestError).code === "P2002")
      throw new GraphQLYogaError(`User already exist`);
    throw e;
  }
};
