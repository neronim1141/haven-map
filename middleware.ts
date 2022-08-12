import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { canAccess } from "features/auth/canAccess";
import { Role } from "@prisma/client";

export default withAuth(
  (req: NextRequest) => {
    if (req.nextUrl.pathname === "/map") {
      return NextResponse.redirect(new URL("/map/1/6/0/0", req.nextUrl.origin));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: function ({ req, token }) {
        if (!token) return false;
        if (
          req.nextUrl.pathname.startsWith("/map") &&
          !canAccess(Role.ALLY, token.role)
        )
          return false;
        if (
          req.nextUrl.pathname.startsWith("/admin") &&
          !canAccess(Role.ADMIN, token.role)
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
