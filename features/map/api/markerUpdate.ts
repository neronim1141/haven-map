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
}[];

export const markerUpdate = async (markers: MarkersRequest, role?: Role) => {
  for (let marker of markers) {
    if (marker.image === "" && !canAccess(Role.VILLAGER, role)) continue;
    const { gridID, ...data } = marker;
    const grid = await prisma.grid.findUnique({ where: { id: gridID } });
    if (!grid) continue;

    if (data.type === "player") continue;
    if (data.image == "") {
      data.image = "gfx/terobjs/mm/custom";
      data.type = "custom";
    }
    console.log(data.image);
    await prisma.marker.upsert({
      where: {
        id: data.id,
      },
      update: {
        ...data,
        gridId: gridID,
      },
      create: {
        ...data,
        gridId: gridID,
      },
    });
  }
};
