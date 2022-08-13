import React from "react";
import { useHavenMap } from "./hooks/useHavenMap";
import { HavenLayer } from "./havenLayer";
import { HnHMaxZoom, HnHMinZoom, TileSize } from "features/map/config";
import { Marker as GraphqlMarker } from "graphql/client/graphql";
import { Marker } from "../../marker";
import Characters from "./characters";
import { useMarkersFor } from "../../context/havenContext";

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
        url="/grids/{map}/{z}/{x}_{y}.webp"
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
