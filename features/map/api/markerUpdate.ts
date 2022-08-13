import { Role } from "@prisma/client";
import { canAccess } from "features/auth/canAccess";
import { prisma } from "lib/prisma";

export type MarkersRequest = {
  id: number;
  image: string;
  x: number;
  y: number;
  gridID: string;
  name: string;
  type: string;
  color?: string;
}[];

export const markerUpdate = async (markers: MarkersRequest, role?: Role) => {
  if (!canAccess(Role.VILLAGER, role)) return;

  for (let marker of markers) {
    const { gridID, color, ...data } = marker;
    const grid = await prisma.grid.findUnique({ where: { id: gridID } });
    if (!grid) continue;

    if (!data.image || data.image == "") {
      data.image = "gfx/terobjs/mm/custom";
      data.type = "custom";
    } else if (
      data.image === "gfx/invobjs/small/bush" ||
      data.image === "gfx/invobjs/small/bumling"
    ) {
      data.type = "quest";
    }
    const id = `${grid.id}_${data.x}_${data.y}`;
    await prisma.marker.upsert({
      where: {
        id,
      },
      update: {
        ...data,
        id,
        gridId: gridID,
      },
      create: {
        ...data,
        id,
        gridId: gridID,
      },
    });
  }
};
