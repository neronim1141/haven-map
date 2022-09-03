import { Tile } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSocketIO } from "~/hooks/useSocketIO";
import { ClientTile } from "~/pages/api/socketio";

export const useHavenMap = (mapId: number) => {
  const [data, setData] = useState<ClientTile[]>([]);
  const [incomingData, setIncomingData] = useState<ClientTile[]>([]);
  useSocketIO("tileUpdate", (mapUpdates) => {
    if (mapUpdates && mapId === mapUpdates.mapId) {
      setIncomingData((prev) => [...prev, mapUpdates]);
    }
  });

  useEffect(() => {
    const handler = setTimeout(() => {
      if (incomingData.length) {
        setData(incomingData);
        setIncomingData([]);
      }
    }, 1000);

    return () => {
      clearTimeout(handler);
    };
  }, [incomingData]);
  return data;
};
