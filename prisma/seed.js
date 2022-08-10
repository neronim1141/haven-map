const { Role, PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();
const load = async () => {
  try {
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
  } catch (e) {
    console.error(e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
};

load();
