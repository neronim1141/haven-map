import { prisma } from "../../../../lib/prisma";
import { createNewMap } from "./createNewMap";
import { getMapsOffsets } from "./getMapsOffsets";
import { updateExistingMap } from "./upsertExistingMap";
import { GetPriorityMapData } from "./getPriorityMapData";

import { mergeMaps } from "./mergeMaps";
import * as logger from "lib/logger";
export type HavenGrids = [
  [string, string, string],
  [string, string, string],
  [string, string, string]
];
type GridRequest = {
  gridRequests: string[];
  map: number;
  coord: { x: number; y: number };
};

export const gridUpdate = async (grids: HavenGrids) => {
  const gridRequests: GridRequest = {
    gridRequests: [],
    map: 0,
    coord: {
      x: 0,
      y: 0,
    },
  };
  const mapsOffsets = await getMapsOffsets(grids);

  if (Object.keys(mapsOffsets).length === 0) {
    gridRequests.gridRequests = await createNewMap(grids);
    return gridRequests;
  }

  const { mapId, offset } = await GetPriorityMapData(mapsOffsets);
  logger.log(`client in mapID: ${mapId}`);

  gridRequests.gridRequests = await updateExistingMap(grids, mapId, offset);
  const centerGrid = (await prisma.grid.findUnique({
    where: { id: grids[1][1] },
  }))!;
  gridRequests.coord = { x: centerGrid.x, y: centerGrid.y };
  gridRequests.map = centerGrid.mapId;

  if (Object.keys(mapsOffsets).length > 1) {
    await mergeMaps(mapId, mapsOffsets, offset);
  }

  return gridRequests;
};
