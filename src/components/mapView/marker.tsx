import { useMap, Marker as LeafletMarker, Tooltip, Popup } from "react-leaflet";
import L from "leaflet";
import React, { useMemo, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ClientMarker } from "~/server/routers/marker";
import { HnHMaxZoom } from "~/server/routers/map/config";
import { Button } from "../controls/buttons";
import { trpc } from "utils/trpc";
import { useAuth } from "~/contexts/auth";
import { Role } from "@prisma/client";
import { toast } from "react-toastify";
import { useMarkersQuery } from "./context/markersContext";

interface MarkerProps {
  marker: ClientMarker;
  opacity?: number;
}

export const Marker = ({ marker, opacity = 1 }: MarkerProps) => {
  const map = useMap();
  const auth = useAuth();
  const zoom = map.getZoom();
  const Icon = useMemo(() => {
    return marker.image
      ? L.icon({
          iconUrl: `/${marker.image}.png`,
          iconSize: clampSize(zoom, 1.2),
          iconAnchor: clampSize(zoom, 2.4),
          className: "transition-all duration-300",
        })
      : L.divIcon({
          iconSize: clampSize(zoom),
          iconAnchor: clampSize(zoom, 2),
          className: "transition-all duration-300 fill-gray-200 opacity-80",
          html: renderToStaticMarkup(
            <svg viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="25"
                stroke="black"
                strokeWidth={5}
                fill="inherit"
              />
            </svg>
          ),
        });
  }, [marker, zoom]);
  return (
    <LeafletMarker
      icon={Icon}
      alt={marker.name}
      position={map.unproject([marker.x, marker.y], HnHMaxZoom)}
      opacity={opacity}
    >
      <Tooltip direction="top" offset={[0, -15]} opacity={0.7}>
        {marker.name}
      </Tooltip>
      {auth.canAccess(Role.VILLAGER) && <MarkerPopup marker={marker} />}
    </LeafletMarker>
  );
};
const MarkerPopup = ({ marker }: { marker: ClientMarker }) => {
  const update = trpc.useMutation("marker.update");
  const markersQuery = useMarkersQuery();
  const [name, setName] = useState(marker.name);
  const ref = useRef<L.Popup>(null);
  return (
    <Popup ref={ref}>
      <div className="flex flex-col gap-1">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="relative w-full min-w-[14rem] truncate rounded bg-neutral-600 p-2 pr-7 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm "
        />
        <div className="flex justify-evenly">
          <Button
            variant="danger"
            onClick={async () => {
              await toast.promise(
                update.mutateAsync({
                  id: marker.id,
                  data: { hidden: true },
                }),
                {
                  pending: "Please wait...",
                  success: "Marker visibility updated",
                  error: {
                    render({ data }) {
                      return data.message;
                    },
                  },
                }
              );
              ref.current?.closePopup();
              markersQuery.refetch();
            }}
          >
            Hide
          </Button>
          <Button
            onClick={async () => {
              await toast.promise(
                update.mutateAsync({
                  id: marker.id,
                  data: { name },
                }),
                {
                  pending: "Please wait...",
                  success: "Marker name updated",
                  error: {
                    render({ data }) {
                      return data.message;
                    },
                  },
                }
              );
              ref.current?.closePopup();
              markersQuery.refetch();
            }}
          >
            Save
          </Button>
        </div>
      </div>
    </Popup>
  );
};

const clampSize = (zoom: number, divider: number = 1): [number, number] => {
  const size = Math.min(Math.max(zoom * 10, 16), 42);
  return [Math.floor(size / divider), Math.floor(size / divider)];
};
