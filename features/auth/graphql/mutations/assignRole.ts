import { prisma } from "lib/prisma";
import * as logger from "lib/logger";
import bcrypt from "bcrypt";
import { excludeFields } from "features/auth/utils/excludePassword";
import { Role } from "@prisma/client";

export const assignRole = async (name: string, role: Role) => {
  try {
    const user = await prisma.user.update({
      where: {
        name,
      },
      data: {
        role,
      },
    });
    logger.log(`updated User Role: ${user.name}`);
    return excludeFields(user, "password");
  } catch (e) {
    throw e;
  }
};
