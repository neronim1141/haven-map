import { HnHMaxZoom, HnHMinZoom } from "../../utils";
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
