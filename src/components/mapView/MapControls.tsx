import React from "react";
import { useState } from "react";
import {
  MainMap,
  OverlayMap,
  useMaps,
  useMarkersToggle,
  useGridToggle,
} from "./context/havenContext";
import { useCharacters } from "./context/charactersContext";
import L from "leaflet";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";
import { canAccess } from "~/server/routers/user/utils";
import { HnHMaxZoom, TileSize } from "~/server/routers/map/config";
import { Select } from "../controls/select";
import { HiAdjustments, HiOutlineX } from "react-icons/hi";
import { Toggle } from "../controls/switch";
import { SearchSelect } from "../controls/searchSelect";
import { useMarkers } from "./context/markersContext";
type MarkerShortType = { x: number; y: number; map: number };

export function MapControls({
  main,
  overlay,
  map,
}: {
  main: MainMap;
  overlay: OverlayMap;
  map?: L.Map;
}) {
  const [showMarkers, setShowMarkers] = useMarkersToggle();
  const [showGrid, setShowGrid] = useGridToggle();

  const router = useRouter();
  const session = useSession();
  const [show, setShow] = useState(false);
  const maps = useMaps();
  const handleSelect = (marker: MarkerShortType) => {
    if (map) {
      map.setView(map.unproject([marker.x, marker.y], HnHMaxZoom), HnHMaxZoom);
      overlay.setId(0);
      const point = map.project(map.getCenter(), HnHMaxZoom);
      router.replace({
        pathname: "/map/[mapId]/[z]/[x]/[y]",
        query: {
          mapId: marker.map,
          x: ~~(point.x / TileSize),
          y: ~~(point.y / TileSize),
          z: HnHMaxZoom,
        },
      });
    }
  };

  return (
    <div className="leaflet-control shadow-none leaflet-bar p-2 flex flex-col gap-2">
      <button
        onClick={() => setShow((prev) => !prev)}
        className="text-white  bg-neutral-700 rounded-lg p-1 w-8 border border-neutral-600 flex items-center justify-center"
      >
        {show ? (
          <HiOutlineX className="w-5 h-5" />
        ) : (
          <HiAdjustments className="w-5 h-5" />
        )}
      </button>
      {show && (
        <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-neutral-700 dark:bg-neutral-800 flex-col">
          <div className="p-2 flex flex-col gap-2">
            <div className="flex gap-1">
              <Toggle
                label="show grid"
                value={showGrid}
                onToggle={() => setShowGrid((prev) => !prev)}
              />
            </div>
            <div className="flex gap-1">
              <Toggle
                label="show markers"
                value={showMarkers}
                onToggle={() => setShowMarkers((prev) => !prev)}
              />
            </div>
            <div className="w-48">
              <Select
                value={{
                  value: main.id,
                  label:
                    maps.find((map) => map.id === main.id)?.name ?? main.id,
                }}
                onChange={(value) => {
                  overlay.setId(0);
                  router.replace({
                    pathname: "/map/[mapId]/[z]/[x]/[y]",
                    query: {
                      mapId: value,
                      x: router.query.x,
                      y: router.query.y,
                      z: router.query.z,
                    },
                  });
                }}
                options={maps
                  .filter((map) => !map.hidden)
                  .sort((a, b) => {
                    if (a.name && isNaN(+a.name) && b.name && isNaN(+b.name))
                      return a.name.localeCompare(b.name);
                    if (!a.name) return 1;
                    if (!b.name) return -1;
                    return 0;
                  })
                  .map((map) => ({
                    value: map.id,
                    label: map.name ?? map.id + "",
                  }))}
              />
            </div>
            <div className="w-48">
              <Select
                value={{
                  value: overlay.id,
                  label:
                    maps.find((map) => map.id === overlay.id)?.name ??
                    (overlay.id === 0 ? "none" : overlay.id),
                }}
                onChange={(value) => {
                  overlay.setId(value);
                }}
                options={[
                  { value: 0, label: "none" },
                  ...maps
                    .filter((map) => !map.hidden && map.id !== main.id)
                    .sort((a, b) => {
                      if (a.name && isNaN(+a.name) && b.name && isNaN(+b.name))
                        return a.name.localeCompare(b.name);
                      if (!a.name) return 1;
                      if (!b.name) return -1;
                      return 0;
                    })
                    .map((map) => ({
                      value: map.id,
                      label: map.name ?? map.id + "",
                    })),
                ]}
              />
            </div>
            {overlay.id !== 0 && (
              <input
                type="range"
                className="w-48 slider-thumb"
                min={0.1}
                max={0.9}
                step={0.1}
                value={overlay.opacity}
                onChange={(e) => {
                  overlay.setOpacity(Number(e.target.value));
                }}
              />
            )}
            {canAccess(Role.VILLAGER, session.data?.user.role) && (
              <SelectCharacters onSelect={handleSelect} />
            )}
            <SelectMarkers onSelect={handleSelect} />
            <SelectQuestgivers onSelect={handleSelect} />
          </div>
        </div>
      )}
    </div>
  );
}

interface SelectProps {
  onSelect: (marker: MarkerShortType) => void;
}
const SelectCharacters = ({ onSelect }: SelectProps) => {
  const characters = useCharacters();
  const options = characters
    .filter((character) => character.name && character.name !== "???")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((character) => ({
      label: character.name,
      value: {
        x: character.x,
        y: character.y,
        map: character.inMap,
      },
    }));
  return (
    <SearchSelect
      value={null}
      options={options}
      placeholder={`${options.length} players visible`}
      onChange={(value) => value && onSelect(value)}
    />
  );
};

const SelectMarkers = ({ onSelect }: SelectProps) => {
  const markers = useMarkers();

  const options = markers
    .filter((marker) => marker.type === "player")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((marker) => ({
      label: marker.name,
      value: {
        x: marker.x,
        y: marker.y,
        map: marker.mapId,
      },
    }));

  return (
    <SearchSelect
      value={null}
      options={options}
      placeholder={options.length ? "Search  markers" : "No  markers"}
      onChange={(value) => value && onSelect(value)}
    />
  );
};
const SelectQuestgivers = ({ onSelect }: SelectProps) => {
  const markers = useMarkers();
  const options = markers
    .filter((marker) => marker.type === "quest")
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((marker) => ({
      label: marker.name,
      value: {
        x: marker.x,
        y: marker.y,
        map: marker.mapId,
      },
    }));
  return (
    <SearchSelect
      value={null}
      options={options}
      placeholder={options.length ? "Search  questgivers" : "No  questgivers"}
      onChange={(value) => value && onSelect(value)}
    />
  );
};
