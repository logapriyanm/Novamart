
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function verifyRegionUnification() {
    console.log('--- Verifying Region Unification ---');

    try {
        // 1. Check if there are any 'Global' allocations left (should be fixed going forward)
        const globalAllocations = await prisma.inventory.findMany({
            where: { region: 'Global' }
        });

        if (globalAllocations.length > 0) {
            console.warn(`[WARN] Found ${globalAllocations.length} legacy 'Global' allocations. They might cause issues for dealers.`);

            // Optional: Migrating them to NATIONAL if they belong to a dealer?
            // Actually, let's just note them.
        } else {
            console.log('[OK] No legacy Global allocations found.');
        }

        // 2. Simulate a check that would be performed by DealerService.sourceProduct
        // We'll look for any dealer who has an allocation but the region is NOT NATIONAL
        const nonNationalAllocations = await prisma.inventory.findMany({
            where: {
                isAllocated: true,
                region: { not: 'NATIONAL' }
            }
        });

        if (nonNationalAllocations.length > 0) {
            console.log(`[INFO] Non-NATIONAL allocations exist: ${nonNationalAllocations.length}. These might be manual regional allocations.`);
        }

        console.log('--- Verification Complete ---');
    } catch (error) {
        console.error('Verification failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

verifyRegionUnification();
