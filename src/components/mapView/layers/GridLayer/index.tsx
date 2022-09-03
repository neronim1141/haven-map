import React from "react";
import { HnHMaxZoom, HnHMinZoom } from "~/server/routers/map/config";
import { GridLayer as Layer } from "./gridLayer";

export const GridLayer = () => {
  return (
    <Layer
      url="/api/map/grids/{map}/{z}/{x}/{y}"
      {...{
        minZoom: HnHMinZoom,
        maxZoom: HnHMaxZoom,
        zoomOffset: 0,
        zoomReverse: true,
      }}
    />
  );
};
