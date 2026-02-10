import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetAdmin() {
    const email = 'test_admin_super@novamart.com';
    const hashedPassword = await bcrypt.hash('AdminPassword123', 10);

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            password: hashedPassword,
            role: 'ADMIN',
            adminRole: 'SUPER_ADMIN',
            status: 'ACTIVE'
        },
        create: {
            email,
            password: hashedPassword,
            role: 'ADMIN',
            adminRole: 'SUPER_ADMIN',
            status: 'ACTIVE',
            phone: '9999999999'
        }
    });

    console.log(`✅ Admin ${email} is now ACTIVE SUPER_ADMIN with password: AdminPassword123`);
    process.exit(0);
}

resetAdmin().catch(e => {
    console.error(e);
    process.exit(1);
});
