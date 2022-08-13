import { prisma } from "lib/prisma";
import { pubsub } from "lib/pubsub";

import { File } from "formidable";
import { promises as fs } from "fs";
import { Coord, saveTile, updateZoomLevel } from "../utils";
import * as logger from "lib/logger";
import { HnHMaxZoom, HnHMinZoom } from "features/map/config";
import { Tile } from "@prisma/client";

export type RequestData = {
  id: string;
  extraData: { season: number };
  file: File;
};
export const gridUpload = async (tile: RequestData) => {
  try {
    const tileData = await fs.readFile(tile.file.filepath);
    const grid = await prisma.grid.findUnique({
      where: { id: tile.id },
    });
    if (!grid) {
      throw new Error(`Unknown grid id: ${tile.id}`);
    }
    const tiles: Tile[] = [];
    tiles.push(
      await saveTile(grid.mapId, grid.x, grid.y, 0, tileData, grid.id)
    );
    let coord = { x: grid.x, y: grid.y };

    for (let z = HnHMinZoom; z < HnHMaxZoom; z++) {
      coord = new Coord(coord.x, coord.y).parent();
      const tile = await updateZoomLevel(grid.mapId, coord.x, coord.y, z);
      if (tile) tiles.push(tile);
    }
    pubsub.publish("tileUpdate", grid.mapId, tiles);
  } catch (e) {
    logger.error(e);
  } finally {
    fs.rm(tile.file.filepath);
  }
};
