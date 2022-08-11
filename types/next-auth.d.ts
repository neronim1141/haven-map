import { Role } from "@prisma/client";
import NextAuth from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    name: !string;
    role: Role;
  }
  interface Session {
    user: {
      name: string;
      role: Role;
    };
  }
}
declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */

  interface JWT {
    role: Role;
  }
}
