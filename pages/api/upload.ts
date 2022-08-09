import { createRouter } from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import { File, IncomingForm } from "formidable";
import jszip, { JSZipObject } from "jszip";

type X_Y = string;
type GridId = string;
type GridsData = {
  Grids: {
    [key: X_Y]: GridId;
  };
  Markers: {
    [key: GridId]: {
      name: string;
      id: number;
      gridId: GridId;
      position: {
        x: number;
        y: number;
      };
      image: string;
      hidden: boolean;
    };
  };
};
type MapsData = {
  [key: string]: { data: GridsData; grids: [JSZipObject] };
};

const router = createRouter<NextApiRequest, NextApiResponse>();

router.post(async (req, res, next) => {
  let status = 200,
    resultBody = { status: "ok", message: "Files were uploaded successfully" };
  await new Promise((resolve, reject) => {
    const form = new IncomingForm({
      uploadDir: "./tmp",
    });
    form.parse(req, async (err, fields, files) => {
      const zip = (files.file as File[])?.[0];
      try {
        if (!zip) throw new Error("no File");

        const fileContent = await fs.readFile(zip.filepath);
        const jszipInstance = new jszip();
        const result = await jszipInstance.loadAsync(fileContent);
        const maps: MapsData = {};
        for (let key of Object.keys(result.files)) {
          const file = result.files[key];
          const [mapId, filename] = file.name.split("/");
          const [name, extension] = filename.split(".");

          const mapData = maps[mapId] ?? { data: undefined, grids: [] };
          if (extension === "json") {
            const gridsData: GridsData = JSON.parse(
              Buffer.from(await file.async("base64"), "base64").toString(
                "ascii"
              )
            );
            Object.keys(gridsData.Grids);
            mapData.data = gridsData;
          }
          if (extension === "png") {
            mapData.grids.push(file);
          }
          maps[mapId] = mapData;
          resolve(mapData);
        }
      } catch (err) {
        reject(err);
      } finally {
        if (zip) fs.rm(zip.filepath);
      }
    });
  });

  res.status(status).json(resultBody);
});

export const config = {
  api: {
    bodyParser: false,
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
