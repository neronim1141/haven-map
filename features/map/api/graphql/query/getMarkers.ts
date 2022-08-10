import { Marker } from "graphql/server/types";
import { prisma } from "lib/prisma";

export const getMarkers = async (hidden: boolean) => {
  const markers = await prisma.marker.findMany({
    where: { hidden },
  });
  const toSend: Marker[] = [];
  //TODO: optimize
  for (let marker of markers) {
    const grid = await prisma.grid.findUnique({
      where: { id: marker.gridId },
    });
    const icon = await prisma.markerIcon.findUnique({
      where: { image: marker.image },
    });
    if (grid)
      toSend.push({
        ...marker,
        image: !!icon ? marker.image : undefined,
        mapId: grid.mapId,
        x: marker.x + grid.x * 100,
        y: marker.y + grid.y * 100,
      });
  }
  return toSend;
};
