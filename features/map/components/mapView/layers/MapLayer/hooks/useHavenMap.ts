import { useEffect } from "react";

import MAP_DATA_UPDATE from "graphql/client/subscriptions/getMapDataUpdate.graphql";

import {
  GetMapDataUpdatesSubscription,
  useGetMapDataQuery,
} from "graphql/client/graphql";
import { useDebounce } from "./useDebounce";

export const useHavenMap = (mapId: number) => {
  const { subscribeToMore, data, refetch } = useGetMapDataQuery({
    variables: { mapId },
    fetchPolicy: "network-only", // Used for first execution
    nextFetchPolicy: "cache-first",
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
        if (!tileData) {
          return prev;
        }
        const mapDataWithoutIncomingTile = prev.getMapData.filter((tile) => {
          // for (let newTile of tileData) {
          //   if (tile.lastUpdated === newTile.lastUpdated) return false;
          if (tile.lastUpdated === tileData.lastUpdated) return false;
          // }
          return true;
        });
        return {
          getMapData: [...mapDataWithoutIncomingTile, tileData],
        };
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapId]);
  return { data: useDebounce(data, 100), refetch };
};
