import React from "react";

import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button } from "flowbite-react";
import { trpc } from "utils/trpc";

const Page = () => {
  const session = useSession();
  const router = useRouter();
  const queryName = router.query.name as string;
  const user = trpc.useQuery([
    "user.byName",
    {
      name: queryName,
    },
  ]);

  if (session.status === "loading" || !user.data) {
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
      <div>Your token is: {user.data.token}</div>
      <div>
        Paste this into client: {process.env.NEXT_PUBLIC_PREFIX}/api/client/
        {user.data.token}
      </div>
      <Button
        onClick={() => {
          if (user?.data?.role)
            router.push(`/profile/${user.data.name}/changePassword`);
        }}
      >
        Change Password
      </Button>
    </div>
  );
};

export default Page;
