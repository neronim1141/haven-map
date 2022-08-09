import { getParentCoords, updateZoomLevel } from "..";

export async function processZoom(
  needProcess: Map<{ mapId: number; x: number; y: number }, boolean>,
  mapId: number
) {
  for (let z = 1; z <= 5; z++) {
    const process = new Map(needProcess);
    needProcess.clear();
    for (let p of process.keys()) {
      const tile = await updateZoomLevel(mapId, p.x, p.y, z);
      if (tile) {
        const coord = getParentCoords(p.x, p.y);
        needProcess.set({ mapId: p.mapId, x: coord.x, y: coord.y }, true);
      }
    }
  }
}
