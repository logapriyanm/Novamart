import prisma from '../src/server/lib/prisma.js';

/**
 * Debug Script: Check Product and Manufacturer Status
 * 
 * This script checks:
 * 1. Total products in database
 * 2. Products by status
 * 3. Manufacturer user status
 * 4. Products with their manufacturer details
 */

async function debugProducts() {
    try {
        console.log('🔍 Debugging Product Visibility...\n');

        // 1. Check total products
        const totalProducts = await prisma.product.count();
        console.log(`📦 Total Products: ${totalProducts}`);

        // 2. Check products by status
        const productsByStatus = await prisma.product.groupBy({
            by: ['status'],
            _count: true
        });
        console.log('\n📊 Products by Status:');
        productsByStatus.forEach(({ status, _count }) => {
            console.log(`   ${status}: ${_count}`);
        });

        // 3. Check APPROVED products with manufacturer details
        const approvedProducts = await prisma.product.findMany({
            where: { status: 'APPROVED' },
            include: {
                manufacturer: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true,
                                role: true,
                                status: true
                            }
                        }
                    }
                }
            }
        });

        console.log(`\n✅ APPROVED Products: ${approvedProducts.length}`);

        if (approvedProducts.length > 0) {
            console.log('\n📋 Product Details:');
            approvedProducts.forEach((product, index) => {
                console.log(`\n${index + 1}. ${product.name}`);
                console.log(`   Product ID: ${product.id}`);
                console.log(`   Status: ${product.status}`);
                console.log(`   isApproved: ${product.isApproved}`);
                console.log(`   Manufacturer: ${product.manufacturer.companyName}`);
                console.log(`   Manufacturer User Status: ${product.manufacturer.user.status}`);
                console.log(`   Manufacturer User Email: ${product.manufacturer.user.email}`);
            });
        }

        // 4. Check if any manufacturers have SUSPENDED status
        const suspendedManufacturers = await prisma.manufacturer.findMany({
            where: {
                user: {
                    status: 'SUSPENDED'
                }
            },
            include: {
                user: {
                    select: { email: true, status: true }
                },
                products: {
                    select: { id: true, name: true, status: true }
                }
            }
        });

        if (suspendedManufacturers.length > 0) {
            console.log(`\n⚠️  SUSPENDED Manufacturers: ${suspendedManufacturers.length}`);
            suspendedManufacturers.forEach((mfr) => {
                console.log(`   - ${mfr.companyName} (${mfr.user.email})`);
                console.log(`     Products: ${mfr.products.length}`);
            });
        }

        // 5. Check the exact filter used by the API
        const apiFilter = {
            AND: [
                { status: 'APPROVED' },
                { manufacturer: { user: { status: { not: 'SUSPENDED' } } } }
            ]
        };

        const visibleProducts = await prisma.product.findMany({
            where: apiFilter,
            include: {
                manufacturer: {
                    select: {
                        companyName: true,
                        isVerified: true
                    }
                }
            }
        });

        console.log(`\n🎯 Products Visible to Dealers (API Filter): ${visibleProducts.length}`);

        if (visibleProducts.length === 0) {
            console.log('\n❌ NO PRODUCTS MATCH THE DEALER MARKETPLACE FILTER!');
            console.log('\nPossible reasons:');
            console.log('1. No products exist in the database');
            console.log('2. All products have status other than APPROVED');
            console.log('3. All manufacturer users are SUSPENDED');
            console.log('4. Manufacturer relationship is broken');
        } else {
            console.log('\n✅ These products should be visible:');
            visibleProducts.forEach((p) => {
                console.log(`   - ${p.name} by ${p.manufacturer.companyName}`);
            });
        }

    } catch (error) {
        console.error('❌ Debug failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugProducts();
