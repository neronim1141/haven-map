import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "utils/prisma";
import { Role, User } from "@prisma/client";
import { logger } from "utils/logger";
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
          const login = credentials.login.toLowerCase();
          const providedPassowrd = credentials.password.toLowerCase();
          const data = await prisma.user.findUnique({
            where: { name: login },
          });
          if (!data) return null;
          if (data.role === Role.NEED_CHECK) {
            return Promise.reject(
              new Error("Wait until you are checked by admin")
            );
          }
          const { password, ...user } = data;
          if (!(await bcrypt.compare(providedPassowrd, password)))
            return Promise.reject(new Error("Password missmatch"));
          return user as Omit<User, "password">;
        } catch (e) {
          logger.error(e);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
  },
};
export default NextAuth(authOptions);
