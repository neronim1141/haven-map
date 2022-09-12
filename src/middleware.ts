import { withAuth, NextRequestWithAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { Role, User } from "@prisma/client";
import { canAccess } from "./contexts/auth";
export default withAuth(
  async (req: NextRequestWithAuth) => {
    if (req.nextUrl.pathname === "/map") {
      return NextResponse.redirect(new URL("/map/1/6/0/0", req.nextUrl.origin));
    }
    if (req.nextUrl.pathname === "/profile" && req.nextauth.token?.id) {
      return NextResponse.redirect(
        new URL(`/profile/${req.nextauth.token.id}`, req.nextUrl.origin)
      );
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: async function ({ req, token }) {
        if (!token) return false;
        const res = await fetch(
          "http://localhost:3000/api/auth/user/" + token.id
        );
        const user: User = await res.json();
        if (
          req.nextUrl.pathname.startsWith("/map") &&
          (!user || !canAccess(Role.ALLY, user.role))
        )
          return false;
        if (
          req.nextUrl.pathname.startsWith("/admin") &&
          (!user || !canAccess(Role.ADMIN, user.role))
        )
          return false;

        return true;
      },
    },
  }
);
export const config = {
  matcher: ["/map/:path*", "/admin/:path*", "/profile/:path*"],
};
