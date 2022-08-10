import type { NextComponentType } from "next";

import Map from "features/map/components/mapView";
import { Role } from "@prisma/client";
import { AuthPageOptions } from "features/auth/types";

const Page: NextComponentType & { auth: AuthPageOptions } = () => {
  return <Map />;
};

export default Page;
Page.auth = {
  role: Role.VILLAGER,
};
