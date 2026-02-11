import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testPublicFlow = async () => {
    console.log('--- Starting Flow 3: Public / Visitor Pages ---');

    try {
        // 1. Guest Home
        console.log('\n[3.1] Testing GET /home/guest...');
        const homeRes = await axios.get(`${API_URL}/home/guest`);
        console.log('✅ Success:', homeRes.data.success);
        console.log('   Stats:', homeRes.data.data?.stats ? 'Found' : 'Missing');
        console.log('   Featured Products:', homeRes.data.data?.featured?.length || 0);

        // 2. Product List
        console.log('\n[3.2] Testing GET /products...');
        const productsRes = await axios.get(`${API_URL}/products`);
        console.log('✅ Success:', productsRes.data.success);
        console.log('   Count:', productsRes.data.data?.products?.length || 0);

        // 3. Categories
        console.log('\n[3.3] Testing GET /products/categories...');
        const catRes = await axios.get(`${API_URL}/products/categories`);
        console.log('✅ Success:', catRes.data.success);
        console.log('   Categories:', catRes.data.data?.length || 0);

        // 4. Discovery Filters
        console.log('\n[3.4] Testing GET /products/filters...');
        const filterRes = await axios.get(`${API_URL}/products/filters`);
        console.log('✅ Success:', filterRes.data.success);
        console.log('   Attributes:', Object.keys(filterRes.data.data || {}).length);

        console.log('\n--- Flow 3 API Tests Completed! ---');
    } catch (error) {
        console.error('❌ Flow 3 Test Failed:', error.response?.data || error.message);
    }
};

testPublicFlow();
