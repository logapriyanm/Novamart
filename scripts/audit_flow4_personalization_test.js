import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testPersonalization = async () => {
    console.log('--- Starting Flow 4: Logged-In Home & Personalization ---');

    try {
        const suiteId = Math.floor(Math.random() * 1000000);

        // 1. Setup Manufacturer & Products
        console.log('\n[4.1] Setting up Manufacturer and Products...');
        const manuData = {
            email: `manu_p_${suiteId}@test.com`,
            phone: `${Math.floor(7000000000 + Math.random() * 3000000000)}`,
            password: 'Password123!',
            role: 'MANUFACTURER',
            companyName: 'Personalization Test Inc',
            registrationNo: `REG_P_${suiteId}`,
            factoryAddress: '123 Tech Lane',
            gstNumber: `GST_P_${suiteId}`,
            bankDetails: { accountNo: '111222' }
        };
        const manuRes = await axios.post(`${API_URL}/auth/register`, manuData);
        const manuToken = manuRes.data.data.token;
        const manuUser = manuRes.data.data.user;

        // The manufacturer profile might not be in the response. Get it.
        const manuProfileRes = await axios.get(`${API_URL}/mongodb/Manufacturer`, {
            params: { query: JSON.stringify({ userId: manuUser.id }) }
        });
        const manufacturerId = manuProfileRes.data.data[0]._id;

        // Activate Manufacturer via mongodb hole (skip verification flow for now)
        await axios.patch(`${API_URL}/mongodb/User/${manuUser.id}/status`, { status: 'ACTIVE' });
        await axios.patch(`${API_URL}/mongodb/Manufacturer/${manufacturerId}/status`, { isVerified: true });

        // Create 2 products: one in Electronics, one in Home
        const p1 = await axios.post(`${API_URL}/products`, {
            name: 'Smartphone Pro',
            description: 'Latest flagship smartphone',
            basePrice: 50000,
            category: 'Electronics',
            moq: 10
        }, { headers: { Authorization: `Bearer ${manuToken}` } });

        const p2 = await axios.post(`${API_URL}/products`, {
            name: 'Ergonomic Chair',
            description: 'High quality office chair',
            basePrice: 15000,
            category: 'Home',
            moq: 5
        }, { headers: { Authorization: `Bearer ${manuToken}` } });

        // Approve products via mongodb hole
        await axios.patch(`${API_URL}/mongodb/Product/${p1.data.data._id}/status`, { status: 'APPROVED', isApproved: true });
        await axios.patch(`${API_URL}/mongodb/Product/${p2.data.data._id}/status`, { status: 'APPROVED', isApproved: true });

        console.log('✅ Manufacturer and Products Ready');

        // 2. Setup Customer & Interacted Behavior
        console.log('\n[4.2] Setting up Customer and tracking behavior...');
        const custData = {
            email: `cust_p_${suiteId}@test.com`,
            phone: `${Math.floor(7000000000 + Math.random() * 3000000000)}`,
            password: 'Password123!',
            role: 'CUSTOMER',
            name: 'Personalization Tester'
        };
        const custRes = await axios.post(`${API_URL}/auth/register`, custData);
        const custToken = custRes.data.data.token;
        const custId = custRes.data.data.user.id;

        // Track a VIEW event for Electronics
        await axios.post(`${API_URL}/home/track`, {
            type: 'PAGE_VIEW',
            targetId: p1.data.data.id,
            metadata: { category: 'Electronics', productId: p1.data.data.id }
        }, { headers: { Authorization: `Bearer ${custToken}` } });

        console.log('✅ Customer behavior tracked (Viewed Electronics)');

        // 3. Verify Personalization
        console.log('\n[4.3] Testing GET /home/personalized...');
        const personalizedRes = await axios.get(`${API_URL}/home/personalized`, {
            headers: { Authorization: `Bearer ${custToken}` }
        });

        console.log('✅ Success:', personalizedRes.data.success);
        const data = personalizedRes.data.data;

        console.log('   Recommended count:', data.recommended?.length || 0);
        if (data.recommended?.length > 0) {
            console.log('   First Recommended Category:', data.recommended[0].category);
        }

        console.log('   Continue Viewing Count:', data.continueViewing?.length || 0);
        if (data.continueViewing?.length > 0) {
            console.log('   First Continue Viewing Item:', data.continueViewing[0].name);
        }

        console.log('\n--- Flow 4 API Tests Completed! ---');

    } catch (error) {
        console.error('❌ Flow 4 Test Failed:', error.response?.data || error.message);
        if (error.response?.data?.details) console.log('Details:', error.response.data.details);
    }
};

testPersonalization();
