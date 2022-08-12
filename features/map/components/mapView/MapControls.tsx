import React from "react";
import { Checkbox, Label, Select, Tooltip } from "flowbite-react";
import _ from "lodash";
import { useState } from "react";
import {
  MainMap,
  MapGrid,
  OverlayMap,
  useMaps,
  useMarkers,
} from "./context/havenContext";
import SearchSelect from "react-select";
import { useCharacters } from "./context/charactersContext";
import L from "leaflet";
import { HnHMaxZoom, TileSize } from "features/map/config";
import { useRouter } from "next/router";
type MarkerShortType = { x: number; y: number; map: number };

export function MapControls({
  main,
  overlay,
  grid,
  zoom,
  map,
}: {
  main: MainMap;
  overlay: OverlayMap;
  grid: MapGrid;
  zoom: number;
  map?: L.Map;
}) {
  const router = useRouter();

  const [show, setShow] = useState(false);
  const maps = useMaps();
  const handleSelect = (marker: MarkerShortType) => {
    if (map) {
      map.setView(map.unproject([marker.x, marker.y], HnHMaxZoom), HnHMaxZoom);
      main.setId(marker.map);
      overlay.setId(0);
      const point = map.project(map.getCenter(), HnHMaxZoom);
      router.push(
        {
          pathname: "/map/[mapId]/[z]/[x]/[y]",
          query: {
            mapId: maps[0].id,
            x: ~~(point.x / TileSize),
            y: ~~(point.y / TileSize),
            z: HnHMaxZoom,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  };

  return (
    <div className="leaflet-control shadow-none leaflet-bar p-2 flex flex-col gap-2">
      <button
        onClick={() => setShow((prev) => !prev)}
        className="text-white  bg-gray-700 pb-1  rounded-lg w-7 border border-gray-600"
      >
        {show ? "▲" : "▼"}
      </button>
      {show && (
        <div className="flex rounded-lg border border-gray-200 bg-white shadow-md dark:border-gray-700 dark:bg-gray-800 flex-col">
          <div className="p-2 flex flex-col gap-2">
            <div className="flex gap-1 ">
              <Checkbox
                id="grids"
                checked={grid.show}
                onChange={() => {
                  grid.setShow(!grid.show);
                }}
              />
              <Label htmlFor="grids">Show grids</Label>
            </div>
            <Tooltip content="Main map">
              <div className="w-48">
                <Select
                  sizing="sm"
                  value={main.id}
                  onChange={(e) => {
                    main.setId(Number(e.target.value));
                    overlay.setId(0);
                  }}
                >
                  {maps.map((map) => (
                    <option value={map.id} key={map.id}>
                      {map.name ?? map.id}
                    </option>
                  ))}
                </Select>
              </div>
            </Tooltip>
            <Tooltip content="Overlay map">
              <div className="w-48">
                <Select
                  sizing="sm"
                  value={overlay.id}
                  onChange={(e) => {
                    overlay.setId(Number(e.target.value));
                  }}
                >
                  <option value={0}>None</option>
                  {maps
                    .filter((map) => map.id !== main.id)
                    .map((map) => (
                      <option value={map.id} key={map.id}>
                        {map.name ?? map.id}
                      </option>
                    ))}
                </Select>
              </div>
            </Tooltip>
            {overlay.id !== 0 && (
              <Tooltip content="Overlay opacity">
                <input
                  type="range"
                  className="w-48 slider-thumb "
                  min={0.2}
                  max={0.8}
                  step={0.1}
                  value={overlay.opacity}
                  onChange={(e) => {
                    overlay.setOpacity(Number(e.target.value));
                  }}
                />
              </Tooltip>
            )}
            <SelectCharacters onSelect={handleSelect} />
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
    .filter((character) => character.name !== "???")
    .map((character) => ({
      label: character.name,
      value: {
        x: character.x,
        y: character.y,
        map: character.inMap,
      },
    }));
  return (
    <Tooltip content="Select characters">
      <SearchSelect
        value={null}
        options={options}
        placeholder={options.length ? "Search character" : "No characters"}
        isDisabled={!options.length}
        className="text-black w-48"
        onChange={(entry) => entry && onSelect(entry.value)}
      />
    </Tooltip>
  );
};

const SelectMarkers = ({ onSelect }: SelectProps) => {
  const markers = useMarkers();

  const options = markers
    .filter((marker) => marker.type !== "quest")
    .map((marker) => ({
      label: marker.name,
      value: {
        x: marker.x,
        y: marker.y,
        map: marker.mapId,
      },
    }));

  return (
    <Tooltip content="Select Custom Markers">
      <SearchSelect
        value={null}
        options={options}
        placeholder={options.length ? "Search  markers" : "No  markers"}
        isDisabled={!options.length}
        className="text-black w-48"
        onChange={(entry) => entry && onSelect(entry.value)}
      />
    </Tooltip>
  );
};
const SelectQuestgivers = ({ onSelect }: SelectProps) => {
  const markers = useMarkers();
  const options = markers
    .filter((marker) => marker.type === "quest")
    .map((marker) => ({
      label: marker.name,
      value: {
        x: marker.x,
        y: marker.y,
        map: marker.mapId,
      },
    }));
  return (
    <Tooltip content="Overlay Questgivers">
      <SearchSelect
        value={null}
        options={options}
        placeholder={options.length ? "Search  questgivers" : "No  questgivers"}
        isDisabled={!options.length}
        className="text-black w-48"
        onChange={(entry) => entry && onSelect(entry.value)}
      />
    </Tooltip>
  );
};
