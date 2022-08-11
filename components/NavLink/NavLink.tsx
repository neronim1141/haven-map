import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { useSession } from "next-auth/react";
import Link from "next/link";

export const NavLink = ({
  href,
  children,
  requiredRole,
}: {
  requiredRole?: Role;
  href: string;
  children: string;
}) => {
  const { data } = useSession();

  if (!!requiredRole && !canAccess(requiredRole, data?.user?.role)) {
    return null;
  }
  return (
    <Link href={href}>
      <a className="p-2 border-b-2 hover:border-indigo-600 transition-colors hover:text-indigo-400">
        {children}
      </a>
    </Link>
  );
};
