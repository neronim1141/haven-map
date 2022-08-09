import { Coord } from "../models";
import { prisma } from "lib/prisma";

export const GetPriorityMapData = async (mapsOffsets: {
  [key: number]: Coord;
}) => {
  let mapId: number = -1,
    offset = { x: 1, y: 1 };
  for (let [thisMapId, thisMapOffset] of Object.entries(mapsOffsets)) {
    const id = Number(thisMapId);
    const mapInfo = await prisma.map.findUnique({ where: { id: Number(id) } });
    if (mapInfo?.priority) {
      mapId = id;
      offset = thisMapOffset;
      break;
    }
    if (mapId === -1 || id < mapId) {
      mapId = id;
      offset = thisMapOffset;
    }
  }
  return {
    mapId,
    offset,
  };
};
