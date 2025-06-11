// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.create({
    data: {
      name: 'Vagner Admin',
      email: 'admin@nilfisk.com',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });

  console.log('Admin criado com sucesso');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
