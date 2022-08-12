import React from "react";

import Map from "features/map/components/mapView";
import { HavenProvider } from "features/map/components/mapView/context/havenContext";
import { useMapsQuery } from "graphql/client/graphql";

const Page = () => {
  const { loading, data, refetch } = useMapsQuery();
  if (loading || !data) {
    return <>loading</>;
  }
  return (
    <HavenProvider maps={data.maps} onMerge={refetch}>
      <Map />
    </HavenProvider>
  );
};

export default Page;
