
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function testNegotiationFlow() {
    console.log('--- Testing Negotiation Flow (ESM) ---');

    try {
        // 1. Get a Dealer and a Product
        const dealer = await prisma.dealer.findFirst({
            include: { user: true }
        });
        const product = await prisma.product.findFirst({
            where: { isApproved: true }, // Prisma schema says isApproved: Boolean
            include: { manufacturer: true }
        });

        if (!dealer || !product) {
            console.error('❌ Could not find test data (Dealer or Approved Product).');
            return;
        }

        console.log(`Using Dealer: ${dealer.businessName}`);
        console.log(`Using Product: ${product.name}`);

        // 2. Simulate Dealer creating negotiation
        console.log('\n1. Creating Negotiation...');
        const negotiation = await prisma.negotiation.create({
            data: {
                dealerId: dealer.id,
                manufacturerId: product.manufacturerId,
                productId: product.id,
                quantity: 10,
                currentOffer: 500,
                status: 'OPEN',
                chatLog: [{
                    sender: 'DEALER',
                    message: 'Started test negotiation',
                    time: new Date()
                }]
            }
        });
        console.log(`✅ Created Negotiation ID: ${negotiation.id}`);

        // 3. Simulate Manufacturer accepting
        console.log('\n2. Accepting Negotiation...');
        const accepted = await prisma.negotiation.update({
            where: { id: negotiation.id },
            data: {
                status: 'ACCEPTED',
                chatLog: [...(negotiation.chatLog || []), {
                    sender: 'MANUFACTURER',
                    message: 'Accepted test terms',
                    time: new Date()
                }]
            }
        });
        console.log(`✅ Status updated to: ${accepted.status}`);

        // 4. Simulate Fulfillment (Triggering Stock Allocation)
        console.log('\n3. Simulating Fulfillment & Stock Allocation...');

        // Ensure Dealer is in Manufacturer's network first (Prerequisite)
        await prisma.manufacturer.update({
            where: { id: product.manufacturerId },
            data: {
                dealersApproved: { connect: { id: dealer.id } }
            }
        });

        const status = 'ORDER_FULFILLED';

        if (status === 'ORDER_FULFILLED') {
            // We'll use the stockAllocationService logic here directly for the test
            const existingInv = await prisma.inventory.findFirst({
                where: { productId: product.id, dealerId: dealer.id, region: 'Global' }
            });

            const inventory = await prisma.inventory.upsert({
                where: {
                    id: existingInv?.id || 'new-allocation-' + Date.now().toString().slice(-8)
                },
                update: {
                    allocatedStock: { increment: 10 },
                    dealerBasePrice: 500,
                    isAllocated: true
                },
                create: {
                    productId: product.id,
                    dealerId: dealer.id,
                    region: 'Global',
                    stock: 0,
                    allocatedStock: 10,
                    dealerBasePrice: 500,
                    isAllocated: true,
                    price: 500
                }
            });
            console.log(`✅ Stock Allocated. Inventory ID: ${inventory.id}`);

            await prisma.negotiation.update({
                where: { id: negotiation.id },
                data: {
                    status: 'ORDER_FULFILLED',
                    chatLog: [...(accepted.chatLog || []), {
                        sender: 'SYSTEM',
                        message: `Order Processed. 10 units allocated at ₹500.`,
                        time: new Date()
                    }]
                }
            });
        }

        const finalNeg = await prisma.negotiation.findUnique({ where: { id: negotiation.id } });
        console.log(`\nFinal Negotiation Status: ${finalNeg.status}`);
        console.log('✅ Full flow test passed!');

    } catch (err) {
        console.error('❌ Test failed:', err);
    } finally {
        await prisma.$disconnect();
    }
}

testNegotiationFlow();
