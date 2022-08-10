import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "lib/prisma";
import { User } from "@prisma/client";
import * as logger from "lib/logger";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.login || !credentials?.password) return null;

          const data = await prisma.user.findUnique({
            where: { name: credentials.login },
          });
          if (!data) return null;
          const { password, ...user } = data;
          if (!(await bcrypt.compare(credentials.password, password)))
            return null;
          return user as Omit<User, "password">;
        } catch (e) {
          logger.error(e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET,
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = token.user as User | undefined;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.user = user;
      return token;
    },
  },

  debug: process.env.NODE_ENV === "development",
};
export default NextAuth(authOptions);
