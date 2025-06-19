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

  // Lista de nomes dos holerites
  const userNames = [
    "CAMILO AUGUSTO ANUNCIATO MARINHO",
    "MICHEL FERNANDES DOS SANTOS",
    "ADRIANO DA SILVA DIAS",
    "ANDRE STOPIGLIA",
    "ANTONIO OZNIRLANDO ARAUJO SILVEIRA",
    "ARTUR FERREIRA ROVERSO",
    "DOUGLAS RICARDO BARBOZA FRANCO",
    "JHONY DA SILVA",
    "LEANDRO RAMPANI",
    "LEONARDO DE ALMEIDA VERAS",
    "LICESIO SCHNECKEMBERG",
    "PALOMA MARQUES ROCHA",
    "RICARDO JORGE",
    "ROGERIO MARINHO OLIVEIRA REZENDE",
    "SANDRA LUCIA PETRONI",
    "SILVIO RIBEIRO JUNIOR",
    "ANA CLAUDIA CARDOSO PIRES",
    "ANDERSON DOS SANTOS SOUZA",
    "ANDERSON SIQUEIRA FRANCO",
    "CLEIDER MENDES",
    "FAUSTO MATTIAZZO FERREIRA DOS SANTOS",
    "FERNANDO BENEDITO DE SOUZA",
    "JULIO CESAR GOMES",
    "SAMUEL RIBEIRO DA SILVA",
    "ELIANE DE FREITAS MENDONCA SILVA",
    "ERIVALDO ABILIO DA SILVA",
    "RENE BARRETO DA SILVA",
    "DAVID FUJIAMA DORIA",
    "WAGNER LUIZ ALVES DE ARAUJO",
  ];

  const hashedPassword = await bcrypt.hash("Mudar2025", 10);

  for (const name of userNames) {
    const email =
      name
        .split(" ")[0]
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase() + "@nilfisk.com";

    await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        name,
        email,
        password: hashedPassword,
        role: "COMMON",
      },
    });

    console.log(`👤 Usuário criado ou atualizado: ${name} (${email})`);
  }
}

main()
  .catch((e) => {
    console.error("❌ Erro no seed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
