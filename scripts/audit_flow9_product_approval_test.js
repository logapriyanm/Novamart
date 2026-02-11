import axios from 'axios';

const API_URL = 'http://localhost:5002/api';

const testProductApproval = async () => {
    console.log('--- Starting Flow 9: Product Creation & Approval Flow ---');

    try {
        console.log(`\n[9.0] Connectivity Check to ${API_URL}/auth/test...`);
        try {
            const health = await axios.get(`http://localhost:5002/`);
            console.log('   - Root Health Check:', health.data.status);
        } catch (e) {
            console.log('   - Root Health Check FAILED:', e.message);
        }

        const suiteId = Math.floor(Math.random() * 1000000);

        // 1. Setup Manufacturer
        console.log(`\n[9.1] Registering Manufacturer at ${API_URL}/auth/register...`);
        const manuData = {
            email: `mfg_f9_${suiteId}@test.com`,
            phone: `${Math.floor(7000000000 + Math.random() * 1000000000)}`,
            password: 'Password123!',
            role: 'MANUFACTURER',
            companyName: 'MFG Approval Flow LTD',
            registrationNo: `REG9_${suiteId}`,
            factoryAddress: '999 Factory Road',
            gstNumber: `GST9_${suiteId}`,
            bankDetails: { accountNo: '999000' }
        };
        await axios.post(`${API_URL}/auth/register`, manuData);
        const manuLogin = await axios.post(`${API_URL}/auth/login`, {
            email: manuData.email,
            password: manuData.password
        });
        const manuToken = manuLogin.data.data.token;
        const manuUserId = manuLogin.data.data.user.id;

        // Activate Manufacturer
        await axios.patch(`${API_URL}/mongodb/User/${manuUserId}/status`, { status: 'ACTIVE' });
        console.log('✅ Manufacturer Registered and Activated.');

        // 2. Setup Admin
        console.log('\n[9.2] Setting up Admin...');
        const adminData = {
            email: `admin_f9_${suiteId}@test.com`,
            phone: `${Math.floor(8000000000 + Math.random() * 1000000000)}`,
            password: 'AdminPassword123!',
            role: 'CUSTOMER',
            name: 'Flow 9 Admin'
        };
        const adminRegRes = await axios.post(`${API_URL}/auth/register`, adminData);
        const adminUserId = adminRegRes.data.data.user.id;

        // Elevate to ADMIN
        await axios.patch(`${API_URL}/mongodb/User/${adminUserId}`, { role: 'ADMIN', status: 'ACTIVE' });

        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: adminData.email,
            password: adminData.password
        });
        const adminToken = adminLogin.data.data.token;
        console.log('✅ Admin Ready.');

        // 3. Manufacturer creates Product 1 (for Approval)
        console.log('\n[9.3] Manufacturer creating Product 1...');
        const p1Data = {
            name: `Approved Widget ${suiteId}`,
            description: 'A product destined for approval.',
            basePrice: 500,
            moq: 50,
            category: 'Testing Items',
            images: ['http://example.com/p1.jpg']
        };
        const p1Res = await axios.post(`${API_URL}/products`, p1Data, {
            headers: { Authorization: `Bearer ${manuToken}` }
        });
        const p1Id = p1Res.data.data._id;
        console.log(`✅ Product 1 Created (ID: ${p1Id}, Initial Status: ${p1Res.data.data.status})`);

        // 4. Admin Approves Product 1
        console.log('\n[9.4] Admin approving Product 1...');
        const approveRes = await axios.patch(`${API_URL}/products/${p1Id}/status`, {
            status: 'APPROVED'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log(`✅ Product 1 Status Updated: ${approveRes.data.data.status}`);

        // 5. Manufacturer creates Product 2 (for Rejection)
        console.log('\n[9.5] Manufacturer creating Product 2...');
        const p2Data = {
            name: `Rejected Widget ${suiteId}`,
            description: 'A product destined for rejection.',
            basePrice: 10,
            moq: 1,
            category: 'Testing Items',
            images: ['http://example.com/p2.jpg']
        };
        const p2Res = await axios.post(`${API_URL}/products`, p2Data, {
            headers: { Authorization: `Bearer ${manuToken}` }
        });
        const p2Id = p2Res.data.data._id;
        console.log(`✅ Product 2 Created (ID: ${p2Id}, Initial Status: ${p2Res.data.data.status})`);

        // 6. Admin Rejects Product 2
        console.log('\n[9.6] Admin rejecting Product 2...');
        const rejectRes = await axios.patch(`${API_URL}/products/${p2Id}/status`, {
            status: 'REJECTED',
            rejectionReason: 'Insufficient image quality and low price point.'
        }, { headers: { Authorization: `Bearer ${adminToken}` } });
        console.log(`✅ Product 2 Status Updated: ${rejectRes.data.data.status}`);

        // 7. Final Verification
        console.log('\n[9.7] Verify Final States...');
        const finalP1 = await axios.get(`${API_URL}/products/${p1Id}`);
        const finalP2 = await axios.get(`${API_URL}/products/${p2Id}`, {
            headers: { Authorization: `Bearer ${manuToken}` } // Rejection might hide from public
        });

        const p1Success = finalP1.data.data.status === 'APPROVED' && finalP1.data.data.isApproved === true;
        const p2Success = finalP2.data.data.status === 'REJECTED' && finalP2.data.data.rejectionReason.includes('Insufficient');

        if (p1Success && p2Success) {
            console.log('🎉 Flow 9: Product Creation & Approval SUCCESS!');
        } else {
            console.log('❌ Flow 9: Product Creation & Approval FAILED');
            if (!p1Success) console.log(`   Product 1 mismatch: ${finalP1.data.data.status} (isApproved: ${finalP1.data.data.isApproved})`);
            if (!p2Success) console.log(`   Product 2 mismatch: ${finalP2.data.data.status} (Reason: ${finalP2.data.data.rejectionReason})`);
        }

        console.log('\n--- Flow 9 API Tests Completed! ---');

    } catch (error) {
        if (error.response) {
            console.error('❌ Flow 9 Test Failed (API Error):', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('❌ Flow 9 Test Failed (Network/Other):', error.message);
        }
    }
};

testProductApproval();
