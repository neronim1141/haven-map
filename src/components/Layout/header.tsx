import React from "react";

import { Role } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { NavBarMenu } from "./navBarMenu";
import { HiMap, HiOutlineChip, HiUserCircle } from "react-icons/hi";
import { canAccess } from "~/server/routers/user/utils";
import Link from "next/link";

export const Header = () => {
  const { data } = useSession();

  return (
    <header className="flex w-full bg-neutral-800 pl-2   shadow-2xl">
      <nav className="flex w-full justify-between ">
        <div className="flex items-center   gap-1">
          {data && canAccess(Role.ALLY, data.user.role) && (
            <Link href="/map/[mapId]/[z]/[x]/[y]" as="/map/1/6/0/0">
              <a className="flex items-center gap-1 rounded p-2 font-bold hover:bg-neutral-400 hover:text-neutral-900">
                <HiMap />
                Map
              </a>
            </Link>
          )}
        </div>
        <div className="flex gap-4 p-2">
          {data ? (
            <>
              {canAccess(Role.ADMIN, data.user.role) && (
                <Link href="/admin">
                  <a className="flex items-center rounded px-1 font-bold hover:bg-neutral-400 hover:text-neutral-900">
                    <HiOutlineChip className="h-6 w-6" />
                  </a>
                </Link>
              )}

              <NavBarMenu icon={<HiUserCircle />}>
                <Link href={`/profile/${data.user.name}`}>
                  <a>Profile</a>
                </Link>

                <button
                  onClick={() => {
                    signOut({ redirect: true });
                  }}
                >
                  Log out
                </button>
              </NavBarMenu>
            </>
          ) : (
            <Link href="/login">
              <a className="flex items-center gap-1 p-2 hover:bg-neutral-600">
                Log In
              </a>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
