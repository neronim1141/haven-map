import { promises as fs } from "fs";

export const fileToString = async (path: string) => {
  return (await fs.readFile(path)).toString("utf-8");
};
