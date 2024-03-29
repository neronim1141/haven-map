import { useMap, Marker as LeafletMarker, Tooltip } from "react-leaflet";
import L from "leaflet";
import React, { useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ClientMarker } from "~/server/routers/marker";
import { HnHMaxZoom } from "~/server/routers/map/config";

interface MarkerProps {
  marker: ClientMarker;
  opacity?: number;
}

export const Marker = ({ marker, opacity = 1 }: MarkerProps) => {
  const map = useMap();
  const zoom = map.getZoom();
  const Icon = useMemo(() => {
    return marker.image
      ? L.icon({
          iconUrl: `/${marker.image}.png`,
          iconSize: clampSize(zoom, 1.2),
          iconAnchor: clampSize(zoom, 2.4),
          className: "transition-all duration-300",
        })
      : L.divIcon({
          iconSize: clampSize(zoom),
          iconAnchor: clampSize(zoom, 2),
          className: "transition-all duration-300 fill-gray-200 opacity-80",
          html: renderToStaticMarkup(
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="25"
                stroke="black"
                strokeWidth={5}
                fill="inherit"
              />
            </svg>
          ),
        });
  }, [marker, zoom]);
  return (
    <LeafletMarker
      icon={Icon}
      alt={marker.name}
      position={map.unproject([marker.x, marker.y], HnHMaxZoom)}
      opacity={opacity}
    >
      <Tooltip direction="top" offset={[0, -15]} opacity={0.7}>
        {marker.name}
      </Tooltip>
      {/* <Popup>
        <div>
          <input value={marker.name} />
          <button>save</button>
        </div>
      </Popup> */}
    </LeafletMarker>
  );
};

const clampSize = (zoom: number, divider: number = 1): [number, number] => {
  const size = Math.min(Math.max(zoom * 10, 16), 42);
  return [Math.floor(size / divider), Math.floor(size / divider)];
};
