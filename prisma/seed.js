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
