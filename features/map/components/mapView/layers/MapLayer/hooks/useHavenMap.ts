import { useMapUpdatesSubscription } from "graphql/client/graphql";

export const useHavenMap = (mapId: number) => {
  const data = useMapUpdatesSubscription({ variables: { mapId } });

  return data.data?.mapUpdates;
};
