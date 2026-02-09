
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('Starting seed...');
    const password = await bcrypt.hash('MONI@VKY21', 10);
    const dealerPassword = await bcrypt.hash('dealer123', 10);

    // 1. Check/Create Customer
    let customerUser = await prisma.user.findUnique({ where: { email: 'demo@novamart.com' } });
    if (!customerUser) {
        console.log('Creating Customer...');
        customerUser = await prisma.user.create({
            data: {
                email: 'demo@novamart.com',
                password: password,
                role: 'CUSTOMER',
                status: 'ACTIVE',
                customer: {
                    create: { name: 'Viren Malhotra' }
                }
            }
        });
    } else {
        console.log('Customer already exists. Updating password...');
        await prisma.user.update({
            where: { id: customerUser.id },
            data: { password: password, status: 'ACTIVE' }
        });
    }

    // 2. Check/Create Dealer User
    let dealerUser = await prisma.user.findUnique({ where: { email: 'dealer@novamart.com' } });
    if (!dealerUser) {
        console.log('Creating Dealer User...');
        dealerUser = await prisma.user.create({
            data: {
                email: 'dealer@novamart.com',
                password: dealerPassword,
                role: 'DEALER',
                status: 'ACTIVE'
            }
        });
    } else {
        console.log('Dealer User already exists. Updating password...');
        await prisma.user.update({
            where: { id: dealerUser.id },
            data: { password: dealerPassword, status: 'ACTIVE' }
        });
    }

    // 3. Check/Create Dealer Profile
    const existingDealerProfile = await prisma.dealer.findUnique({ where: { userId: dealerUser.id } });
    let dealerProfile = existingDealerProfile;
    if (!existingDealerProfile) {
        console.log('Creating Dealer Profile...');
        dealerProfile = await prisma.dealer.create({
            data: {
                userId: dealerUser.id,
                businessName: 'TechHub Electronics',
                gstNumber: '27AABCU9603R1ZN',
                businessAddress: '123 Tech Park, Mumbai',
                bankDetails: {
                    accountNumber: '1234567890',
                    ifsc: 'HDFC0001234'
                }
            }
        });
    }

    // 4. Create Product
    console.log('Creating Product...');
    let product = await prisma.product.findFirst({ where: { name: 'Ultra-Quiet AC 2.0' } });

    // Ensure Manufacturer works
    let manufacturerUser = await prisma.user.findUnique({ where: { email: 'mfg@novamart.com' } });
    if (!manufacturerUser) {
        console.log('Creating Manufacturer User...');
        manufacturerUser = await prisma.user.create({
            data: {
                email: 'mfg@novamart.com',
                password: await bcrypt.hash('mfg123', 10),
                role: 'MANUFACTURER',
                status: 'ACTIVE'
            }
        });
    } else {
        await prisma.user.update({
            where: { id: manufacturerUser.id },
            data: { password: await bcrypt.hash('mfg123', 10), status: 'ACTIVE' }
        });
    }

    let manufacturer = await prisma.manufacturer.findUnique({ where: { userId: manufacturerUser.id } });
    if (!manufacturer) {
        console.log('Creating Manufacturer Profile...');
        manufacturer = await prisma.manufacturer.create({
            data: {
                userId: manufacturerUser.id,
                companyName: 'Nova Cooling Systems',
                registrationNo: 'CIN123456',
                factoryAddress: 'Industrial Area, Pune',
                gstNumber: '27AAECM1234F1Z5',
                bankDetails: {}
            }
        });
    }

    if (!product) {
        product = await prisma.product.create({
            data: {
                manufacturerId: manufacturer.id,
                name: 'Ultra-Quiet AC 2.0',
                description: 'Silent and efficient cooling',
                basePrice: 42200,
                category: 'home-appliances',
                specifications: { cooling: '1.5 Ton', energy: '5 Star' },
                images: ['https://placehold.co/600x400']
            }
        });
    }

    // 5. Create Inventory
    console.log('Creating Inventory...');
    if (product && dealerProfile) {
        const existingInventory = await prisma.inventory.findFirst({
            where: { productId: product.id, dealerId: dealerProfile.id }
        });

        if (!existingInventory) {
            await prisma.inventory.create({
                data: {
                    productId: product.id,
                    dealerId: dealerProfile.id,
                    region: 'Mumbai',
                    stock: 50,
                    locked: 0,
                    price: 42200
                }
            });
        }
    }

    // 6. Check/Create Admin User
    let adminUser = await prisma.user.findUnique({ where: { email: 'admin@novamart.com' } });
    if (!adminUser) {
        console.log('Creating Admin User...');
        adminUser = await prisma.user.create({
            data: {
                email: 'admin@novamart.com',
                password: await bcrypt.hash('admin123', 10),
                role: 'ADMIN',
                status: 'ACTIVE',
                adminRole: 'SUPER_ADMIN'
            }
        });
    } else {
        console.log('Admin User already exists. Updating password...');
        await prisma.user.update({
            where: { id: adminUser.id },
            data: { password: await bcrypt.hash('admin123', 10), status: 'ACTIVE' }
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
