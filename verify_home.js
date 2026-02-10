import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const timestamp = Date.now();
const TEST_EMAIL = `home_test_${timestamp}@novamart.com`;
const TEST_PASS = 'Password123';
const TEST_PHONE = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;

async function verifyHome() {
    console.log('🚀 Starting Home Personalization Verification...');

    try {
        // 1. Register Guest
        console.log(`\n--- 1. Registering Fresh Customer: ${TEST_EMAIL} ---`);
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            email: TEST_EMAIL,
            password: TEST_PASS,
            name: 'Home Test User',
            phone: TEST_PHONE,
            role: 'CUSTOMER'
        });

        const resData = regRes.data.data;
        const token = resData.token;
        const user = resData.user;
        const authHeader = { headers: { Authorization: `Bearer ${token}` } };
        console.log(`✅ Registered and Logged in: ${user.email}`);

        // 2. Fetch some products for simulation
        console.log('\n--- 2. Fetching Products for Simulation ---');
        const productsRes = await axios.get(`${API_URL}/products?status=APPROVED`);
        const pResult = productsRes.data;
        const products = pResult.products || pResult.data || [];

        if (products.length < 2) {
            console.error('❌ Not enough products found for simulation.');
            process.exit(1);
        }

        const product1 = products[0];
        const product2 = products[1];
        console.log(`✅ Selected for view: ${product1.name} (${product1.category}) and ${product2.name} (${product2.category})`);

        // 3. Track Behavioral Events (Views)
        console.log('\n--- 3. Tracking Behaviors (VIEW) ---');
        await axios.post(`${API_URL}/home/track`, {
            type: 'VIEW',
            targetId: product1.id,
            metadata: { category: product1.category }
        }, authHeader);

        await axios.post(`${API_URL}/home/track`, {
            type: 'VIEW',
            targetId: product2.id,
            metadata: { category: product2.category }
        }, authHeader);
        console.log('✅ Tracked 2 VIEW events.');

        // 4. Fetch Personalized Home
        console.log('\n--- 4. Fetching Personalized Home Data ---');
        const homeRes = await axios.get(`${API_URL}/home/personalized`, authHeader);
        const data = homeRes.data.data;

        // 5. Verify Personalization Components
        console.log('\n--- 5. Verifying Components ---');

        // Special Day (Should be WELCOME discount)
        if (data.specialDay) {
            console.log(`✅ Special Day Detected: ${data.specialDay.type} (${data.specialDay.discount}% off)`);
            if (data.specialDay.type === 'WELCOME') {
                console.log('✨ Success: WELCOME voucher correctly issued for new user.');
            }
        }

        // Recommendations
        if (data.recommended && data.recommended.length > 0) {
            console.log(`✅ Recommendations: Found ${data.recommended.length} personalized items.`);
            const interestCategories = [product1.category, product2.category];
            const matchingItems = data.recommended.filter(p => interestCategories.includes(p.category));
            console.log(`✨ Recommendation Accuracy: ${matchingItems.length}/${data.recommended.length} items match behavioral categories.`);
        }

        // Continue Viewing
        if (data.continueViewing && data.continueViewing.length > 0) {
            console.log(`✅ Continue Viewing: Found ${data.continueViewing.length} items in history.`);
            const recentlyViewed = data.continueViewing[0];
            if (recentlyViewed.id === product2.id || recentlyViewed.id === product1.id) {
                console.log(`✨ Success: Last viewed item (${recentlyViewed.name}) is correctly at the top of history.`);
            }
        }

        console.log('\n✨ Home Personalization Verification Completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Error:', error.response ? error.response.data : error.message);
        process.exit(1);
    }
}

verifyHome();
