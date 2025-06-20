const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const prisma = new PrismaClient();

async function main() {
  // Cria admin
  const adminExists = await prisma.user.findUnique({
    where: { email: "admin@nilfisk.com" },
  });

  if (!adminExists) {
    const hashedAdminPassword = await bcrypt.hash("Mudar2025", 10);
    await prisma.user.create({
      data: {
        name: "Administrador",
        email: "admin@nilfisk.com",
        password: hashedAdminPassword,
        role: "ADMIN",
      },
    });
    console.log("✅ Admin criado com sucesso");
  } else {
    console.log("ℹ️ Admin já existe");
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
