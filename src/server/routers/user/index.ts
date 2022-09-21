/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Prisma, Role } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "../../createRouter";
import bcrypt from "bcrypt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { TRPCError } from "@trpc/server";
import { logger } from "utils/logger";
import { prisma } from "utils/prisma";
import { createHash } from "./utils";
const defaultUserSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  name: true,
  role: true,
  token: true,
  createdAt: true,
  updatedAt: true,
});
export const userRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      if (!(await ctx.canAccess(Role.ADMIN))) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }
      return await prisma.user.findMany({ select: defaultUserSelect });
    },
  })
  .query("byId", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input: { id } }) {
      if (ctx.session?.user.id !== id && !(await ctx.canAccess(Role.ADMIN))) {
        throw new TRPCError({
          code: "FORBIDDEN",
        });
      }
      const user = await prisma.user.findUnique({
        where: { id },
        select: defaultUserSelect,
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User has not be found",
        });
      }
      return user;
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.number(),
      role: z.nativeEnum(Role),
    }),
    async resolve({ ctx, input: { id, role } }) {
      try {
        if (!(await ctx.canAccess(Role.ADMIN))) {
          throw new TRPCError({
            code: "FORBIDDEN",
          });
        }
        const user = await prisma.user.update({
          where: {
            id,
          },
          data: {
            role,
          },
          select: defaultUserSelect,
        });
        logger.log(`updated User Role: ${user.name}`);
        return user;
      } catch (e) {
        throw e;
      }
    },
  })
  .mutation("create", {
    input: z.object({
      name: z.string(),
      password: z.string(),
    }),
    async resolve({ ctx, input: { name, password } }) {
      try {
        const user = await prisma.user.create({
          data: {
            name: name.toLowerCase(),
            password: await bcrypt.hash(password.toLowerCase(), 10),
            token: createHash(),
          },
          select: defaultUserSelect,
        });
        logger.log(`created User: ${user.name}`);
        return user;
      } catch (e) {
        logger.error(e);
        if ((e as PrismaClientKnownRequestError).code === "P2002")
          throw new TRPCError({
            code: "CONFLICT",
            message: "User already exist",
          });
        throw e;
      }
    },
  })
  .mutation("delete", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input: { id } }) {
      try {
        if (!(await ctx.canAccess(Role.ADMIN))) {
          throw new TRPCError({
            code: "FORBIDDEN",
          });
        }
        const user = await prisma.user.delete({
          where: { id },
        });
        logger.log(`deleted User : ${user.name}`);

        return user.name;
      } catch (e) {
        logger.error(e);
        throw e;
      }
    },
  })
  .mutation("changePassword", {
    input: z.object({
      id: z.number(),
      oldPassword: z.string(),
      newPassword: z.string(),
    }),
    async resolve({ ctx, input: { id, oldPassword, newPassword } }) {
      try {
        const user = await prisma.user.findUnique({
          where: { id },
        });
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }

        if (!(await bcrypt.compare(oldPassword, user.password))) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Password Missmatch",
          });
        }
        await prisma.user.update({
          where: {
            id,
          },
          data: {
            password: await bcrypt.hash(newPassword.toLowerCase(), 10),
          },
          select: defaultUserSelect,
        });
        logger.log(`updated User password: ${user.name}`);
        return user;
      } catch (e) {
        throw e;
      }
    },
  })
  .mutation("resetPassword", {
    input: z.object({
      id: z.number(),
    }),
    async resolve({ ctx, input: { id } }) {
      try {
        if (!(await ctx.canAccess(Role.ADMIN))) {
          throw new TRPCError({
            code: "FORBIDDEN",
          });
        }

        const password = createHash();

        const user = await prisma.user.findUnique({
          where: { id },
        });
        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "User has not be found",
          });
        }

        await prisma.user.update({
          where: {
            id,
          },
          data: {
            password: await bcrypt.hash(password.toLowerCase(), 10),
          },
          select: defaultUserSelect,
        });
        logger.log(`reseted User password: ${user.name}`);
        return password;
      } catch (e) {
        throw e;
      }
    },
  });
