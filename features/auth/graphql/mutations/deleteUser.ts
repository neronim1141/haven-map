import { prisma } from "lib/prisma";
import * as logger from "lib/logger";

export const deleteUser = async (name: string) => {
  try {
    const user = await prisma.user.delete({
      where: { name: name.toLowerCase() },
    });
    logger.log(`deleted User : ${user.name}`);

    return user.name;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};
