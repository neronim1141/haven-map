import L from "leaflet";
import { createTileLayerComponent, LayerProps } from "@react-leaflet/core";
import { ReactNode } from "react";
import { HnHMaxZoom, TileSize } from "features/map/config";

interface GridProps extends LayerProps {
  url?: string;
  children?: ReactNode; // PropsWithChildren is not exported by @react-leaflet/core
}

class Grid extends L.TileLayer {
  createTile(coords: L.Coords) {
    let element = document.createElement("div");
    element.style.width = `${TileSize}px`;
    element.style.height = `${TileSize}px`;
    element.classList.add("map-tile");

    let scaleFactor = Math.pow(2, HnHMaxZoom - coords.z);
    let topLeft = { x: coords.x * scaleFactor, y: coords.y * scaleFactor };
    let bottomRight = {
      x: topLeft.x + scaleFactor - 1,
      y: topLeft.y + scaleFactor - 1,
    };

    let text = `<div>${topLeft.x},${topLeft.y}</div>`;
    if (scaleFactor !== 1) {
      text += `<div class="absolute bottom-1 right-1">${bottomRight.x},${bottomRight.y}</div>`;
    }

    let textElement = document.createElement("div");
    textElement.classList.add("map-tile-text");
    textElement.classList.add("w-full");
    textElement.classList.add("h-full");
    textElement.classList.add("relative");
    textElement.classList.add("p-1");
    textElement.innerHTML = text;
    element.appendChild(textElement);
    return element;
  }
}

const createGridLayer = (props: GridProps, context: any) => {
  const instance = new Grid("", { ...props, tileSize: TileSize });
  return { instance, context };
};

const updateGridLayer = (
  instance: any,
  props: GridProps,
  prevProps: GridProps
) => {
  if (prevProps.url !== props.url) {
    if (instance.setUserId) instance.setUserId(props.url);
  }
};

export const GridLayer = createTileLayerComponent(
  createGridLayer,
  updateGridLayer
);
