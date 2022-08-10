import { useHavenMap } from "./hooks/useHavenMap";
import { HavenLayer } from "./havenLayer";
import { HnHMaxZoom, HnHMinZoom, TileSize } from "features/map/config";

interface MapLayerProps {
  mapId: number;
  opacity?: number;
}

export const MapLayer = ({ mapId, opacity }: MapLayerProps) => {
  const mapData = useHavenMap(mapId);

  return (
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
  );
};
MapLayer.displayName = "MapLayer";
