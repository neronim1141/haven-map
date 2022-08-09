import { MapLayer } from "./layers/MapLayer";
import { GridLayer } from "./layers/GridLayer";
import { useMapData } from "./hooks/useMapData";
import {
  useGetMarkersQuery,
  useSetCenterCoordMutation,
} from "graphql/client/graphql";
import _ from "lodash";
import { useOverlayData } from "./hooks/useOverlayData";
import { Marker } from "./marker";
import { MapContainer } from "./MapContainer";
import { MapControls } from "./MapControls";
import L, { LeafletMouseEvent } from "leaflet";

export default function MapView() {
  const main = useMapData();
  const overlay = useOverlayData();
  const markers = useGetMarkersQuery();
  // const [mutation] = useSetCenterCoordMutation();
  // const [contextMenu, setContextMenu] = useState<{ x: number; y: number }>();
  const onContextMenu = (e: LeafletMouseEvent) => {
    // setContextMenu({ x: e.containerPoint.x, y: e.containerPoint.y });
    console.log(e);
  };
  return (
    <div className="h-full relative">
      <MapContainer zoom={main.z} onContextMenu={onContextMenu}>
        <MapLayer mapId={main.mapId} />
        {overlay.id && (
          <MapLayer mapId={Number(overlay.id)} opacity={overlay.opacity} />
        )}
        <GridLayer />
        {markers.data?.getMarkers
          .filter(
            (marker) =>
              marker.mapId === main.mapId || marker.mapId === Number(overlay.id)
          )
          .map((marker) => (
            <Marker key={marker.id} marker={marker} />
          ))}
      </MapContainer>
      <div className="leaflet-top leaflet-left ">
        <div className="w-36 h-40 bg-white leaflet-control leaflet-bar p-1 flex flex-col gap-2">
          <MapControls
            main={main}
            overlay={overlay}
            markers={markers.data?.getMarkers}
          />
        </div>
      </div>
    </div>
  );
}
