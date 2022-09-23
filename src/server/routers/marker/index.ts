/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Marker, Prisma } from "@prisma/client";

import { createRouter } from "../../createRouter";
import { prisma } from "utils/prisma";
import { z } from "zod";

const tableMarkerSelect = Prisma.validator<Prisma.MarkerSelect>()({
  id: true,
  name: true,
  type: true,
  hidden: true,
  gridId: true,
});
export interface ClientMarker extends Marker {
  mapId: number;
}
export interface TableMarker extends Marker {
  mapId?: number;
}
export const markerRouter = createRouter()
  .query("all", {
    input: z
      .object({
        all: z.boolean(),
      })
      .optional(),
    async resolve({ ctx, input }) {
      const markers = await prisma.marker.findMany({
        where: {
          hidden: false,
        },
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
  })
  .query("table", {
    input: z
      .object({
        filters: z.object({ name: z.string().optional() }).optional(),
        pagination: z.object({ take: z.number(), skip: z.number() }).optional(),
      })
      .optional(),
    async resolve({ ctx, input }) {
      const query: Prisma.MarkerWhereInput = {
        name: {
          contains:
            input?.filters?.name === "" ? undefined : input?.filters?.name,
          mode: "insensitive",
        },
      };
      const total = await prisma.marker.count({
        where: query,
      });
      const markers = await prisma.marker.findMany({
        where: query,
        take: input?.pagination?.take,
        skip: input?.pagination?.skip,
      });
      const toSend: TableMarker[] = [];
      //TODO: optimize
      for (let marker of markers) {
        const grid = await prisma.grid.findUnique({
          where: { id: marker.gridId },
        });

        const mappedMarker = mapMarkerType(marker);
        toSend.push({
          ...mappedMarker,
          image: mappedMarker.image,
          mapId: grid?.mapId,
          x: marker.x + (grid?.x ?? 1) * 100,
          y: marker.y + (grid?.y ?? 1) * 100,
        });
      }
      return { count: total, entries: toSend };
    },
  })
  .mutation("update", {
    input: z.object({
      id: z.string(),
      data: z.object({
        hidden: z.boolean().optional(),
        name: z.string().optional(),
      }),
    }),
    async resolve({ ctx, input: { id, data } }) {
      await prisma.marker.update({
        where: {
          id,
        },
        data,
      });
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
  if (image?.toLowerCase().includes("thingwall")) {
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
