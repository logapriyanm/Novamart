import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyPublicAPI() {
    console.log('🚀 Starting Public API Verification (Guest)...');

    try {
        // 1. Home Health / Basic
        console.log('\n--- 1. Testing API Health ---');
        const health = await axios.get(`${API_URL}/health`);
        console.log('✅ Health:', health.data.status);

        // 2. Public Products
        console.log('\n--- 2. Testing Public Products List ---');
        const productsRes = await axios.get(`${API_URL}/products?status=APPROVED`);
        const products = productsRes.data.products;
        if (Array.isArray(products)) {
            console.log(`✅ Success: Found ${products.length} approved products.`);
        } else {
            console.error('❌ Failure: Products data is not an array. Response structure:', Object.keys(productsRes.data));
            process.exit(1);
        }

        // 3. Search Guest
        console.log('\n--- 3. Testing Public Search (AC) ---');
        const searchRes = await axios.get(`${API_URL}/products?q=AC`);
        const searchResults = searchRes.data.products;
        console.log(`✅ Success: Search 'AC' returned ${searchResults.length} results.`);

        // 4. Categories
        console.log('\n--- 4. Testing Public Categories ---');
        const categoriesRes = await axios.get(`${API_URL}/products/categories`);
        if (Array.isArray(categoriesRes.data.data)) {
            console.log(`✅ Success: Found ${categoriesRes.data.data.length} categories.`);
        } else {
            console.error('❌ Failure: Categories data is not an array.');
            process.exit(1);
        }

        // 5. Protected Route Check (Guest)
        console.log('\n--- 5. Verifying Protected Route (Profile) is Blocked ---');
        try {
            await axios.get(`${API_URL}/manufacturer/profile`);
            console.error('❌ Failure: Guest accessed protected route!');
            process.exit(1);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                console.log('✅ Success: Access Blocked (401 Unauthorized) as expected.');
            } else {
                console.error('❌ Failure: Expected 401, but got:', error.response ? error.response.status : error.message);
                process.exit(1);
            }
        }

        console.log('\n✨ Public / Guest API Flows Verified!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Error:', error.message);
        process.exit(1);
    }
}

verifyPublicAPI();
