import React from "react";

import { Role } from "@prisma/client";
import { signOut } from "next-auth/react";
import { NavBarMenu } from "./navBarMenu";
import { HiMap, HiOutlineChip, HiUserCircle } from "react-icons/hi";
import Link from "next/link";
import { useAuth } from "~/contexts/auth";

export const Header = () => {
  const auth = useAuth();
  return (
    <header className="flex w-full bg-neutral-800 pl-2   shadow-2xl">
      <nav className="flex w-full justify-between ">
        <div className="flex items-center   gap-1">
          {auth.canAccess(Role.ALLY) && (
            <Link
              href="/map/[mapId]/[z]/[x]/[y]"
              as="/map/1/6/0/0"
              className="flex items-center gap-1 rounded p-2 font-bold hover:bg-neutral-400 hover:text-neutral-900"
            >
              <HiMap />
              Map
            </Link>
          )}
        </div>
        <div className="flex gap-4 p-2">
          {auth.user ? (
            <>
              {auth.canAccess(Role.ADMIN) && (
                <Link
                  href="/admin"
                  className="flex items-center rounded px-1 font-bold hover:bg-neutral-400 hover:text-neutral-900"
                >
                  <HiOutlineChip className="h-6 w-6" />
                </Link>
              )}

              <NavBarMenu icon={<HiUserCircle />}>
                <Link href={`/profile`} className="block w-full p-1">
                  Profile
                </Link>

                <button
                  onClick={() => {
                    signOut({ redirect: true });
                  }}
                  className="w-full p-1"
                >
                  Log out
                </button>
              </NavBarMenu>
            </>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1 p-2 hover:bg-neutral-600"
            >
              Log In
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
