import { useMap, Marker as LeafletMarker } from "react-leaflet";
import L from "leaflet";
import React, { useMemo } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { CharacterData } from "~/pages/api/client/[token]/positionUpdate";
import { HnHMaxZoom } from "~/server/routers/map/config";
import { useUsernameToggle } from "./context/mapSettingsContext";

interface CharacterMarkerProps {
  character: CharacterData;
  opacity?: number;
}

export const CharacterMarker = ({
  character,
  opacity = 1,
}: CharacterMarkerProps) => {
  const map = useMap();
  const [showUsernames] = useUsernameToggle();
  const zoom = map.getZoom();
  const Icon = useMemo(() => {
    return L.divIcon({
      iconSize: clampSize(zoom),
      iconAnchor: clampSize(zoom, 2),
      className: "transition-all duration-300 fill-blue-500",
      html: renderToStaticMarkup(
        <div className="relative z-50 flex">
          {showUsernames && (
            <div className="absolute -top-8 -left-20 mx-auto flex w-48 justify-center truncate text-base font-bold tracking-wider text-white">
              <span className="rounded-full  bg-black bg-opacity-75 p-1">
                {character.name}
              </span>
            </div>
          )}
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
  }, [zoom, character.name, showUsernames]);
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
