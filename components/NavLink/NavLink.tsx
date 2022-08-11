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
      <a className="bg-gray-400 p-1 rounded  font-bold  hover:bg-gray-300 transition-colors">
        {children}
      </a>
    </Link>
  );
};
