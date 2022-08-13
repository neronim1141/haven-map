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

  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        if (incomingData.length) {
          setData(incomingData);
          setIncomingData([]);
        }
      }, 2000);
      // Cancel the timeout if value changes (also on delay change or unmount)
      // This is how we prevent debounced value from updating if value is changed ...
      // .. within the delay period. Timeout gets cleared and restarted.
      return () => {
        clearTimeout(handler);
      };
    },
    [incomingData] // Only re-call effect if value or delay changes
  );
  return data;
};
