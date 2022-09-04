import React, { useState } from "react";
import { MapLayer } from "./layers/MapLayer";
import { GridLayer } from "./layers/GridLayer";
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
import { HnHMaxZoom, TileSize } from "~/server/routers/map/config";
import { EditGridModal } from "../modals/shiftMapModal";
import { canAccess } from "~/server/routers/user/utils";
import { useSession } from "next-auth/react";
import { Role } from "@prisma/client";

export default function MapView() {
  const session = useSession();
  const coords = useCoords();
  const main = useMain();
  const overlay = useOverlay();
  const [showGrid] = useGridToggle();
  const maps = useMaps();
  const { map } = useMap();
  const mainMap = maps.find((map) => map.id === main.id);
  const [shiftMapModalData, setShiftMapModalData] = useState<{
    mapId: number;
    name?: string;
    x: number;
    y: number;
  }>();
  const onContextMenu = (e: LeafletMouseEvent) => {
    if (map && canAccess(Role.ADMIN, session?.data?.user.role)) {
      let point = map.project(e.latlng, HnHMaxZoom);
      let coords = {
        x: Math.floor(point.x / TileSize),
        y: Math.floor(point.y / TileSize),
      };
      setShiftMapModalData({
        mapId: main.id,
        name: mainMap?.name ?? undefined,
        ...coords,
      });
    }
  };
  return (
    <CharactersProvider>
      <MarkersProvider>
        <Head>
          <title>{mainMap?.name ?? main.id} </title>
        </Head>
        <div className=" w-full text-black">
          <MapContainer zoom={coords.z} onContextMenu={onContextMenu}>
            <MapLayer mapId={main.id} />
            {overlay.id && (
              <MapLayer mapId={overlay.id} opacity={overlay.opacity} />
            )}

            {showGrid && <GridLayer />}
          </MapContainer>
          <div className="leaflet-top leaflet-left mt-10">
            <MapControls main={main} overlay={overlay} map={map} />
          </div>
        </div>
        {shiftMapModalData && (
          <EditGridModal
            data={shiftMapModalData}
            onClose={() => {
              setShiftMapModalData(undefined);
            }}
          />
        )}
      </MarkersProvider>
    </CharactersProvider>
  );
}
