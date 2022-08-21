import React from "react";

import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { useSession } from "next-auth/react";
import Link, { LinkProps } from "next/link";

export interface NavLinkProps extends LinkProps {
  requiredRole?: Role;
  href: string;
  children: string;
}
export const NavLink = ({
  href,
  children,
  requiredRole,
  ...rest
}: NavLinkProps) => {
  const { data } = useSession();

  if (!!requiredRole && !canAccess(requiredRole, data?.user?.role)) {
    return null;
  }
  return (
    <Link href={href} {...rest}>
      <a className="p-2 border-b-2 hover:border-indigo-600 transition-colors hover:text-indigo-400">
        {children}
      </a>
    </Link>
  );
};
