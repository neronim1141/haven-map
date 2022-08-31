import { useMap, Marker as LeafletMarker } from "react-leaflet";
import L from "leaflet";
import React, { useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterData } from "~/pages/api/client/[token]/positionUpdate";
import { HnHMaxZoom } from "~/server/routers/map/config";

interface CharacterMarkerProps {
  character: CharacterData;
  opacity?: number;
}

export const CharacterMarker = ({
  character,
  opacity = 1,
}: CharacterMarkerProps) => {
  const map = useMap();
  const zoom = map.getZoom();
  const Icon = useMemo(() => {
    return L.divIcon({
      iconSize: clampSize(zoom),
      iconAnchor: clampSize(zoom, 2),
      className: "transition-all duration-300 fill-blue-500",
      html: renderToStaticMarkup(
        <div className="flex relative z-50">
          <div className="-top-8 -left-20 w-48 mx-auto absolute text-base font-bold text-outline flex justify-center truncate">
            <span className="bg-black bg-opacity-50 rounded-full border border-blue-400 p-1">
              {character.name}
            </span>
          </div>
          <svg viewBox="0 0 100 100" className="absolute ">
            <circle
              cx="50"
              cy="50"
              r="25"
              stroke="black"
              strokeWidth={5}
              fill="inherit"
            />
          </svg>
        </div>
      ),
    });
  }, [zoom, character.name]);
  return (
    <LeafletMarker
      icon={Icon}
      alt={character.name}
      position={map.unproject([character.x, character.y], HnHMaxZoom)}
      zIndexOffset={10}
      opacity={opacity}
    />
  );
};

const clampSize = (zoom: number, divider: number = 1): [number, number] => {
  const size = Math.min(Math.max(zoom * 10, 32), 32);
  return [Math.floor(size / divider), Math.floor(size / divider)];
};
