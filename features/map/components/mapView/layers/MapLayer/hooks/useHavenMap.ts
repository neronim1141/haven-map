import { Tile, useMapUpdatesSubscription } from "graphql/client/graphql";
import { useEffect, useState } from "react";

export const useHavenMap = (mapId: number) => {
  const [data, setData] = useState<Tile[]>([]);
  const [incomingData, setIncomingData] = useState<Tile[]>([]);
  useMapUpdatesSubscription({
    variables: { mapId },
    onSubscriptionData: ({ subscriptionData: sub }) => {
      const subData = sub.data?.mapUpdates;
      if (subData) {
        setIncomingData((prev) => [...prev, subData]);
      }
    },
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (incomingData.length) {
        setData(incomingData);
        setIncomingData([]);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [incomingData]);
  return data;
};
