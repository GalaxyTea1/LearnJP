import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.learningModule.updateMany({
    where: {
      level: {
        level: 'N5'
      },
      unitNumber: {
        in: [1, 2]
      }
    },
    data: {
      contentStatus: 'PUBLISHED'
    }
  });

  console.log(`Published ${result.count} N5 modules.`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
