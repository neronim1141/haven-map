import React, {
  Context,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
} from "react";
import { trpc } from "utils/trpc";
import { ClientMarker } from "~/server/routers/marker";

const MarkersContext = createContext<ClientMarker[] | undefined>(undefined);

export const MarkersProvider: FunctionComponent<{
  children?: ReactNode;
}> = ({ children }) => {
  const markers = trpc.useQuery(["marker.all", { hidden: false }], {
    refetchInterval: 60 * 1000,
  });

  return (
    <MarkersContext.Provider value={markers.data ?? []}>
      {children}
    </MarkersContext.Provider>
  );
};

export const useMarkersFor = (mapId: number) =>
  useContextFallback(MarkersContext).filter((marker) => marker.mapId === mapId);
export const useMarkers = () => useContextFallback(MarkersContext);
export const useContextFallback = <T,>(value: Context<T | undefined>): T => {
  const ctx = useContext<T | undefined>(value);
  if (!ctx) {
    throw new Error(`This Component require context: ${value.displayName}`);
  }
  return ctx;
};
