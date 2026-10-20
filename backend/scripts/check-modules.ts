import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const modules = await prisma.learningModule.findMany({
    where: { level: { level: 'N5' } }
  });
  console.log(modules.map(m => ({ id: m.id, unit: m.unitNumber, title: m.title, status: m.contentStatus })));
}

main().finally(() => prisma.$disconnect());
