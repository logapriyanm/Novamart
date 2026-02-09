import prisma from '../src/server/lib/prisma.js';
import logger from '../src/server/lib/logger.js';

/**
 * Migration Script: Auto-Approve All Manufacturer Products
 * 
 * Purpose: Update all existing manufacturer products to APPROVED status
 * so they appear in the dealer marketplace.
 * 
 * Workflow:
 * - Admin verifies manufacturers (one-time)
 * - Manufacturers verify dealers (one-time)
 * - All manufacturer products are auto-approved (no admin verification)
 */

async function migrateProducts() {
    try {
        console.log('🔄 Starting product migration...');

        // Update all products that are DRAFT or PENDING to APPROVED
        const result = await prisma.product.updateMany({
            where: {
                OR: [
                    { status: 'DRAFT' },
                    { status: 'PENDING' }
                ]
            },
            data: {
                status: 'APPROVED',
                isApproved: true
            }
        });

        console.log(`✅ Successfully updated ${result.count} products to APPROVED status`);

        // Log the current status distribution
        const statusCounts = await prisma.product.groupBy({
            by: ['status'],
            _count: true
        });

        console.log('\n📊 Current Product Status Distribution:');
        statusCounts.forEach(({ status, _count }) => {
            console.log(`   ${status}: ${_count} products`);
        });

        logger.info(`Product migration completed: ${result.count} products updated to APPROVED`);

    } catch (error) {
        console.error('❌ Migration failed:', error);
        logger.error('Product migration error:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Run the migration
migrateProducts()
    .then(() => {
        console.log('\n✨ Migration completed successfully!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Migration failed:', error);
        process.exit(1);
    });
