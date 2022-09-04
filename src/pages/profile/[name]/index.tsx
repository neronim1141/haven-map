import React from "react";

import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { Button } from "~/components/controls/buttons";
import { HiClipboardCopy } from "react-icons/hi";
const Page = () => {
  const session = useSession();
  const router = useRouter();
  const queryName = router.query.name as string;
  const user = trpc.useQuery(
    [
      "user.byName",
      {
        name: queryName,
      },
    ],
    { enabled: !!queryName }
  );

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
  if (user.data === null) {
    router.push("/404");
    return null;
  }
  return (
    <div className="p-2 flex flex-col gap-2">
      Paste this into client:
      <div className="flex items-center gap-1">
        {process.env.NEXT_PUBLIC_PREFIX}/api/client/
        {user.data.token}
        <Button
          variant="outline"
          className="text-xs"
          onClick={() =>
            navigator.clipboard
              .writeText(
                process.env.NEXT_PUBLIC_PREFIX +
                  "/api/client/" +
                  user.data!.token
              )
              .then(function () {
                alert("copied!");
              })
          }
        >
          Copy <HiClipboardCopy />
        </Button>
      </div>
      <Button
        onClick={() => {
          router.push(`/profile/${user.data!.name}/changePassword`);
        }}
      >
        Change Password
      </Button>
    </div>
  );
};

export default Page;
