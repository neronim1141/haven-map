import { Tile } from "graphql/client/graphql";
import L, { Util } from "leaflet";
import { createTileLayerComponent, LayerProps } from "@react-leaflet/core";
import { ReactNode } from "react";
import { HnHMaxZoom } from "features/map/config";
interface HavenProps extends LayerProps {
  url?: string;
  map: number;
  opacity?: number;
  tileData?: Omit<Tile, "mapId">[];

  children?: ReactNode; // PropsWithChildren is not exported by @react-leaflet/core
}

export class Haven extends L.TileLayer {
  cache: { [key: string]: string } = {};
  map = 2;
  constructor(url: string, map: number, options: L.TileLayerOptions) {
    super(url, options);
    this.map = map;
  }

  setMapId(map: number) {
    this.map = map;
    this.redraw();
  }
  setMapData(data: Tile[]) {
    for (let { x, y, z, lastUpdated, mapId } of data) {
      let cache = this.cache[`${mapId}:${x}:${y}:${z}`];

      if (cache && cache === lastUpdated) {
        continue;
      }

      this.cache[`${mapId}:${x}:${y}:${z}`] = lastUpdated;
      this.refresh(x, y, z);
    }
  }

  getTileUrl(coords: L.Coords) {
    return this.getTrueTileUrl(coords, this._getZoomForUrl());
  }
  getTrueTileUrl(coords: { x: number; y: number }, zoom: number) {
    var data: any = {
      x: coords.x,
      y: coords.y,
      map: this.map,
      z: zoom,
    };
    if (this._map && !this._map?.options?.crs?.infinite) {
      //@ts-ignore
      var invertedY = this._globalTileRange.max.y - coords.y;
      if (this.options.tms) {
        data["y"] = invertedY;
      }
      data["-y"] = invertedY;
    }

    const cache = this.cache[`${this.map}:${data.x}:${data.y}:${data.z}`];

    if (!cache || cache == "-1") {
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    }

    //@ts-ignore
    return Util.template(this._url, Util.extend(this.options, data));
  }

  refresh(x: number, y: number, z: number) {
    var zoom = z,
      maxZoom = this.options.maxZoom,
      zoomReverse = this.options.zoomReverse,
      zoomOffset = this.options.zoomOffset;

    if (zoomReverse) {
      zoom = (maxZoom ?? HnHMaxZoom) - zoom;
    }

    zoom = zoom + (zoomOffset ?? 0);

    var key = x + ":" + y + ":" + zoom;

    var tile = this._tiles[key];
    if (tile) {
      (tile.el as HTMLImageElement).src = this.getTrueTileUrl(
        { x: x, y: y },
        z
      );
    }
  }
}

const createHavenLayer = (props: HavenProps, context: any) => {
  const instance = new Haven(props.url ?? "", props.map, { ...props });
  return { instance, context };
};

const updateHavenLayer = (
  instance: any,
  props: HavenProps,
  prevProps: HavenProps
) => {
  if (prevProps.tileData !== props.tileData) {
    if (instance.setMapData) instance.setMapData(props.tileData);
  }
  if (prevProps.map !== props.map) {
    if (instance.setMapId) instance.setMapId(props.map);
  }
  if (prevProps.opacity !== props.opacity) {
    instance.setOpacity(props.opacity);
  }
};

export const HavenLayer = createTileLayerComponent(
  createHavenLayer,
  updateHavenLayer
);
