import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const timestamp = Date.now();
const MFR_EMAIL = `mfr_v7_${timestamp}@novamart.com`;
const MFR_PASS = 'Password123';
const MFR_PHONE = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;
const MFR_GST = `${Math.floor(Math.random() * 90 + 10)}AAAAA${Math.floor(Math.random() * 9000 + 1000)}A1Z${Math.floor(Math.random() * 9)}`;
const MFR_REG = `REG_${timestamp}`;

async function verifyOnboarding() {
    console.log('🚀 Starting Manufacturer Onboarding Verification (v7)...');

    try {
        // 1. Register Manufacturer
        console.log(`\n--- 1. Registering Manufacturer: ${MFR_EMAIL} ---`);
        const regRes = await axios.post(`${API_URL}/auth/register`, {
            email: MFR_EMAIL,
            password: MFR_PASS,
            name: 'Nova Test Industries v7',
            phone: MFR_PHONE,
            role: 'MANUFACTURER',
            companyName: 'Nova Test Industries Ltd. v7',
            gstNumber: MFR_GST,
            registrationNo: MFR_REG, // Must be unique at DB level
            factoryAddress: 'Initial Address',
            bankDetails: { account: '123' }
        });

        const mfrToken = regRes.data.data.token;
        const mfrAuthHeader = { headers: { Authorization: `Bearer ${mfrToken}` } };
        console.log(`✅ Registered: ${MFR_EMAIL}`);

        // 2. Verify Gating (PENDING)
        console.log('\n--- 2. Testing Gating (PENDING) ---');
        try {
            await axios.get(`${API_URL}/manufacturer/profile`, mfrAuthHeader);
            console.error('❌ Failure: PENDING manufacturer accessed restricted route!');
            process.exit(1);
        } catch (error) {
            console.log(`✅ Success: Access blocked (HTTP ${error.response?.status})`);
        }

        // 3. Admin Approval
        console.log('\n--- 3. Admin Approval ---');
        const adminLoginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'test_admin_super@novamart.com',
            password: 'AdminPassword123'
        });
        const adminToken = adminLoginRes.data.data.token;
        const adminAuthHeader = { headers: { Authorization: `Bearer ${adminToken}` } };

        const mfrListRes = await axios.get(`${API_URL}/admin/manufacturers`, adminAuthHeader);
        const targetMfr = mfrListRes.data.data.find(m => m.user.email === MFR_EMAIL);

        if (!targetMfr) throw new Error('MFR_NOT_FOUND_IN_ADMIN_LIST');

        console.log(`Approving ${targetMfr.id}...`);
        await axios.put(`${API_URL}/admin/manufacturers/${targetMfr.id}/verify`, { isVerified: true }, adminAuthHeader);
        console.log('✅ Admin verification completed.');

        // 4. Verify Access (ACTIVE)
        console.log('\n--- 4. Testing Access (ACTIVE) ---');
        const mfrLoginRes = await axios.post(`${API_URL}/auth/login`, {
            email: MFR_EMAIL,
            password: MFR_PASS
        });
        const freshMfrToken = mfrLoginRes.data.data.token;
        const freshMfrAuthHeader = { headers: { Authorization: `Bearer ${freshMfrToken}` } };

        const profileRes = await axios.get(`${API_URL}/manufacturer/profile`, freshMfrAuthHeader);
        console.log(`✅ Success: Accessed profile (Status: ${profileRes.data.data.user?.status})`);

        // 5. Product Creation (Profile is complete by default due to strict schema)
        console.log('\n--- 5. Testing Product Creation ---');
        const productRes = await axios.post(`${API_URL}/products`, {
            name: 'Industrial Pump V7',
            description: 'Efficient industrial pump.',
            basePrice: 9000,
            moq: 1,
            category: 'machinery',
            images: ['https://example.com/pump.jpg']
        }, freshMfrAuthHeader);

        console.log(`✨ Success: Product created! ID: ${productRes.data.data.id}`);

        // 6. Test Profile Update
        console.log('\n--- 6. Testing Profile Section Update ---');
        await axios.put(`${API_URL}/manufacturer/profile`, {
            section: 'factory',
            data: {
                factoryAddress: 'Nova Phase 7 Mega Factory',
                capacity: '5000 units/mo'
            }
        }, freshMfrAuthHeader);
        console.log('✅ Profile section (factory) updated successfully.');

        console.log('\n✨ FLOW 5: Manufacturer Onboarding Verified Successfully!');
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

verifyOnboarding();
