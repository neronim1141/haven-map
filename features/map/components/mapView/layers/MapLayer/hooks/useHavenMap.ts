import { useEffect } from "react";

import MAP_DATA_UPDATE from "graphql/client/subscriptions/getMapDataUpdate.graphql";

import {
  GetMapDataUpdatesSubscription,
  useGetMapDataQuery,
} from "graphql/client/graphql";
import { useDebounce } from "./useDebounce";

export const useHavenMap = (mapId: number) => {
  const { subscribeToMore, data } = useGetMapDataQuery({
    variables: { mapId },
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-and-network",
  });
  useEffect(() => {
    subscribeToMore<GetMapDataUpdatesSubscription>({
      document: MAP_DATA_UPDATE,
      variables: {
        mapId,
      },
      updateQuery: (prev, { subscriptionData }) => {
        const tileData = subscriptionData.data.getMapUpdates;
        if (!prev || !prev.getMapData) {
          return { getMapData: [] };
        }
        const filtered = prev.getMapData.filter((tile) => {
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
          getMapData: [...filtered, tileData],
        };
      },
    });
  }, [mapId, subscribeToMore]);
  return useDebounce(data, 1000);
};
