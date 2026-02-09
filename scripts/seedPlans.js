import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seed() {
    try {
        const plans = [
            {
                name: 'BASIC', price: 0, duration: 365, margin: 5, rank: 1,
                features: ['Access to basic catalog', 'Standard Support'],
                wholesaleDiscount: 0, marginBoost: 0, priorityAllocation: false
            },
            {
                name: 'PRO', price: 4999, duration: 365, margin: 15, rank: 2,
                features: ['Priority Support', '5% Wholesale Discount', 'Verified Badge', '5% Margin Boost'],
                wholesaleDiscount: 5, marginBoost: 5, priorityAllocation: true
            },
            {
                name: 'ENTERPRISE', price: 14999, duration: 365, margin: 25, rank: 3,
                features: ['Dedicated Manager', '10% Wholesale Discount', 'Priority Stock Access', '10% Margin Boost'],
                wholesaleDiscount: 10, marginBoost: 10, priorityAllocation: true
            }
        ];

        for (const plan of plans) {
            const existing = await prisma.subscriptionPlan.findFirst({ where: { name: plan.name } });
            if (existing) {
                await prisma.subscriptionPlan.update({
                    where: { id: existing.id },
                    data: {
                        ...plan,
                        features: plan.features
                    }
                });
            } else {
                await prisma.subscriptionPlan.create({ data: plan });
            }
        }
        console.log('Plans seeded/updated successfully');
    } catch (e) {
        console.error('Seeding failed:', e);
    } finally {
        await prisma.$disconnect();
    }
}

seed();
