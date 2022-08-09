import { TileSize } from "features/map/config";
import L, { Bounds, LatLng, Point } from "leaflet";

const latNormalization = (90.0 * TileSize) / 2500000.0;
const lngNormalization = (180.0 * TileSize) / 2500000.0;

export const HnHProjection = {
  project: function (latlng: LatLng) {
    return new Point(
      latlng.lat / latNormalization,
      latlng.lng / lngNormalization
    );
  },

  unproject: function (point: Point) {
    return new LatLng(point.x * latNormalization, point.y * lngNormalization);
  },

  bounds: (function () {
    return new Bounds(
      [-latNormalization, -lngNormalization],
      [latNormalization, lngNormalization]
    );
  })(),
};

export const HnHCRS = L.extend({}, L.CRS.Simple, {
  projection: HnHProjection,
});
