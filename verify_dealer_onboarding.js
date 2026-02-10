import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const timestamp = Date.now();
const DEALER_EMAIL = `dealer_test_${timestamp}@novamart.com`;
const DEALER_PASS = 'Password123';
const DEALER_PHONE = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;
const DEALER_GST = `${Math.floor(Math.random() * 90 + 10)}BBBBB${Math.floor(Math.random() * 9000 + 1000)}B1Z${Math.floor(Math.random() * 9)}`;

async function verifyDealerOnboarding() {
    console.log('🚀 Starting Dealer Onboarding Verification...');

    try {
        // 1. Register Dealer
        console.log(`\n--- 1. Registering Dealer: ${DEALER_EMAIL} ---`);
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            email: DEALER_EMAIL,
            password: DEALER_PASS,
            name: 'Nova Test Dealer',
            phone: DEALER_PHONE,
            role: 'DEALER',
            businessName: 'Nova Retail Hub',
            gstNumber: DEALER_GST,
            businessAddress: '456 Retail Blvd, Hub City',
            bankDetails: { account: '456' }
        });

        const dealerToken = regRes.data.data.token;
        const dealerAuthHeader = { headers: { Authorization: `Bearer ${dealerToken}` } };
        console.log(`✅ Registered: ${DEALER_EMAIL} (Status: PENDING)`);

        // 2. Verify Access (PENDING status is allowed for Dealers)
        console.log('\n--- 2. Testing Access for PENDING status ---');
        const profileRes = await axios.get(`${API_URL}/dealer/profile`, dealerAuthHeader);
        console.log(`✅ Success: PENDING Dealer accessed profile Dashboard (Status: ${profileRes.data.data.user?.status})`);

        // 3. Admin Approval
        console.log('\n--- 3. Admin Approval Flow ---');
        console.log('Logging in as Admin...');
        const adminLoginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'test_admin_super@novamart.com',
            password: 'AdminPassword123'
        });
        const adminToken = adminLoginRes.data.data.token;
        const adminAuthHeader = { headers: { Authorization: `Bearer ${adminToken}` } };

        // Get the Dealer Profile ID
        const dealerListRes = await axios.get(`${API_URL}/admin/dealers`, adminAuthHeader);
        const targetDealer = dealerListRes.data.data.find(d => d.user.email === DEALER_EMAIL);

        if (!targetDealer) {
            console.error('❌ Failure: Could not find registered dealer in admin list.');
            process.exit(1);
        }

        console.log(`Approving Dealer Profile: ${targetDealer.id}`);
        await axios.put(`${API_URL}/admin/dealers/${targetDealer.id}/verify`, { isVerified: true }, adminAuthHeader);
        console.log('✅ Admin verification completed.');

        // 4. Verify Active Status
        console.log('\n--- 4. Testing Access for ACTIVE status ---');
        const dealerLoginRes = await axios.post(`${API_URL}/auth/login`, {
            email: DEALER_EMAIL,
            password: DEALER_PASS
        });
        const activeDealerToken = dealerLoginRes.data.data.token;
        const activeDealerAuthHeader = { headers: { Authorization: `Bearer ${activeDealerToken}` } };

        const freshProfileRes = await axios.get(`${API_URL}/dealer/profile`, activeDealerAuthHeader);
        console.log(`✅ Success: Dealer status is now ${freshProfileRes.data.data.user?.status}`);

        // 5. Test Profile Update (Business Section)
        console.log('\n--- 5. Testing Profile Section Update ---');
        await axios.put(`${API_URL}/dealer/profile`, {
            section: 'business',
            data: {
                businessName: 'Nova Retail Hub (Updated)',
                ownerName: 'Test Owner',
                businessType: 'Retailer'
            }
        }, activeDealerAuthHeader);
        console.log('✅ Business section updated successfully.');

        // 6. Test Discovery Access
        console.log('\n--- 6. Testing Manufacturer Discovery ---');
        const mfrsRes = await axios.get(`${API_URL}/dealer/manufacturers`, activeDealerAuthHeader);
        if (Array.isArray(mfrsRes.data.data)) {
            console.log(`✅ Success: Dealer can browse ${mfrsRes.data.data.length} manufacturers in the marketplace.`);
        }

        console.log('\n✨ FLOW 6: Dealer Onboarding Verified Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ FATAL ERROR:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

verifyDealerOnboarding();
