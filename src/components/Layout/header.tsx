import React from "react";

import { Role } from "@prisma/client";
import { NavLink } from "src/components/NavLink/NavLink";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Header = () => {
  const { data } = useSession();
  const router = useRouter();

  return (
    <header className="flex shadow-2xl bg-gray-800 pl-2   w-full">
      <nav className="flex justify-between w-full ">
        <div className="flex gap-1">
          <NavLink
            requiredRole={Role.ALLY}
            href="/map/[mapId]/[z]/[x]/[y]"
            as="/map/1/6/0/0"
          >
            Map
          </NavLink>
        </div>
        <div className="flex gap-1">
          <NavLink href="/admin/maps" requiredRole={Role.ADMIN}>
            Maps
          </NavLink>
          <NavLink href="/admin/users" requiredRole={Role.ADMIN}>
            Users
          </NavLink>
          <div className="flex gap-1 ml-12">
            {data ? (
              <>
                <div className="p-2 border-b-2">
                  <Link href={`/profile/${data.user.name}`}>
                    <a>Hi {data.user.name}</a>
                  </Link>
                </div>
                <button
                  className="bg-gray-500 text-black p-1  font-bold  hover:bg-gray-300 transition-colors"
                  onClick={() =>
                    signOut({ redirect: false }).then(() =>
                      router.push("/login")
                    )
                  }
                >
                  Log out
                </button>
              </>
            ) : (
              <NavLink href="/login">Log In</NavLink>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
};
