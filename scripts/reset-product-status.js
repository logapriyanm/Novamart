import prisma from '../src/server/lib/prisma.js';

/**
 * Reset Product Status to PENDING
 * 
 * Purpose: Reset all APPROVED products to PENDING status
 * so they go through proper admin approval workflow
 */

async function resetProductStatus() {
    try {
        console.log('🔄 Resetting product statuses to PENDING...');

        // Update all APPROVED products back to PENDING
        const result = await prisma.product.updateMany({
            where: {
                status: 'APPROVED'
            },
            data: {
                status: 'PENDING',
                isApproved: false
            }
        });

        console.log(`✅ Successfully reset ${result.count} products to PENDING status`);

        // Log the current status distribution
        const statusCounts = await prisma.product.groupBy({
            by: ['status'],
            _count: true
        });

        console.log('\n📊 Current Product Status Distribution:');
        statusCounts.forEach(({ status, _count }) => {
            console.log(`   ${status}: ${_count} products`);
        });

    } catch (error) {
        console.error('❌ Reset failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

resetProductStatus()
    .then(() => {
        console.log('\n✨ Reset completed successfully!');
        console.log('👉 Products now require admin approval at /admin/products');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Reset failed:', error);
        process.exit(1);
    });
