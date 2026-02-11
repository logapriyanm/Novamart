import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testDealerOnboarding = async () => {
    console.log('--- Starting Flow 6: Dealer / Seller Onboarding & Verification ---');

    try {
        const suiteId = Math.floor(Math.random() * 1000000);

        // 1. Register Dealer
        console.log('\n[6.1] Registering Dealer...');
        const dealerData = {
            email: `dealer_onboard_${suiteId}@test.com`,
            phone: `${Math.floor(6000000000 + Math.random() * 3000000000)}`,
            password: 'Password123!',
            role: 'DEALER',
            businessName: 'Dealer Test Enterprise',
            gstNumber: `GST_D_${suiteId}`,
            businessAddress: '456 Dealer Street, City',
            bankDetails: { accountNo: '999000', bankName: 'Test Bank' }
        };
        const dealerRes = await axios.post(`${API_URL}/auth/register`, dealerData);
        const dealerToken = dealerRes.data.data.token;
        const dealerUser = dealerRes.data.data.user;
        console.log(`✅ Registered (ID: ${dealerUser.id}, Status: ${dealerUser.status})`);

        // 2. Upload KYC Document
        console.log('\n[6.2] Uploading KYC Document...');
        const uploadRes = await axios.post(`${API_URL}/verification/upload`, {
            type: 'GST',
            number: `GST_D_${suiteId}`,
            url: 'http://example.com/dealer_gst.pdf'
        }, { headers: { Authorization: `Bearer ${dealerToken}` } });

        const kycId = uploadRes.data.data._id;
        console.log(`✅ Uploaded (KYC Record ID: ${kycId})`);

        // Check user status
        const profRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${dealerToken}` }
        });
        console.log(`   User Status: ${profRes.data.data.status}`);

        // 3. Setup Admin for Verification
        console.log('\n[6.3] Setting up Admin for verification...');
        const adminEmail = `admin_dealer_${suiteId}@test.com`;
        const adminPass = 'Password123!';
        const adminReg = await axios.post(`${API_URL}/auth/register`, {
            email: adminEmail,
            phone: `${Math.floor(7000000000 + Math.random() * 2000000000)}`,
            password: adminPass,
            role: 'CUSTOMER',
            name: 'Dealer Verifier Admin'
        });
        const adminId = adminReg.data.data.user.id;

        // Elevate to ADMIN
        await axios.patch(`${API_URL}/mongodb/User/${adminId}/status`, { role: 'ADMIN', status: 'ACTIVE' });

        // Login to get ADMIN token
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: adminEmail,
            password: adminPass
        });
        const adminToken = adminLogin.data.data.token;
        console.log(`✅ Admin Ready (ID: ${adminId}, Role: ${adminLogin.data.data.user.role})`);

        // 4. Verify Document
        console.log('\n[6.4] Verifying Document as Admin...');
        const verifyRes = await axios.put(`${API_URL}/verification/${kycId}/verify`, {
            status: 'APPROVED'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });

        console.log(`✅ Verification Success: ${verifyRes.data.success}`);

        // 5. Final Check
        console.log('\n[6.5] Final Status Check...');
        const finalDealerProf = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${dealerToken}` }
        });
        console.log(`✅ Dealer Status: ${finalDealerProf.data.data.status}`);

        if (finalDealerProf.data.data.status === 'ACTIVE') {
            console.log('🎉 Flow 6: Dealer Onboarding & Verification SUCCESS!');
        } else {
            console.log('❌ Flow 6: Dealer Onboarding & Verification FAILED');
        }

        console.log('\n--- Flow 6 API Tests Completed! ---');

    } catch (error) {
        console.error('❌ Flow 6 Test Failed:', error.response?.data || error.message);
    }
};

testDealerOnboarding();
