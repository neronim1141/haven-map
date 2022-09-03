import React from "react";
import { useRouter } from "next/router";
import {
  Context,
  createContext,
  FunctionComponent,
  ReactNode,
  useContext,
  useState,
} from "react";
import { useSocketIO } from "~/hooks/useSocketIO";
import { Map } from "@prisma/client";

export type MapCoords = {
  x: number;
  y: number;
  z: number;
};
export type MainMap = {
  id: number;
};
export type OverlayMap = {
  id: number;
  setId: (id: number) => void;
  opacity: number;
  setOpacity: (id: number) => void;
};
export type Toggle = {
  show: boolean;
  setShow: (value: boolean) => void;
};
type HavenContextType = {
  coord: MapCoords;
  main: MainMap;
  overlay: OverlayMap;
  grid: Toggle;
  markers: Toggle;
  maps: Map[];
  map: { map?: L.Map; setMap: (map: L.Map) => void };
};

const HavenContext = createContext<HavenContextType | undefined>(undefined);

export const HavenProvider: FunctionComponent<{
  children?: ReactNode;
  maps: Map[];
  onMerge: () => void;
}> = ({ children, maps = [], onMerge }) => {
  const router = useRouter();

  const [overlay, setOverlay] = useState<number>(0);
  const [overlayOpacity, setOverlayOpacity] = useState(0.5);
  const [map, setMap] = useState<L.Map>();

  useSocketIO("merge", (merge) => {
    if (merge.from === overlay) setOverlay(merge.to);
    if (merge.from === Number(router.query.mapId)) {
      router.replace({
        pathname: "/map/[mapId]/[z]/[x]/[y]",
        query: {
          mapId: merge!.to,
          x: Number(router.query.x) + merge.shift.x,
          y: Number(router.query.y) + merge.shift.y,
          z: Number(router.query.z),
        },
      });
    }
    onMerge();
  });
  const [showGrid, setShowGrid] = useState(false);
  const [showMarkers, setShowMarkers] = useState(true);

  const value: HavenContextType = {
    main: {
      id: Number(router.query.mapId),
    },
    coord: {
      x: Number(router.query.x),
      y: Number(router.query.y),
      z: Number(router.query.z),
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
    markers: {
      show: showMarkers,
      setShow: setShowMarkers,
    },
    maps,
    map: { map, setMap },
  };

  return (
    <HavenContext.Provider value={value}>{children}</HavenContext.Provider>
  );
};

export const useCoords = () => useContextFallback(HavenContext).coord;
export const useMain = () => useContextFallback(HavenContext).main;
export const useOverlay = () => useContextFallback(HavenContext).overlay;
export const useGridToggle = () => useContextFallback(HavenContext).grid;
export const useMarkersToggle = () => useContextFallback(HavenContext).markers;
export const useMaps = () => useContextFallback(HavenContext).maps;
export const useMap = () => useContextFallback(HavenContext).map;

export const useContextFallback = <T,>(value: Context<T | undefined>): T => {
  const ctx = useContext<T | undefined>(value);
  if (!ctx) {
    throw new Error(`This Component require context: ${value.displayName}`);
  }
  return ctx;
};
