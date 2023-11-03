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
import { useAuth } from "~/contexts/auth";
const Page = () => {
  const auth = useAuth();
  const router = useRouter();
  const copyToClipboard = useClipboard();
  const queryid = Number(router.query.id);
  const user = trpc.useQuery(
    [
      "user.byId",
      {
        id: queryid,
      },
    ],
    { enabled: !!queryid && !isNaN(queryid) }
  );

  if (!user.data) {
    return <>loading</>;
  }

  if (!auth.user || (auth.user.id !== queryid && !auth.canAccess(Role.ADMIN))) {
    router.push("/");
    return null;
  }
  if (user.data === null) {
    router.push("/404");
    return null;
  }
  return (
    <div className="flex flex-col gap-2 p-2">
      <h1 className="text-2xl font-bold">User name: {user.data.name}</h1>
      {user.data.role === Role.NEED_CHECK && (
        <span className="font-bold text-amber-600">
          This User is awaiting veryfication
        </span>
      )}
      <span>
        Paste this into client{" "}
        <Link
          href="/instruction"
          className="font-bold underline hover:text-neutral-400"
        >
          (Instructions)
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
          router.push(`/profile/${user.data!.id}/changePassword`);
        }}
      >
        Change Password
      </Button>
    </div>
  );
};

export default Page;
