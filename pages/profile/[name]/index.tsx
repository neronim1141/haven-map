import React from "react";

import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { useUserQuery } from "graphql/client/graphql";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "flowbite-react";
import Link from "next/link";

const Page = () => {
  const session = useSession();
  const router = useRouter();
  const queryName = router.query.name as string;
  const user = useUserQuery({
    variables: {
      name: queryName,
    },
  });

  if (session.status === "loading" || user.loading || !user?.data?.user) {
    return <>loading</>;
  }

  if (
    !session.data ||
    (session.data.user.name !== queryName &&
      session.data.user.role !== Role.ADMIN)
  ) {
    router.push("/");
    return null;
  }
  return (
    <div className="p-2 flex flex-col gap-2">
      <div>Your token is: {user.data.user.token}</div>
      <div>
        Paste this into client: {window.location.origin}/api/client/
        {user.data?.user?.token}
      </div>
      <Button
        onClick={() => {
          if (user.data?.user?.role)
            router.push(`/profile/${user.data.user.name}/changePassword`);
        }}
      >
        Change Password
      </Button>
    </div>
  );
};

export default Page;
