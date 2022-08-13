const { Role, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
var path = require("path");
const fs = require("fs/promises");
const mapToFiles = async () => {
  const tiles = await prisma.tile.findMany();
  for await (let tile of tiles) {
    let dir = path.join(
      "public",
      "grids",
      tile.mapId.toString(),
      tile.z.toString()
    );
    await fs.mkdir(dir, { recursive: true });
    dir = path.join(dir, `${tile.x}_${tile.y}.webp`);
    await fs.writeFile(dir, tile.tileData);
    await prisma.tile.update({
      where: { id: tile.id },
      data: {
        tileUrl: path.join(
          "/",
          "grids",
          tile.mapId.toString(),
          tile.z.toString(),
          `${tile.x}_${tile.y}.webp`
        ),
      },
    });
  }
};
mapToFiles();
