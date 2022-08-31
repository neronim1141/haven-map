import React, { useState } from "react";

import Map from "~/components/mapView";
import { HavenProvider } from "~/components/mapView/context/havenContext";
import { useRouter } from "next/router";
import { SocketProvider } from "~/hooks/useSocketIO";
import { trpc } from "utils/trpc";

function isNumeric(str: any) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str as any) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}
const Page = () => {
  const router = useRouter();
  const maps = trpc.useQuery(["map.all"], { refetchInterval: 60 * 1000 });
  if (
    !maps.data ||
    router.query.mapId === undefined ||
    router.query.z === undefined ||
    router.query.x === undefined ||
    router.query.y === undefined
  ) {
    return <>loading</>;
  }
  if (
    !isNumeric(router.query.x) ||
    !isNumeric(router.query.y) ||
    !isNumeric(router.query.mapId) ||
    !isNumeric(router.query.z)
  ) {
    const mapId = maps.data ? maps.data[0].id : 1;
    console.log(mapId);

    router.replace({
      pathname: "/map/[mapId]/[z]/[x]/[y]",
      query: {
        mapId: isNumeric(router.query.mapId)
          ? Number(router.query.mapId)
          : mapId,
        x: isNumeric(router.query.x) ? Number(router.query.x) : 0,
        y: isNumeric(router.query.y) ? Number(router.query.y) : 0,
        z: isNumeric(router.query.z) ? Number(router.query.z) : 6,
      },
    });
    return <>something went wrong</>;
  }

  return (
    <SocketProvider>
      <HavenProvider maps={maps.data} onMerge={maps.refetch}>
        <Map />
      </HavenProvider>
    </SocketProvider>
  );
};

export default Page;
