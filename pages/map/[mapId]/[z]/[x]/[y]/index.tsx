import Map from "features/map/components/mapView";
import { HavenProvider } from "features/map/components/mapView/context/havenContext";
import { useMapsQuery } from "graphql/client/graphql";

const Page = () => {
  const { loading, data, refetch } = useMapsQuery();
  const maps = data?.maps || [];
  if (loading || !maps) {
    <>loading</>;
  }
  return (
    <HavenProvider maps={maps} onMerge={refetch}>
      <Map />
    </HavenProvider>
  );
};

export default Page;
