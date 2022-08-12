import _ from "lodash";
import { Switch } from "../controls/switch";
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
  const maps = useMaps();

  return (
    <>
      <Switch value={grid.show} onChange={grid.setShow} label="Show grid" />
      <select
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
      </select>
      <select
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
      </select>
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
    </>
  );
}
