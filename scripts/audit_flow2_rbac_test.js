import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testRBAC = async () => {
    console.log('--- Starting Flow 2: Role-Based Access Control (RBAC) ---');

    // We need tokens for different roles
    // 1. Customer
    // 2. Dealer (PENDING)
    // 3. Manufacturer (PENDING)
    // 4. Admin (if possible)

    const roles = ['CUSTOMER', 'DEALER', 'MANUFACTURER'];
    const tokens = {};
    const testUsers = {};

    try {
        // Register/Login to get tokens
        for (const role of roles) {
            const suiteId = Math.floor(Math.random() * 1000000);
            const email = `rbac_${role.toLowerCase()}_${suiteId}_${Date.now()}@test.com`;
            const phone = `${Math.floor(6000000000 + Math.random() * 4000000000)}`;
            const password = 'Password123!';

            console.log(`\n[PREP] Registering ${role}...`);
            const regData = { email, phone, password, role };
            if (role === 'CUSTOMER') {
                regData.name = 'Test Customer RBAC';
            } else if (role === 'DEALER') {
                regData.businessName = 'Test Dealer';
                regData.gstNumber = `GST${Date.now()}DR`;
                regData.businessAddress = '123 Dealer St';
                regData.bankDetails = { accountNo: '123' };
            } else if (role === 'MANUFACTURER') {
                regData.companyName = 'Test Manu';
                regData.registrationNo = `REG${Date.now()}MR`;
                regData.factoryAddress = '456 Manu Rd';
                regData.gstNumber = `GST${Date.now()}MR`;
                regData.bankDetails = { accountNo: '456' };
            }

            const res = await axios.post(`${API_URL}/auth/register`, regData);
            tokens[role] = res.data.data.token;
            testUsers[role] = res.data.data.user;
            console.log(`✅ Got token for ${role}`);
        }

        // --- TEST CASES ---

        // Test 1: Customer trying to access Admin Stats
        console.log('\n[2.1] Testing Customer -> Admin Routes (Unauthorized)...');
        try {
            await axios.get(`${API_URL}/admin/stats`, {
                headers: { Authorization: `Bearer ${tokens.CUSTOMER}` }
            });
            console.log('❌ FAIL: Customer accessed admin/stats');
        } catch (err) {
            console.log('✅ PASS: Customer blocked from admin/stats (Status:', err.response?.status, ')');
        }

        // Test 2: Dealer trying to access Manufacturer Network
        console.log('\n[2.2] Testing Dealer -> Manufacturer Routes (Unauthorized)...');
        try {
            await axios.get(`${API_URL}/manufacturer/network`, {
                headers: { Authorization: `Bearer ${tokens.DEALER}` }
            });
            console.log('❌ FAIL: Dealer accessed manufacturer/network');
        } catch (err) {
            console.log('✅ PASS: Dealer blocked from manufacturer/network (Status:', err.response?.status, ')');
        }

        // Test 3: Manufacturer trying to access Dealer Inventory
        console.log('\n[2.3] Testing Manufacturer -> Dealer Routes (Unauthorized)...');
        try {
            await axios.get(`${API_URL}/dealer/inventory`, {
                headers: { Authorization: `Bearer ${tokens.MANUFACTURER}` }
            });
            console.log('❌ FAIL: Manufacturer accessed dealer/inventory');
        } catch (err) {
            console.log('✅ PASS: Manufacturer blocked from dealer/inventory (Status:', err.response?.status, ')');
        }

        // Test 4: Pending Dealer trying to access ACTIVE only endpoint (if any)
        // Note: DealerRoutes allows PENDING for dashboard. 
        // Let's check an endpoint that requires ACTIVE.
        // Actually, DealerRoutes level has: router.use(authorize(['DEALER'], [], ['ACTIVE', 'UNDER_VERIFICATION', 'PENDING']));
        // So PENDING is allowed for most things.

        // Let's check any route that is STRICTLY ACTIVE.
        // manufacturerRoutes: router.use(authorize(['MANUFACTURER'], [], ['ACTIVE', 'UNDER_VERIFICATION']));
        // Our test manufacturer is PENDING by default.
        console.log('\n[2.4] Testing Pending Manufacturer -> Active Routes (Unauthorized)...');
        try {
            await axios.get(`${API_URL}/manufacturer/profile`, {
                headers: { Authorization: `Bearer ${tokens.MANUFACTURER}` }
            });
            console.log('❌ FAIL: Pending Manufacturer accessed restricted route');
        } catch (err) {
            console.log('✅ PASS: Pending Manufacturer blocked (Status:', err.response?.status, ')');
        }

        // Test 5: Positive Access (Manufacturer accessing their own profile)
        // Wait, Manufacturer is PENDING, so profile might be blocked if it requires ACTIVE.
        // Dealer is PENDING but allowed. Let's try Dealer.
        console.log('\n[2.5] Testing Positive Access (Dealer -> Dealer Profile)...');
        const dealerProfile = await axios.get(`${API_URL}/dealer/profile`, {
            headers: { Authorization: `Bearer ${tokens.DEALER}` }
        });
        console.log('✅ PASS: Dealer accessed own profile. ID:', dealerProfile.data.data.userId);

        // Test 6: Admin Sub-role RBAC (OPS_ADMIN -> SUPER_ADMIN Route)
        console.log('\n[2.6] Testing Admin Sub-role RBAC...');
        // First, create an OPS_ADMIN by upgrading our customer
        console.log('   Upgrading Customer to OPS_ADMIN (using mongodb hole)...');
        await axios.patch(`${API_URL}/mongodb/User/${testUsers.CUSTOMER.id}/status`,
            { role: 'ADMIN', adminRole: 'OPS_ADMIN', status: 'ACTIVE' },
            { headers: { 'x-actor-id': 'AUDIT_TEST' } }
        );

        // Login again to get fresh token with new role
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: testUsers.CUSTOMER.email,
            password: 'Password123!'
        });
        const opsAdminToken = adminLogin.data.data.token;
        console.log('   Token acquired for OPS_ADMIN');

        // Try to access SUPER_ADMIN only route
        try {
            await axios.get(`${API_URL}/admin/audit-logs`, {
                headers: { Authorization: `Bearer ${opsAdminToken}` }
            });
            console.log('❌ FAIL: OPS_ADMIN accessed SUPER_ADMIN route');
        } catch (err) {
            console.log('✅ PASS: OPS_ADMIN blocked from SUPER_ADMIN route (Status:', err.response?.status, ')');
        }

        console.log('\n--- Flow 2 API Tests Completed! ---');

    } catch (error) {
        console.error('❌ RBAC Test Failed during Prep:', error.response?.data || error.message);
    }
};

testRBAC();
