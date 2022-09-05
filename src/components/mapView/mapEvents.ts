import { LeafletMouseEvent } from "leaflet";
import { useRouter } from "next/router";
import { debounce } from "radash";
import { useCallback } from "react";
import { useMapEvents } from "react-leaflet";
import { TileSize } from "~/server/routers/map/config";

interface MapEvents {
  onContextMenu: (e: LeafletMouseEvent) => void;
}
export const MapEvents = ({ onContextMenu }: MapEvents) => {
  const router = useRouter();

  const updateRouter = useCallback(
    (map: L.Map) => {
      if (!map) return;
      let point = map.project(map.getCenter());
      let coordinate = {
        x: ~~(point.x / TileSize),
        y: ~~(point.y / TileSize),
        z: map.getZoom(),
      };

      router.replace(
        {
          pathname: "/map/[mapId]/[z]/[x]/[y]",
          query: {
            ...coordinate,
            mapId: router.query.mapId,
          },
        },
        undefined,
        { shallow: true }
      );
    },
    [router]
  );

  const map = useMapEvents({
    contextmenu(e) {
      onContextMenu(e);
    },
    zoom: debounce({ delay: 200 }, () => updateRouter(map)),
    drag: debounce({ delay: 200 }, () => updateRouter(map)),
  });

  return null;
};
