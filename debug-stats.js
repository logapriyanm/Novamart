
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function test() {
    const mfg = await prisma.manufacturer.findFirst();
    if (!mfg) {
        console.log('No manufacturer found');
        return;
    }
    const mfgId = mfg.id;
    console.log('Testing MFG ID:', mfgId);

    try {
        console.log('Testing getSalesAnalytics Query...');
        const orders = await prisma.order.findMany({
            where: {
                dealer: {
                    approvedBy: {
                        some: {
                            id: mfgId
                        }
                    }
                },
                status: 'SETTLED'
            },
            include: {
                items: {
                    include: {
                        linkedProduct: true
                    }
                }
            }
        });
        console.log('Orders found:', orders.length);

        console.log('Testing getCreditStatus Query...');
        const escrows = await prisma.escrow.findMany({
            where: {
                order: {
                    items: {
                        some: {
                            linkedProduct: {
                                manufacturerId: mfgId
                            }
                        }
                    }
                },
                status: {
                    in: ['HOLD', 'FROZEN']
                }
            }
        });
        console.log('Escrows found:', escrows.length);

    } catch (error) {
        console.log('ERROR DETECTED - CHECK debug-error.txt');
        const fs = await import('node:fs');
        fs.writeFileSync('debug-error.txt', error.toString() + '\n\n' + JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
        console.log('Error written to debug-error.txt');
    } finally {
        await prisma.$disconnect();
    }
}

test();
