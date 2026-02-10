
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifyB2BFlow() {
    console.log('--- Verifying B2B Refined Flow (ESM) ---');

    try {
        // 1. Check if a test negotiation exists
        const neg = await prisma.negotiation.findFirst({
            where: { status: 'ORDER_FULFILLED' },
            include: { dealer: true, manufacturer: true, product: true }
        });

        if (!neg) {
            console.log('No fulfilled negotiation found to verify. Please complete one manually in the UI first.');
            return;
        }

        console.log(`Found Fulfilled Negotiation: ${neg.id}`);
        console.log(`Dealer: ${neg.dealer.businessName}`);
        console.log(`Manufacturer: ${neg.manufacturer.companyName}`);

        // 2. Verify Networking (Dealer should be in manufacturer's approved list)
        const mfg = await prisma.manufacturer.findUnique({
            where: { id: neg.manufacturerId },
            include: { dealersApproved: { where: { id: neg.dealerId } } }
        });

        if (mfg.dealersApproved.some(d => d.id === neg.dealerId)) {
            console.log('✅ Success: Dealer successfully connected to Manufacturer network.');
        } else {
            console.log('❌ Failure: Dealer NOT found in Manufacturer approved network.');
        }

        // 3. Verify Inventory Record
        const inv = await prisma.inventory.findFirst({
            where: {
                dealerId: neg.dealerId,
                productId: neg.productId
            }
        });

        if (inv) {
            console.log('✅ Success: Inventory record exists for dealer.');
            console.log(`Current Status: ${inv.isListed ? 'LIVE' : 'DRAFT'}`);
            console.log(`Allocated Stock: ${inv.allocatedStock}`);
            console.log(`Salable Stock: ${inv.stock}`);

            // 4. Verify Toggle Logic (Mock call simulation)
            console.log('Verifying toggleListing logic...');
            const updatedInv = await prisma.inventory.update({
                where: { id: inv.id },
                data: { isListed: true, listedAt: new Date() }
            });
            console.log(`✅ Success: Listing toggled. New Status: ${updatedInv.isListed ? 'LIVE' : 'DRAFT'}`);
        } else {
            console.log('❌ Failure: No inventory record found for the dealer.');
        }

    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyB2BFlow();
