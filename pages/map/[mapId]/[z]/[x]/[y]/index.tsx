import Map from "features/map/components/mapView";
import { HavenProvider } from "features/map/components/mapView/context/havenContext";
import { useMapsQuery } from "graphql/client/graphql";

const Page = () => {
  const { data, refetch } = useMapsQuery();
  if (!data) {
    <>loading</>;
  }
  if (data)
    return (
      <HavenProvider maps={data.maps} onMerge={refetch}>
        <Map />
      </HavenProvider>
    );
};

export default Page;
