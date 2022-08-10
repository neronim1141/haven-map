const { Role, PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const load = async () => {
  try {
    await prisma.user.upsert({
      where: { name: "admin" },
      create: {
        name: "admin",
        password: "admin",
        role: Role.ADMIN,
        token: "token",
      },
      update: {
        password: "admin",
        role: Role.ADMIN,
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
