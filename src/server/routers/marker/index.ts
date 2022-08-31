/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Marker } from "@prisma/client";

import { createRouter } from "../../createRouter";
import { prisma } from "utils/prisma";
import { z } from "zod";

export interface ClientMarker extends Marker {
  mapId: number;
}
export const markerRouter = createRouter().query("all", {
  input: z.object({
    hidden: z.boolean(),
  }),
  async resolve({ ctx, input: { hidden } }) {
    const markers = await prisma.marker.findMany({
      where: { hidden },
    });
    const toSend: ClientMarker[] = [];
    //TODO: optimize
    for (let marker of markers) {
      const grid = await prisma.grid.findUnique({
        where: { id: marker.gridId },
      });

      const mappedMarker = mapMarkerType(marker);
      if (grid)
        toSend.push({
          ...mappedMarker,
          image: mappedMarker.image,
          mapId: grid.mapId,
          x: marker.x + grid.x * 100,
          y: marker.y + grid.y * 100,
        });
    }
    return toSend;
  },
});

const mapMarkerType = ({
  type: markerType,
  image,
  name,
  ...rest
}: Omit<Marker, "mapId">) => {
  let type = markerType;
  if (["cave", "exit", "cavein", "caveout"].includes(name.toLowerCase())) {
    image = "gfx/hud/mmap/cave";
    name = "Cave";
    type = "shared";
  }
  if (name.toLowerCase() === "tarpit") {
    image = "gfx/terobjs/mm/tarpit";
    name = "Tarpit";
    type = "shared";
  }
  if (name.toLowerCase().includes("thingwall")) {
    type = "thingwall";
  }
  if (
    image === "gfx/invobjs/small/bush" ||
    image === "gfx/invobjs/small/bumling"
  ) {
    type = "quest";
  }
  return { ...rest, name, image, type };
};
