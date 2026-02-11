import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testDealerRequest = async () => {
    console.log('--- Starting Flow 7: Dealer Request Access System ---');

    try {
        const suiteId = Math.floor(Math.random() * 1000000);

        // 1. Register and Verify Manufacturer
        console.log('\n[7.1] Setting up Manufacturer...');
        const manuData = {
            email: `mfg_f7_${suiteId}@test.com`,
            phone: `${Math.floor(7000000000 + Math.random() * 1000000000)}`,
            password: 'Password123!',
            role: 'MANUFACTURER',
            companyName: 'MFG Flow 7 LTD',
            registrationNo: `REG7_${suiteId}`,
            factoryAddress: '777 Factory Ave',
            gstNumber: `GST7_${suiteId}`,
            bankDetails: { accountNo: '777888' }
        };
        const manuRes = await axios.post(`${API_URL}/auth/register`, manuData);
        const manuId = manuRes.data.data.user.id;

        // Elevate and Activate Manufacturer
        await axios.patch(`${API_URL}/mongodb/User/${manuId}/status`, { status: 'ACTIVE' });

        // Get Manufacturer Profile ID
        const manuProfileRes = await axios.get(`${API_URL}/mongodb/Manufacturer`, {
            params: { query: JSON.stringify({ userId: manuId }) }
        });
        const mfgProfileId = manuProfileRes.data.data[0]._id;

        // Login Manufacturer
        const manuLogin = await axios.post(`${API_URL}/auth/login`, {
            email: manuData.email,
            password: manuData.password
        });
        const manuToken = manuLogin.data.data.token;
        console.log(`✅ Manufacturer Ready (ID: ${mfgProfileId}, Status: ${manuLogin.data.data.user.status})`);

        // 2. Register Dealer
        console.log('\n[7.2] Registering Dealer...');
        const dealerData = {
            email: `dealer_f7_${suiteId}@test.com`,
            phone: `${Math.floor(6000000000 + Math.random() * 1000000000)}`,
            password: 'Password123!',
            role: 'DEALER',
            businessName: 'Dealer Flow 7 Enterprise',
            gstNumber: `GST_D7_${suiteId}`,
            businessAddress: '777 Dealer Road',
            bankDetails: { accountNo: '111222' }
        };
        const dealerRes = await axios.post(`${API_URL}/auth/register`, dealerData);
        const dealerToken = dealerRes.data.data.token;
        const dealerUserId = dealerRes.data.data.user.id;

        // Get Dealer Profile ID
        const dealerProfileRes = await axios.get(`${API_URL}/mongodb/Dealer`, {
            params: { query: JSON.stringify({ userId: dealerUserId }) }
        });
        const dealerProfileId = dealerProfileRes.data.data[0]._id;
        console.log(`✅ Dealer Registered (User ID: ${dealerUserId}, Profile ID: ${dealerProfileId})`);

        // 3. Dealer Requests Access
        console.log('\n[7.3] Dealer requesting access to Manufacturer...');
        const requestRes = await axios.post(`${API_URL}/dealer/request-access`, {
            manufacturerId: mfgProfileId,
            message: 'We would like to sell your products in the East region.',
            expectedQuantity: 500,
            region: 'East'
        }, { headers: { Authorization: `Bearer ${dealerToken}` } });

        console.log(`✅ Request Sent. Status: ${requestRes.data.data.status}`);

        // 4. Manufacturer Approves Request
        console.log('\n[7.4] Manufacturer approving Dealer request...');
        // We need the dealer's profile ID for the handle call
        const approvePayload = {
            dealerId: dealerProfileId,
            status: 'APPROVED'
        };
        const handleRes = await axios.post(`${API_URL}/manufacturer/dealers/handle`, approvePayload, {
            headers: { Authorization: `Bearer ${manuToken}` }
        });
        console.log(`✅ Request Handled. Response Success: ${handleRes.data.success}`);

        // 5. Verify Results
        console.log('\n[7.5] Final Verifications...');

        // Re-check Dealer Status (should be ACTIVE now)
        const dealerFinalProfile = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${dealerToken}` }
        });
        console.log(`✅ Dealer Final Status: ${dealerFinalProfile.data.data.status}`);

        // Check if Dealer is in Manufacturer's network
        const networkRes = await axios.get(`${API_URL}/manufacturer/network`, {
            headers: { Authorization: `Bearer ${manuToken}` }
        });
        const isDealerInNetwork = networkRes.data.data.some(d => d._id === dealerProfileId || d.id === dealerProfileId);
        console.log(`✅ Dealer in Manufacturer Network: ${isDealerInNetwork}`);

        if (dealerFinalProfile.data.data.status === 'ACTIVE' && isDealerInNetwork) {
            console.log('🎉 Flow 7: Dealer Request Access SUCCESS!');
        } else {
            console.log('❌ Flow 7: Dealer Request Access FAILED');
            if (dealerFinalProfile.data.data.status !== 'ACTIVE') console.log(`   Expected status ACTIVE, got ${dealerFinalProfile.data.data.status}`);
            if (!isDealerInNetwork) console.log('   Dealer not found in manufacturer network');
        }

        console.log('\n--- Flow 7 API Tests Completed! ---');

    } catch (error) {
        console.error('❌ Flow 7 Test Failed:', error.response?.data || error.message);
    }
};

testDealerRequest();
