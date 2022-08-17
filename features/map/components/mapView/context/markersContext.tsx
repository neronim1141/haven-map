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
const mapMarkerType = ({
  type: markerType,
  image,
  ...rest
}: Omit<Marker, "hidden">) => {
  let type = markerType;
  if (
    image === "gfx/invobjs/small/bush" ||
    image === "gfx/invobjs/small/bumling"
  ) {
    type = "quest";
  }
  return { ...rest, image, type };
};

export const MarkersProvider: FunctionComponent<{
  children?: ReactNode;
}> = ({ children }) => {
  const markersQuery = useMarkersQuery({ pollInterval: 60 * 1000 });

  return (
    <MarkersContext.Provider
      value={markersQuery.data?.markers.map(mapMarkerType) ?? []}
    >
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
