/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Marker, Tile } from "@prisma/client";

import { createRouter } from "../../createRouter";
import { prisma } from "utils/prisma";
import { z } from "zod";
import { Coord, processZoom } from "./utils";
import { logger } from "utils/logger";
export const mapRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return await prisma.map.findMany();
    },
  })
  .mutation("update", {
    input: z.object({
      mapId: z.number(),
      data: z.object({
        hidden: z.boolean().optional(),
        priority: z.boolean().optional(),
        name: z.string().optional(),
      }),
    }),
    async resolve({ ctx, input: { mapId, data } }) {
      await prisma.map.update({
        where: {
          id: mapId,
        },
        data,
      });
    },
  })
  .mutation("rebuildZooms", {
    input: z.object({
      mapId: z.number(),
    }),
    async resolve({ ctx, input: { mapId } }) {
      let needProcess = new Map<string, Coord>([]);
      for (let grid of await prisma.grid.findMany({
        where: { mapId: mapId },
      })) {
        const coord = new Coord(grid.x, grid.y).parent();

        needProcess.set(coord.toString(), coord);
      }
      await prisma.tile.deleteMany({
        where: {
          mapId,
          gridId: null,
        },
      });

      await processZoom(needProcess, mapId);
    },
  })
  .mutation("rebuildAllZooms", {
    async resolve({ ctx }) {
      const maps = await prisma.map.findMany();
      for (let { id: mapId } of maps) {
        let needProcess = new Map<string, Coord>([]);
        for (let grid of await prisma.grid.findMany({
          where: { mapId: mapId },
        })) {
          const coord = new Coord(grid.x, grid.y).parent();

          needProcess.set(coord.toString(), coord);
        }
        await prisma.tile.deleteMany({
          where: {
            mapId,
          },
        });

        await processZoom(needProcess, mapId);
      }
      return true;
    },
  })
  .mutation("fixData", {
    async resolve() {
      const maps = await prisma.map.findMany();
      for (let { id: mapId } of maps) {
        const tiles = await prisma.grid.findMany({
          where: {
            OR: [{ mapId }, { tileData: null }],
          },
        });

        if (tiles.length === 0) {
          logger.log("deleted Map: " + mapId);

          await prisma.map.delete({
            where: { id: mapId },
          });
        }
      }
    },
  })
  .mutation("wipeTile", {
    input: z.object({
      mapId: z.number(),
      x: z.number(),
      y: z.number(),
    }),
    async resolve({ input: { mapId, x, y } }) {
      const grid = await prisma.grid.findFirst({ where: { mapId, x, y } });
      if (!grid) return;
      await prisma.marker.deleteMany({ where: { gridId: grid.id } });
      await prisma.grid.delete({ where: { id: grid.id } });
    },
  })
  .mutation("shiftZooms", {
    input: z.object({
      mapId: z.number(),
      shiftBy: z.object({
        x: z.number(),
        y: z.number(),
      }),
    }),
    async resolve({ ctx, input: { mapId, shiftBy } }) {
      const grids = await prisma.grid.findMany({
        where: {
          mapId,
        },
      });
      let needProcess = new Map<string, Coord>([]);

      for (let grid of grids) {
        const updatedGrid = await prisma.grid.update({
          where: { id: grid.id },
          data: {
            x: { increment: shiftBy.x },
            y: { increment: shiftBy.y },
          },
        });
        await prisma.tile.deleteMany({
          where: {
            mapId,
          },
        });

        const coord = new Coord(updatedGrid.x, updatedGrid.y).parent();

        needProcess.set(coord.toString(), coord);
      }

      await processZoom(needProcess, mapId);
    },
  })
  .mutation("delete", {
    input: z.object({
      mapId: z.number(),
    }),
    async resolve({ ctx, input: { mapId } }) {
      await prisma.map.delete({
        where: { id: mapId },
      });
      await prisma.grid.deleteMany({
        where: { mapId: mapId },
      });
      await prisma.tile.deleteMany({
        where: {
          mapId,
        },
      });
    },
  });
