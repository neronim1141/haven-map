import { prisma } from "lib/prisma";

import { File } from "formidable";
import { promises as fs } from "fs";
import { getParentCoords, saveTile, updateZoomLevel } from "../utils";
import * as logger from "lib/logger";
import { HnHMaxZoom, HnHMinZoom } from "features/map/config";

export type RequestData = {
  id: string;
  extraData: { season: number };
  file: File;
};
export const gridUpload = async (tile: RequestData) => {
  try {
    logger.log(`map Tile for: ${tile.id}`);
    const tileData = await fs.readFile(tile.file.filepath);
    const grid = await prisma.grid.findUnique({
      where: { id: tile.id },
    });
    if (!grid) {
      throw new Error(`Unknown grid id: ${tile.id}`);
    }
    await saveTile(grid.mapId, grid.x, grid.y, 0, tileData, grid.id);
    let coord = { x: grid.x, y: grid.y };

    for (let z = HnHMinZoom; z < HnHMaxZoom; z++) {
      coord = getParentCoords(coord.x, coord.y);
      await updateZoomLevel(grid.mapId, coord.x, coord.y, z);
    }
  } catch (e) {
    logger.error(e);
  } finally {
    fs.rm(tile.file.filepath);
  }
};
