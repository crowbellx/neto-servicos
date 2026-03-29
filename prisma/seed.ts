import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || "file:./dev.db",
    },
  },
});

async function main() {
  const hashedPassword = await bcrypt.hash('Miqu3M@quel4', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'enjubarte@gmail.com' },
    update: {},
    create: {
      email: 'contato@netoservicos.com.br',
      name: 'Neto',
      password: hashedPassword,
      role: 'SUPER_ADMIN',
    },
  });

  console.log({ admin });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
