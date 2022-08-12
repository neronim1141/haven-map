import { MapLayer } from "./layers/MapLayer";
import { GridLayer } from "./layers/GridLayer";
import _ from "lodash";
import { Marker } from "./marker";
import { MapContainer } from "./MapContainer";
import { MapControls } from "./MapControls";
import L, { LeafletMouseEvent } from "leaflet";
import { CharacterMarker } from "./characterMarker";
import {
  useCoords,
  useGrid,
  useMain,
  useOverlay,
} from "./context/havenContext";
import { useCharacters } from "./hooks/useCharacters";
import { CharactersProvider } from "./context/charactersContext";

export default function MapView() {
  const coords = useCoords();
  const main = useMain();
  const overlay = useOverlay();
  const grid = useGrid();

  // const [mutation] = useSetCenterCoordMutation();
  // const [contextMenu, setContextMenu] = useState<{ x: number; y: number }>();
  const onContextMenu = (e: LeafletMouseEvent) => {
    // setContextMenu({ x: e.containerPoint.x, y: e.containerPoint.y });
    console.log(e);
  };
  return (
    <div className="h-full relative w-full text-black">
      <MapContainer zoom={coords.z} onContextMenu={onContextMenu}>
        <CharactersProvider ids={[main.id, overlay.id]}>
          <MapLayer mapId={main.id} markers={main.markers} />
          {overlay.id && (
            <MapLayer
              mapId={overlay.id}
              opacity={overlay.opacity}
              markers={overlay.markers}
            />
          )}
        </CharactersProvider>
        {grid.show && <GridLayer />}
      </MapContainer>
      <div className="leaflet-top leaflet-left ">
        <div className="w-36 h-40 bg-white leaflet-control leaflet-bar p-1 flex flex-col gap-2">
          <MapControls main={main} overlay={overlay} grid={grid} />
        </div>
      </div>
    </div>
  );
}
