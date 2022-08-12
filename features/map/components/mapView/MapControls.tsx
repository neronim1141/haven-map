import React from "react";

import { Card, Checkbox, Label, Select } from "flowbite-react";
import _ from "lodash";
import { useState } from "react";
import { MainMap, MapGrid, OverlayMap, useMaps } from "./context/havenContext";
export function MapControls({
  main,
  overlay,
  grid,
}: {
  main: MainMap;
  overlay: OverlayMap;
  grid: MapGrid;
}) {
  const [show, setShow] = useState(false);
  const maps = useMaps();

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
            {overlay.id !== 0 && (
              <input
                type="range"
                min={0.2}
                max={0.8}
                step={0.1}
                value={overlay.opacity}
                onChange={(e) => {
                  overlay.setOpacity(Number(e.target.value));
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
