import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const dealers = await prisma.user.findMany({
        where: { role: 'DEALER' },
        take: 5,
        select: { email: true }
    });
    console.log(JSON.stringify(dealers, null, 2));
    await prisma.$disconnect();
}

main();
