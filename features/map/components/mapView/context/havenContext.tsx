import React from "react";
import {
  Map,
  Marker,
  useMapMergesSubscription,
  useMarkersQuery,
} from "graphql/client/graphql";
import { useRouter } from "next/router";
import {
  Context,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
} from "react";
export type MapCoords = {
  x: number;
  y: number;
  z: number;
};
export type MainMap = {
  id: number;
  setId: (id: number) => void;
};
export type OverlayMap = {
  id: number;
  setId: (id: number) => void;
  opacity: number;
  setOpacity: (id: number) => void;
};
export type MapGrid = {
  show: boolean;
  setShow: (value: boolean) => void;
};
type HavenContextType = {
  coord: MapCoords;
  main: MainMap;
  overlay: OverlayMap;
  grid: MapGrid;
  maps: Map[];
  markers: Omit<Marker, "hidden">[];
  map: { map?: L.Map; setMap: (map: L.Map) => void };
};

const HavenContext = createContext<HavenContextType | undefined>(undefined);

export const HavenProvider: FunctionComponent<{
  children?: ReactNode;
  maps: Map[];
  onMerge: () => void;
}> = ({ children, maps = [], onMerge }) => {
  const router = useRouter();
  const routerId = Number(router.query.mapId ?? 1);
  const [coord, setCoord] = useState({
    x: Number(router.query.x ?? 0),
    y: Number(router.query.y ?? 0),
  });
  const zoom = Number(router.query.z ?? 1);
  if (maps.length && !maps.map((v) => v.id).includes(routerId)) {
    router.push(
      {
        pathname: "/map/[mapId]/[z]/[x]/[y]",
        query: {
          mapId: maps[0].id,
          x: coord.x,
          y: coord.y,
          z: zoom,
        },
      },
      undefined,
      { shallow: true }
    );
  }
  const [main, setMain] = useState(routerId ?? 1);
  const [overlay, setOverlay] = useState<number>(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [map, setMap] = useState<L.Map>();

  useMapMergesSubscription({
    onSubscriptionData: ({ subscriptionData: merge }) => {
      const mapMergeData = merge.data?.mapMerges;
      if (mapMergeData?.from === overlay) setOverlay(mapMergeData.to);
      if (mapMergeData?.from === main) {
        setMain(mapMergeData.to);
        setCoord({
          x: coord.x + mapMergeData.shift.x,
          y: coord.y + mapMergeData.shift.y,
        });
        router.push(
          {
            pathname: "/map/[mapId]/[z]/[x]/[y]",
            query: {
              mapId: mapMergeData.to,
              x: coord.x + mapMergeData.shift.x,
              y: coord.y + mapMergeData.shift.y,
              z: zoom,
            },
          },
          undefined,
          { shallow: true }
        );
      }
      onMerge();
    },
  });
  const markersQuery = useMarkersQuery();
  const [showGrid, setShowGrid] = useState(false);

  const value: HavenContextType = {
    coord: {
      x: coord.x,
      y: coord.y,
      z: zoom,
    },
    main: {
      id: main,
      setId: setMain,
    },
    overlay: {
      id: overlay,
      setId: setOverlay,
      opacity: overlayOpacity,
      setOpacity: setOverlayOpacity,
    },
    grid: {
      show: showGrid,
      setShow: setShowGrid,
    },
    maps,
    markers: markersQuery.data?.markers ?? [],
    map: { map, setMap },
  };

  return (
    <HavenContext.Provider value={value}>{children}</HavenContext.Provider>
  );
};

export const useCoords = () => useContextFallback(HavenContext).coord;
export const useMain = () => useContextFallback(HavenContext).main;
export const useOverlay = () => useContextFallback(HavenContext).overlay;
export const useGrid = () => useContextFallback(HavenContext).grid;
export const useMaps = () => useContextFallback(HavenContext).maps;
export const useMarkers = () => useContextFallback(HavenContext).markers;
export const useMap = () => useContextFallback(HavenContext).map;
export const useMarkersFor = (mapId: number) =>
  useContextFallback(HavenContext).markers.filter(
    (marker) => marker.mapId === mapId
  );
export const useContextFallback = <T,>(value: Context<T | undefined>): T => {
  const ctx = useContext<T | undefined>(value);
  if (!ctx) {
    throw new Error(`This Component require context: ${value.displayName}`);
  }
  return ctx;
};
