import { Role } from "@prisma/client";
import { useSession } from "next-auth/react";

const Page = () => {
  const session = useSession();
  return <>{session.data?.user?.name}</>;
};

export default Page;
