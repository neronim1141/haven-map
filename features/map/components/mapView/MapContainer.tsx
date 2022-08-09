import { ReactNode, useCallback, useRef } from "react";
import { MapContainer as Map } from "react-leaflet";
import L, { LatLngTuple, LeafletMouseEvent } from "leaflet";
import { useRouter } from "next/router";
import { MapEvents } from "./mapEvents";
import { HnHCRS } from "./utils";
import { HnHMaxZoom, HnHMinZoom } from "features/map/config";

export const MapContainer = (props: {
  zoom: number;
  children: ReactNode;
  onContextMenu: (e: LeafletMouseEvent) => void;
}) => {
  const router = useRouter();
  const routerRef = useRef(router);

  const mapRef = useRef<L.Map | null>(null);
  const setupMapwithRef = useCallback((node: L.Map | null) => {
    if (node) {
      mapRef.current = node;
      const newCoords: LatLngTuple = [
        Number(routerRef.current.query.x) * 100,
        Number(routerRef.current.query.y) * 100,
      ];
      node.setView(node.unproject(newCoords), undefined, {
        animate: false,
      });
    }
  }, []);

  return (
    <Map
      center={[0, 0]}
      zoom={props.zoom}
      className="h-full"
      crs={HnHCRS}
      minZoom={HnHMinZoom}
      maxZoom={HnHMaxZoom}
      zoomControl={false}
      attributionControl={false}
      ref={setupMapwithRef}
    >
      <MapEvents onContextMenu={props.onContextMenu} />

      {props.children}
    </Map>
  );
};
