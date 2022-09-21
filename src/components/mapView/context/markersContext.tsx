import React, {
  Context,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
} from "react";
import { UseQueryResult } from "react-query";
import { trpc } from "utils/trpc";
import { ClientMarker } from "~/server/routers/marker";
import { useContextFallback } from "./charactersContext";
import { useMarkersToggle } from "./havenContext";

const MarkersContext = createContext<
  { markers: ClientMarker[]; query: UseQueryResult<ClientMarker[]> } | undefined
>(undefined);

export const MarkersProvider: FunctionComponent<{
  children?: ReactNode;
}> = ({ children }) => {
  const [show] = useMarkersToggle();
  const markers = trpc.useQuery(["marker.all"], {
    refetchInterval: 60 * 1000,
  });
  const markersData = markers.data ?? [];
  return (
    <MarkersContext.Provider
      value={{
        markers: markersData.filter(
          (marker) => show || marker.type === "thingwall"
        ),
        query: markers,
      }}
    >
      {children}
    </MarkersContext.Provider>
  );
};

export const useMarkersFor = (mapId: number) =>
  useContextFallback(MarkersContext).markers.filter(
    (marker) => marker.mapId === mapId
  );
export const useMarkers = () => useContextFallback(MarkersContext).markers;
export const useMarkersQuery = () => useContextFallback(MarkersContext).query;
