import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function checkPriceLeakage() {
    console.log('🚀 Checking for Wholesale Price Leakage...');

    try {
        const productsRes = await axios.get(`${API_URL}/products?status=APPROVED`);
        const products = productsRes.data.products;

        if (products && products.length > 0) {
            const leaked = products.filter(p => p.wholesalePrice !== undefined && p.wholesalePrice !== null);
            if (leaked.length > 0) {
                console.error(`⚠️ WARNING: ${leaked.length} products are leaking wholesalePrice to guests!`);
                console.log('Example leaked fields:', Object.keys(leaked[0]));
            } else {
                console.log('✅ Success: No wholesalePrice leakage detected in list view.');
            }

            // Try individual product
            const firstId = products[0].id;
            const productRes = await axios.get(`${API_URL}/products/${firstId}`);
            if (productRes.data.data.wholesalePrice !== undefined && productRes.data.data.wholesalePrice !== null) {
                console.error('⚠️ WARNING: Individual product API is leaking wholesalePrice!');
            } else {
                console.log('✅ Success: No wholesalePrice leakage in detail view.');
            }
        } else {
            console.log('No approved products found to test.');
        }
        process.exit(0);
    } catch (error) {
        console.error('❌ Error during check:', error.message);
        process.exit(1);
    }
}

checkPriceLeakage();
