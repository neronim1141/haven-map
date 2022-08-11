import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
import bcrypt from "bcrypt";
import { excludeFields } from "features/auth/utils/excludePassword";

export const changePassword = async (name: string, password: string) => {
  try {
    const user = await prisma.user.update({
      where: {
        name,
      },
      data: {
        password: await bcrypt.hash(password, 10),
      },
    });
    logger.log(`updated User password: ${user.name}`);
    return excludeFields(user, "password");
  } catch (e) {
    throw e;
  }
};
