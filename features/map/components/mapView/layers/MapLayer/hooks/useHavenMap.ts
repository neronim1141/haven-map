import { useEffect } from "react";

import MAP_DATA_UPDATE from "graphql/client/subscriptions/mapUpdate.graphql";

import { useDebounce } from "./useDebounce";
import { MapUpdatesSubscription, useMapQuery } from "graphql/client/graphql";

export const useHavenMap = (mapId: number) => {
  const { subscribeToMore, data } = useMapQuery({
    variables: { mapId },
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    subscribeToMore<MapUpdatesSubscription>({
      document: MAP_DATA_UPDATE,
      variables: {
        mapId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        const tileData = subscriptionData.data.mapUpdates;
        if (!prev || !prev.map) {
          return { map: [] };
        }
        const filtered = prev.map.filter((tile) => {
          if (
            tile.x === tileData.x &&
            tile.y === tileData.y &&
            tile.z === tileData.z
          ) {
            return false;
          }
          return true;
        });
        return {
          map: [...filtered, tileData],
        };
      },
    });
  }, [mapId, subscribeToMore]);
  return useDebounce(data, 1000);
};
