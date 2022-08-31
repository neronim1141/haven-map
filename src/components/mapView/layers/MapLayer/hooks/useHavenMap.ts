import { Tile } from "@prisma/client";
import { useEffect, useState } from "react";
import { useSocketIO } from "~/hooks/useSocketIO";

export const useHavenMap = (mapId: number) => {
  const [data, setData] = useState<Tile[]>([]);
  const [incomingData, setIncomingData] = useState<Tile[]>([]);
  useSocketIO("tileUpdate", (mapUpdates) => {
    console.log(mapUpdates);

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
