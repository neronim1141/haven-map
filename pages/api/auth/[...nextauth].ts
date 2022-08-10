import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "lib/prisma";
import { verifyPassword } from "features/auth/verifyPassword";
import { User } from "@prisma/client";
import * as logger from "lib/logger";
export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        login: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // If no error and we have user data, return it
        try {
          if (!credentials?.login || !credentials?.password) return null;

          const data = await prisma.user.findUnique({
            where: { name: credentials.login },
          });
          if (!data) return null;
          const { password, ...user } = data;
          if (!verifyPassword(password, credentials.password)) return null;
          return user;
        } catch (e) {
          logger.error(e);
          return null;
        }
      },
    }),
  ],
  secret: process.env.JWT_SECRET ?? "secret",
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
  session: {
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
};
export default NextAuth(authOptions);
