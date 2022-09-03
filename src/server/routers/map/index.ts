/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { Marker, Tile } from "@prisma/client";

import { createRouter } from "../../createRouter";
import { prisma } from "utils/prisma";
import { z } from "zod";
import { Coord, processZoom } from "./utils";

export const mapRouter = createRouter()
  .query("all", {
    async resolve({ ctx }) {
      return await prisma.map.findMany();
    },
  })
  .mutation("update", {
    input: z.object({
      mapId: z.number(),
    }),
    async resolve({ ctx, input: { mapId } }) {
      await prisma.map.update({
        where: {
          id: mapId,
        },
        data: {
          hidden: true,
        },
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
          await prisma.map.delete({
            where: { id: mapId },
          });
        }
      }
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
      const tiles: Tile[] = [];

      for (let grid of grids) {
        await prisma.grid.update({
          where: { id: grid.id },
          data: {
            x: { increment: shiftBy.x },
            y: { increment: shiftBy.y },
          },
        });
        tiles.push(
          await prisma.tile.update({
            where: { gridId: grid.id },
            data: {
              x: { increment: shiftBy.x },
              y: { increment: shiftBy.y },
            },
          })
        );
      }

      await prisma.tile.deleteMany({
        where: {
          gridId: null,

          mapId,
        },
      });
      let needProcess = new Map<string, Coord>([]);
      for (let tile of tiles) {
        const coord = new Coord(tile.x, tile.y).parent();

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
