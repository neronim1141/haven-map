import React from "react";

import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { useUserQuery } from "graphql/client/graphql";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Page = () => {
  const session = useSession();
  const router = useRouter();
  const queryName = router.query.name as string;
  const user = useUserQuery({
    variables: {
      name: queryName,
    },
  });

  if (session.status === "loading" || user.loading) {
    return <>loading</>;
  }

  if (
    !session.data ||
    (session.data.user.name !== queryName &&
      session.data.user.role !== Role.ADMIN)
  ) {
    router.push("/");
    return;
  }
  return (
    <div className="p-2 flex flex-col gap-2">
      <div>Your token is: {user.data?.user?.token}</div>
      <div>
        Paste this into client: {window.location.origin}/api/client/
        {user.data?.user?.token}
      </div>
    </div>
  );
};

export default Page;
