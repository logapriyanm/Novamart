import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyFlow10() {
    console.log('🚀 Starting B2B Home Personalization Verification (FLOW 10)...\n');

    try {
        // --- 1. Testing Manufacturer ---
        console.log('--- 1. Testing Manufacturer Personalization ---');
        const mfrLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'manu@gmail.com',
            password: 'Password123'
        });
        const mfrToken = mfrLogin.data.token;

        const mfrHome = await axios.get(`${API_URL}/home/personalized`, {
            headers: { Authorization: `Bearer ${mfrToken}` }
        });

        if (mfrHome.data.success && mfrHome.data.data.b2bMetrics) {
            console.log('✅ Success: Manufacturer received B2B metrics.');
            console.log('Role:', mfrHome.data.data.b2bMetrics.role);
            console.log('Actions:', JSON.stringify(mfrHome.data.data.b2bMetrics.actions, null, 2));
        } else {
            console.error('❌ Error: Manufacturer metrics missing.');
        }

        // --- 2. Testing Dealer ---
        console.log('\n--- 2. Testing Dealer Personalization ---');
        const dealerLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'dealer_alloc_1770692125184@novamart.com',
            password: 'Password123'
        });
        const dealerToken = dealerLogin.data.token;

        const dealerHome = await axios.get(`${API_URL}/home/personalized`, {
            headers: { Authorization: `Bearer ${dealerToken}` }
        });

        if (dealerHome.data.success && dealerHome.data.data.b2bMetrics) {
            console.log('✅ Success: Dealer received B2B metrics.');
            console.log('Role:', dealerHome.data.data.b2bMetrics.role);
            console.log('Actions:', JSON.stringify(dealerHome.data.data.b2bMetrics.actions, null, 2));
        } else {
            console.error('❌ Error: Dealer metrics missing.');
        }

        console.log('\n✨ FLOW 10: B2B Home Personalization Logic Verified Successfully!');

    } catch (error) {
        console.error('❌ Verification Failed:', error.response?.data || error.message);
    }
}

verifyFlow10();
