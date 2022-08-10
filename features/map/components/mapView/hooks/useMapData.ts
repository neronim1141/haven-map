import { useMapMergesSubscription } from "graphql/client/graphql";
import { useRouter } from "next/router";
import { useState } from "react";

export type MapData = {
  mapId: number;
  x: number;
  y: number;
  z: number;
};
export const useMapData = () => {
  const router = useRouter();

  const [mapId, setId] = useState(Number(router.query.mapId ?? 1));
  const [coord, setCoord] = useState({
    x: Number(router.query.x ?? 0),
    y: Number(router.query.y ?? 0),
  });
  const zoom = Number(router.query.z ?? 1);

  useMapMergesSubscription({
    variables: { mapId: mapId },
    onSubscriptionData: ({ subscriptionData: merge }) => {
      const mapMergeData = merge.data?.mapMerges;
      if (mapMergeData) {
        setId(mapMergeData.to);
        setCoord({
          x: coord.x + mapMergeData.shift.x,
          y: coord.y + mapMergeData.shift.y,
        });
        router.push(
          {
            pathname: "/map/[mapId]/[z]/[x]/[y]",
            query: {
              mapId: mapMergeData.to,
              x: coord.x + mapMergeData.shift.x,
              y: coord.y + mapMergeData.shift.y,
              z: zoom,
            },
          },
          undefined,
          { shallow: true }
        );
      }
    },
  });

  return {
    mapId,
    x: coord.x,
    y: coord.y,
    z: zoom,
    setId,
  };
};
