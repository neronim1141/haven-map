import { signOut, useSession } from "next-auth/react";
import React from "react";

export const NavUser = () => {
  const session = useSession();
  return (
    <>
      <div>{session.data?.user?.name}</div>
      <button onClick={() => signOut()}>logout</button>
    </>
  );
};
