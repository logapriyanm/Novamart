import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyFlow10() {
    console.log('🚀 Starting Robust B2B Home Personalization Verification (FLOW 10)...\n');

    const timestamp = Date.now();
    const testMfr = {
        email: `h_mfr_${timestamp}@example.com`,
        password: 'Password123',
        firstName: 'Home',
        lastName: 'Manufacturer',
        role: 'MANUFACTURER',
        companyName: 'Home Mfr Corp',
        phone: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        gstNumber: `22AA${Math.floor(1000 + Math.random() * 9000)}0000A1Z5`,
        factoryAddress: '123 Mfr St, Industry City'
    };

    const testDealer = {
        email: `h_dealer_${timestamp}@example.com`,
        password: 'Password123',
        firstName: 'Home',
        lastName: 'Dealer',
        role: 'DEALER',
        businessName: 'Home Dealer Ltd',
        phone: `${Math.floor(1000000000 + Math.random() * 9000000000)}`,
        gstNumber: `22BB${Math.floor(1000 + Math.random() * 9000)}0000B1Z5`,
        address: '456 Dealer Rd, Trade Hub'
    };

    try {
        // --- 1. Register & Verify Manufacturer ---
        console.log('--- 1. Testing Manufacturer Hub ---');
        await axios.post(`${API_URL}/auth/register`, testMfr);
        const mfrLogin = await axios.post(`${API_URL}/auth/login`, {
            email: testMfr.email,
            password: testMfr.password
        });
        const mfrToken = mfrLogin.data.token;

        const mfrHome = await axios.get(`${API_URL}/home/personalized`, {
            headers: { Authorization: `Bearer ${mfrToken}` }
        });

        if (mfrHome.data.success && mfrHome.data.data.b2bMetrics?.role === 'MANUFACTURER') {
            console.log('✅ Success: Manufacturer received Hub metrics.');
            console.log('Actions found:', mfrHome.data.data.b2bMetrics.actions.map(a => a.label).join(', '));
        } else {
            console.error('❌ Error: Manufacturer metrics invalid.');
            throw new Error('Manufacturer verification failed');
        }

        // --- 2. Register & Verify Dealer ---
        console.log('\n--- 2. Testing Dealer Hub ---');
        await axios.post(`${API_URL}/auth/register`, testDealer);
        const dealerLogin = await axios.post(`${API_URL}/auth/login`, {
            email: testDealer.email,
            password: testDealer.password
        });
        const dealerToken = dealerLogin.data.token;

        const dealerHome = await axios.get(`${API_URL}/home/personalized`, {
            headers: { Authorization: `Bearer ${dealerToken}` }
        });

        if (dealerHome.data.success && dealerHome.data.data.b2bMetrics?.role === 'DEALER') {
            console.log('✅ Success: Dealer received Hub metrics.');
            console.log('Actions found:', dealerHome.data.data.b2bMetrics.actions.map(a => a.label).join(', '));
        } else {
            console.error('❌ Error: Dealer metrics invalid.');
            throw new Error('Dealer verification failed');
        }

        console.log('\n✨ [COMPLETE] FLOW 10: B2B Home Personalization Hub Verified Successfully!');

    } catch (error) {
        console.error('❌ Verification Failed:', error.response?.data || error.message);
    }
}

verifyFlow10();
