import L, { Util } from "leaflet";
import { createTileLayerComponent, LayerProps } from "@react-leaflet/core";
import { ReactNode } from "react";
import { Tile } from "@prisma/client";
import { HnHMaxZoom } from "~/server/routers/map/config";
import { ClientTile } from "~/pages/api/socketio";
interface HavenProps extends LayerProps {
  url?: string;
  map: number;
  opacity?: number;
  tileData?: Omit<ClientTile, "mapId">[];

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
  updateTiles(data: ClientTile[]) {
    for (let { x, y, z, updatedAt } of data) this.refresh(x, y, z, updatedAt);
  }

  getTileUrl(coords: L.Coords) {
    return this.getTrueTileUrl(coords, this._getZoomForUrl());
  }
  getTrueTileUrl(
    coords: { x: number; y: number },
    zoom: number,
    cache = Date.now().toString()
  ) {
    var data: any = {
      x: coords.x,
      y: coords.y,
      map: this.map,
      z: zoom,
      cache,
    };

    //@ts-ignore
    return Util.template(this._url, Util.extend(this.options, data));
  }

  refresh(x: number, y: number, z: number, updatedAt: Date) {
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
        z,
        updatedAt.toString()
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
    if (instance.updateTiles) {
      instance.updateTiles(props.tileData);
    }
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
