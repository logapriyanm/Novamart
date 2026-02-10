import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyProductsApi() {
    console.log('🚀 Verifying Products API Sync...\n');

    try {
        // 1. Verify /products
        console.log('--- 1. Testing /api/products ---');
        const res = await axios.get(`${API_URL}/products`);

        if (res.data.success && res.data.data && Array.isArray(res.data.data.products)) {
            console.log('✅ Success: /api/products is correctly wrapped and paginated.');
            console.log('Products Count:', res.data.data.products.length);
            console.log('Pagination info:', res.data.data.pagination);
        } else {
            console.log('❌ Failure: /api/products response structure incorrect.');
            console.log('Response:', JSON.stringify(res.data, null, 2));
        }

        // 2. Verify /products/filters
        console.log('\n--- 2. Testing /api/products/filters ---');
        const filterRes = await axios.get(`${API_URL}/products/filters?category=all`);

        if (filterRes.data.success && filterRes.data.data) {
            console.log('✅ Success: /api/products/filters returns data.');
            console.log('Keys present:', Object.keys(filterRes.data.data).join(', '));
        } else {
            console.log('❌ Failure: /api/products/filters response structure incorrect.');
        }

        console.log('\n✨ Products API Verification Complete!');

    } catch (error) {
        console.error('❌ API Verification Failed:', error.message);
    }
}

verifyProductsApi();
