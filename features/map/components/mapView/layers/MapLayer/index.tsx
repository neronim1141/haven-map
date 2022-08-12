import { useHavenMap } from "./hooks/useHavenMap";
import { HavenLayer } from "./havenLayer";
import { HnHMaxZoom, HnHMinZoom, TileSize } from "features/map/config";
import { Marker as GraphqlMarker } from "graphql/client/graphql";
import { Marker } from "../../marker";
import Characters from "./characters";

interface MapLayerProps {
  mapId: number;
  opacity?: number;
  markers?: Omit<GraphqlMarker, "hidden">[];
}

export const MapLayer = ({ mapId, opacity = 1, markers }: MapLayerProps) => {
  const mapData = useHavenMap(mapId);
  return (
    <>
      <HavenLayer
        url="/api/map/grids/{map}/{z}_{x}_{y}"
        {...{
          minZoom: HnHMinZoom,
          maxZoom: HnHMaxZoom,
          zoomReverse: true,
          tileSize: TileSize,
        }}
        map={mapId}
        opacity={opacity}
        tileData={mapData?.map}
      />
      {markers?.map((marker) => (
        <Marker key={marker.id} marker={marker} opacity={opacity} />
      ))}
      <Characters mapId={mapId} opacity={opacity} />
    </>
  );
};
MapLayer.displayName = "MapLayer";
