import React from "react";

import { Role } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { NavBarMenu } from "./navBarMenu";
import { HiMap, HiOutlineChip, HiUserCircle } from "react-icons/hi";
import { canAccess } from "~/server/routers/user/utils";
import Link from "next/link";

export const Header = () => {
  const { data } = useSession();

  return (
    <header className="flex shadow-2xl bg-neutral-800 pl-2   w-full">
      <nav className="flex justify-between w-full ">
        <div className="flex gap-1   items-center">
          {data && canAccess(Role.ADMIN, data.user.role) && (
            <Link href="/map/[mapId]/[z]/[x]/[y]" as="/map/1/6/0/0">
              <a className="flex gap-1 p-2 items-center rounded hover:bg-neutral-400 font-bold hover:text-neutral-900">
                <HiMap />
                Map
              </a>
            </Link>
          )}
        </div>
        <div className="flex gap-4 p-2">
          {data ? (
            <>
              <Link href="/admin">
                <a className="flex px-1 items-center rounded hover:bg-neutral-400 font-bold hover:text-neutral-900">
                  <HiOutlineChip className="w-6 h-6" />
                </a>
              </Link>

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
              <a className="flex gap-1 p-2 items-center hover:bg-neutral-600">
                Log In
              </a>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
};
