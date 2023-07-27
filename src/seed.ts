import { PrismaClient } from '@prisma/client';
import * as process from 'process';

const prisma = new PrismaClient();

async function main() {
  await initRoles();
}

async function initRoles() {
  await prisma.role.upsert({
    where: {
      name: 'user',
    },
    update: {},
    create: {
      name: 'user',
    },
  });
  await prisma.role.upsert({
    where: {
      name: 'admin',
    },
    update: {},
    create: {
      name: 'admin',
    },
  });
}

main()
  .then(async () => [await prisma.$disconnect()])
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
