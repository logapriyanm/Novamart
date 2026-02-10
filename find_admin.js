import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function findAdmin() {
    const admin = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        select: { email: true, role: true }
    });
    console.log(JSON.stringify(admin, null, 2));
    process.exit(0);
}

findAdmin().catch(e => {
    console.error(e);
    process.exit(1);
});
