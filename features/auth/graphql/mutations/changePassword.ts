import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
import bcrypt from "bcrypt";
import { excludeFields } from "features/auth/utils/excludePassword";
import { GraphQLYogaError } from "@graphql-yoga/node";

export const changePassword = async (
  name: string,
  oldPassword: string,
  password: string
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { name: name.toLowerCase() },
    });
    if (!user) {
      throw new GraphQLYogaError("Something went wrong");
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      throw new GraphQLYogaError("Password Missmatch");
    }
    await prisma.user.update({
      where: {
        name: name.toLowerCase(),
      },
      data: {
        password: await bcrypt.hash(password.toLowerCase(), 10),
      },
    });
    logger.log(`updated User password: ${user.name}`);
    return excludeFields(user, "password");
  } catch (e) {
    throw e;
  }
};
