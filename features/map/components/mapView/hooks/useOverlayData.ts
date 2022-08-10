import { useMapMergesSubscription } from "graphql/client/graphql";
import { useState } from "react";

export const useOverlayData = () => {
  const [overlayMapId, setOverlayMapId] = useState<string>("");
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);

  useMapMergesSubscription({
    variables: { mapId: Number(overlayMapId) },
    skip: overlayMapId === "",
    onSubscriptionData: ({ subscriptionData: merge }) => {
      const mapMergeData = merge.data?.mapMerges;
      if (mapMergeData) {
        setOverlayMapId(mapMergeData.to.toString());
      }
    },
  });

  return {
    id: Number(overlayMapId),
    opacity: overlayOpacity,
    setId: setOverlayMapId,
    setOpacity: setOverlayOpacity,
  };
};
