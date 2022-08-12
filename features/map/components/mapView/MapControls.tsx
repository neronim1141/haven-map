import { useMapData } from "./hooks/useMapData";
import { Marker, useMapsQuery } from "graphql/client/graphql";
import _ from "lodash";
import { useOverlayData } from "./hooks/useOverlayData";
import { Switch } from "../controls/switch";
export function MapControls({
  main,
  overlay,
  markers,
  grid,
}: {
  main: ReturnType<typeof useMapData>;
  overlay: ReturnType<typeof useOverlayData>;
  markers?: Omit<Marker, "hidden">[];
  grid: {
    show: boolean;
    setShow: (value: boolean) => void;
  };
}) {
  const { data: maps } = useMapsQuery();
  if (!maps?.maps) {
    return <>Loading</>;
  }

  return (
    <>
      <Switch value={grid.show} onChange={grid.setShow} label="Show grid" />
      <select
        value={main.mapId}
        onChange={(e) => {
          main.setId(Number(e.target.value));
          overlay.setId("");
        }}
      >
        {maps.maps.map((map) => (
          <option value={map.id} key={map.id}>
            {map.name ?? map.id}
          </option>
        ))}
      </select>
      <select
        value={overlay.id}
        onChange={(e) => {
          overlay.setId(e.target.value);
        }}
      >
        <option value="">None</option>
        {maps.maps
          .filter((map) => map.id !== main.mapId)
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
