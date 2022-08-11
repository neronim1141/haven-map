import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React from "react";

export const NavUser = () => {
  const session = useSession();
  const router = useRouter();
  return (
    <>
      <div>{session.data?.user?.name}</div>
      <button
        onClick={() =>
          signOut({ redirect: false }).then(() => router.push("/login"))
        }
      >
        logout
      </button>
    </>
  );
};
