import { Marker, useMarkersQuery } from "graphql/client/graphql";
import React, {
  Context,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
} from "react";

const MarkersContext = createContext<Omit<Marker, "hidden">[] | undefined>(
  undefined
);

export const MarkersProvider: FunctionComponent<{
  children?: ReactNode;
}> = ({ children }) => {
  const markersQuery = useMarkersQuery({ pollInterval: 60 * 1000 });

  return (
    <MarkersContext.Provider value={markersQuery.data?.markers ?? []}>
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
