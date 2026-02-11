import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testOnboarding = async () => {
    console.log('--- Starting Flow 5: Manufacturer Onboarding & Verification ---');

    try {
        const suiteId = Math.floor(Math.random() * 1000000);

        // 1. Register Manufacturer
        console.log('\n[5.1] Registering Manufacturer...');
        const manuData = {
            email: `onboard_${suiteId}@test.com`,
            phone: `${Math.floor(7000000000 + Math.random() * 3000000000)}`,
            password: 'Password123!',
            role: 'MANUFACTURER',
            companyName: 'Onboarding Test LTD',
            registrationNo: `REG_${suiteId}`,
            factoryAddress: '123 Factory Road',
            gstNumber: `GST_${suiteId}`,
            bankDetails: { accountNo: '555666' }
        };
        const manuRes = await axios.post(`${API_URL}/auth/register`, manuData);
        const manuToken = manuRes.data.data.token;
        const manuUser = manuRes.data.data.user;
        console.log(`✅ Registered (ID: ${manuUser.id}, Status: ${manuUser.status})`);

        // 2. Upload KYC Document
        console.log('\n[5.2] Uploading KYC Document...');
        const uploadRes = await axios.post(`${API_URL}/verification/upload`, {
            type: 'GST',
            number: `GST_${suiteId}`,
            url: 'http://example.com/gst_doc.pdf'
        }, { headers: { Authorization: `Bearer ${manuToken}` } });

        const kycId = uploadRes.data.data._id;
        console.log(`✅ Uploaded (KYC Record ID: ${kycId})`);

        // Check if User status updated to UNDER_VERIFICATION
        const profileRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${manuToken}` }
        });
        console.log(`   User Status: ${profileRes.data.data.status}`);

        // 3. Setup Admin for Verification
        console.log('\n[5.3] Setting up Admin for verification...');
        const adminData = {
            email: `admin_onboard_${suiteId}@test.com`,
            phone: `${Math.floor(7000000000 + Math.random() * 3000000000)}`,
            password: 'Password123!',
            role: 'CUSTOMER', // Start as customer
            name: 'Verification Admin'
        };
        const adminReg = await axios.post(`${API_URL}/auth/register`, adminData);
        const adminId = adminReg.data.data.user.id;
        const adminToken = adminReg.data.data.token;

        // Upgrade to ADMIN via mongodb hole
        const patchRes = await axios.patch(`${API_URL}/mongodb/User/${adminId}/status`, { role: 'ADMIN', status: 'ACTIVE' });
        console.log(`   Patch Success: ${patchRes.data.success}, New Role in Response: ${patchRes.data.data.role}`);

        // Re-login to get a token with the ADMIN role
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: adminData.email,
            password: adminData.password
        });
        const finalAdminToken = adminLogin.data.data.token;
        console.log(`✅ Admin Ready and Logged In (ID: ${adminId}, Role in Login: ${adminLogin.data.data.user.role})`);

        // 4. Verify Document
        console.log('\n[5.4] Verifying Document as Admin...');
        const verifyRes = await axios.put(`${API_URL}/verification/${kycId}/verify`, {
            status: 'APPROVED'
        }, { headers: { Authorization: `Bearer ${finalAdminToken}` } });

        console.log(`✅ Verification Success: ${verifyRes.data.success}`);

        // 5. Final Check
        console.log('\n[5.5] Final Status Check...');
        const finalManuProfile = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${manuToken}` }
        });
        console.log(`✅ Manufacturer Status: ${finalManuProfile.data.data.status}`);

        if (finalManuProfile.data.data.status === 'ACTIVE') {
            console.log('🎉 Flow 5: Onboarding & Verification SUCCESS!');
        } else {
            console.log('❌ Flow 5: Onboarding & Verification FAILED (Status not ACTIVE)');
        }

        console.log('\n--- Flow 5 API Tests Completed! ---');

    } catch (error) {
        console.error('❌ Flow 5 Test Failed:', error.response?.data || error.message);
        if (error.response?.data?.details) console.log('Details:', error.response.data.details);
    }
};

testOnboarding();
