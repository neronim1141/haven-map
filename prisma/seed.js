const { Role, PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const fs = require("fs/promises");

const resetAdmin = async () => {
  const password = await bcrypt.hash("admin", 10);
  await prisma.user.upsert({
    where: { name: "admin" },
    create: {
      name: "admin",
      password: password,
      role: Role.ADMIN,
      token: (await bcrypt.hash("admin", 1))
        .replace(/[^a-z]/g, "")
        .slice(0, 15),
    },
    update: {
      password: password,
      role: Role.ADMIN,
      token: (await bcrypt.hash("admin", 1))
        .replace(/[^a-z]/g, "")
        .slice(0, 15),
    },
  });
  console.log("Restored admin user");
};

async function getFiles(dir, files_) {
  files_ = files_ || [];
  var files = await fs.readdir(dir);
  for (var i in files) {
    var name = dir + "/" + files[i];
    if ((await fs.stat(name)).isDirectory()) {
      await getFiles(name, files_);
    } else {
      files_.push(name);
    }
  }
  return files_;
}

// const resetIcons = async () => {
//   const folderPath = "./default_icons";
//   await prisma.markerIcon.deleteMany();
//   for (let filepath of await getFiles(folderPath)) {
//     const file = await fs.readFile(filepath);
//     const imageCode = filepath
//       .replace(folderPath + "/", "")
//       .replace(".png", "");
//     await prisma.markerIcon.create({
//       data: {
//         image: imageCode,
//         iconData: file,
//       },
//     });
//   }
//   console.log("Restarted icons");
// };

const load = async () => {
  try {
    await resetAdmin();
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
