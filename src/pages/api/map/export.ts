import { createRouter } from "next-connect";
import { prisma } from "utils/prisma";
import type { NextApiRequest, NextApiResponse } from "next";
import jszip from "jszip";
import { parallel } from "radash/dist/async";

const router = createRouter<NextApiRequest, NextApiResponse>();
const partSize = 1000;

const getGridsByIteration = async (
  iteration: number,
  mapId: number,
  zip: jszip
) => {
  const grids = await prisma.grid.findMany({
    where: {
      mapId,
    },
    select: {
      id: true,
      x: true,
      y: true,
      mapId: true,
      tileData: true,
    },
    take: partSize,
    skip: iteration * partSize,
  });
  let markersData: string[] = [];

  for (let grid of grids) {
    if (grid.tileData) {
      zip.file(`${mapId}/${grid.id}_${grid.x}_${grid.y}.png`, grid.tileData);
    }

    const markers = await prisma.marker.findMany({
      where: {
        gridId: grid.id,
      },
    });
    for (let marker of markers) {
      markersData.push(
        `${marker.id}:${marker.name}:${marker.image}:${marker.gridId}:${
          marker.x
        }:${marker.y}:${marker.hidden ? 1 : 0}`
      );
    }
  }
  return markersData;
};

router.get(async (req, res) => {
  const zip = new jszip();
  const maps = await prisma.map.findMany();

  zip.file(
    `maps.csv`,
    maps
      .map(
        (map) =>
          `${map.id}:${map.name}:${map.hidden ? 1 : 0}:${
            map.priority ? 1 : 0
          }:${map.winterUpdate ? 1 : 0}`
      )
      .join(";\n")
  );

  for (let map of maps) {
    let count = await prisma.grid.count({
      where: {
        mapId: map.id,
      },
    });
    let iterations = Math.ceil(count / partSize);
    let iterationPromises = Array.from({ length: iterations }).map((_, i) =>
      getGridsByIteration(i, map.id, zip)
    );

    let markersData: string[] = [];
    await parallel(5, await Promise.all(iterationPromises), async (markers) => {
      markersData = markersData.concat(markers);
    });

    zip.file(`${map.id}/markers.csv`, markersData.join(";\n"));
  }
  const stream = await zip.generateAsync({ type: "nodebuffer" });
  res.setHeader("Content-Type", "application/zip");
  res.setHeader("Content-Disposition", `attachment; filename="export.zip"`);
  res.setHeader("Content-Length", stream.byteLength);

  return res.end(stream);
});
export const config = {
  api: {
    responseLimit: false,
  },
};
export default router.handler({
  onError: (err: any, req, res) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
});
