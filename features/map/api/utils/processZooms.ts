import { Tile } from "@prisma/client";
import { HnHMaxZoom, HnHMinZoom } from "features/map/config";
import { Coord, updateZoomLevel } from ".";

export async function processZoom(
  needProcess: Map<string, Coord>,
  mapId: number
) {
  const tiles: Tile[] = [];
  for (let z = HnHMinZoom; z < HnHMaxZoom; z++) {
    const process = new Map(needProcess);
    needProcess.clear();
    for (let p of process.values()) {
      const tile = await updateZoomLevel(mapId, p.x, p.y, z);
      if (tile) {
        const coord = p.parent();
        needProcess.set(coord.toString(), coord);
        tiles.push(tile);
      }
    }
  }
  return tiles;
}
