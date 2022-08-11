import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
import bcrypt from "bcrypt";
import { createToken } from "../../createToken";
import { GraphQLYogaError } from "@graphql-yoga/node";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { excludeFields } from "features/auth/utils/excludePassword";

export const createUser = async (name: string, password: string) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        password: await bcrypt.hash(password, 10),
        token: createToken(name),
      },
    });
    logger.log(`created User: ${user.name}`);
    return excludeFields(user, "password");
  } catch (e) {
    console.log(e);
    if ((e as PrismaClientKnownRequestError).code === "P2002")
      throw new GraphQLYogaError(`User already exist`);
    throw e;
  }
};
