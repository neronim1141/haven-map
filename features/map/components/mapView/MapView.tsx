import React from "react";
import { MapLayer } from "./layers/MapLayer";
import { GridLayer } from "./layers/GridLayer";
import _ from "lodash";
import { MapContainer } from "./MapContainer";
import { MapControls } from "./MapControls";
import { LeafletMouseEvent } from "leaflet";
import {
  useCoords,
  useGrid,
  useMain,
  useMaps,
  useOverlay,
} from "./context/havenContext";
import { CharactersProvider } from "./context/charactersContext";
import Head from "next/head";

export default function MapView() {
  const coords = useCoords();
  const main = useMain();
  const overlay = useOverlay();
  const grid = useGrid();
  const maps = useMaps();
  const mainMap = maps.find((map) => map.id === main.id);
  // const [mutation] = useSetCenterCoordMutation();
  // const [contextMenu, setContextMenu] = useState<{ x: number; y: number }>();
  const onContextMenu = (e: LeafletMouseEvent) => {
    // setContextMenu({ x: e.containerPoint.x, y: e.containerPoint.y });
    console.log(e);
  };
  return (
    <>
      <Head>
        <title>Map {mainMap?.name ?? main.id} </title>
      </Head>
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
          <MapControls main={main} overlay={overlay} grid={grid} />
        </div>
      </div>
    </>
  );
}
