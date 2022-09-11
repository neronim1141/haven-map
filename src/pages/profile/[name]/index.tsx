import React from "react";

import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";
import { Button } from "~/components/controls/buttons";
import { HiClipboardCopy } from "react-icons/hi";
import { useClipboard } from "~/hooks/useClipboard";
import { toast } from "react-toastify";
import Link from "next/link";
const Page = () => {
  const session = useSession();
  const router = useRouter();
  const copyToClipboard = useClipboard();
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
    <div className="flex flex-col gap-2 p-2">
      <span>
        Paste this into client{" "}
        <Link href="/instruction">
          <a className="font-bold underline hover:text-neutral-400">
            (Instructions)
          </a>
        </Link>
        :
      </span>

      <div className="flex items-center gap-1">
        {process.env.NEXT_PUBLIC_PREFIX}/api/client/
        {user.data.token}
        <Button
          variant="outline"
          className="text-xs"
          onClick={() =>
            toast.promise(
              copyToClipboard(
                process.env.NEXT_PUBLIC_PREFIX +
                  "/api/client/" +
                  user.data!.token
              ),
              {
                pending: "Coping",
                success: "Url copied",
                error: "Something went wrong",
              }
            )
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
