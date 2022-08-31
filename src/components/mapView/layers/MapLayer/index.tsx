import React from "react";
import { useHavenMap } from "./hooks/useHavenMap";
import { HavenLayer } from "./havenLayer";
import { Marker } from "../../marker";
import Characters from "./characters";
import { useMarkersFor } from "../../context/markersContext";
import { HnHMaxZoom, HnHMinZoom, TileSize } from "~/server/routers/map/config";

interface MapLayerProps {
  mapId: number;
  opacity?: number;
}

export const MapLayer = ({ mapId, opacity = 1 }: MapLayerProps) => {
  const mapData = useHavenMap(mapId);
  const markers = useMarkersFor(mapId);
  return (
    <>
      <HavenLayer
        url="/api/grids/{map}/{z}_{x}_{y}?{cache}"
        {...{
          minZoom: HnHMinZoom,
          maxZoom: HnHMaxZoom,
          zoomReverse: true,
          tileSize: TileSize,
        }}
        map={mapId}
        opacity={opacity}
        tileData={mapData}
      />
      {markers?.map((marker) => (
        <Marker key={marker.id} marker={marker} opacity={opacity} />
      ))}
      <Characters mapId={mapId} opacity={opacity} />
    </>
  );
};
MapLayer.displayName = "MapLayer";
