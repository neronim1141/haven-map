import React from "react";
import { MapLayer } from "./layers/MapLayer";
import { GridLayer } from "./layers/GridLayer";
import _ from "lodash";
import { MapContainer } from "./MapContainer";
import { MapControls } from "./MapControls";
import { LeafletMouseEvent } from "leaflet";
import {
  useCoords,
  useGridToggle,
  useMain,
  useMap,
  useMaps,
  useOverlay,
} from "./context/havenContext";
import { CharactersProvider } from "./context/charactersContext";
import Head from "next/head";
import { MarkersProvider } from "./context/markersContext";

export default function MapView() {
  const coords = useCoords();
  const main = useMain();
  const overlay = useOverlay();
  const [showGrid] = useGridToggle();
  const maps = useMaps();
  const { map } = useMap();
  const mainMap = maps.find((map) => map.id === main.id);
  // const [mutation] = useSetCenterCoordMutation();
  // const [contextMenu, setContextMenu] = useState<{ x: number; y: number }>();
  const onContextMenu = (e: LeafletMouseEvent) => {
    // setContextMenu({ x: e.containerPoint.x, y: e.containerPoint.y });
    console.log(e);
  };
  return (
    <CharactersProvider>
      <MarkersProvider>
        <Head>
          <title>{mainMap?.name ?? main.id} </title>
        </Head>
        <div className="h-full relative w-full text-black">
          <MapContainer zoom={coords.z} onContextMenu={onContextMenu}>
            <MapLayer mapId={main.id} />
            {overlay.id && (
              <MapLayer mapId={overlay.id} opacity={overlay.opacity} />
            )}

            {showGrid && <GridLayer />}
          </MapContainer>
          <div className="leaflet-top leaflet-left ">
            <MapControls main={main} overlay={overlay} map={map} />
          </div>
        </div>
      </MarkersProvider>
    </CharactersProvider>
  );
}
