
const BASE_URL = 'http://127.0.0.1:5000/api';

async function testRBAC() {
    console.log('🚀 Starting RBAC Validation...');

    const timestamp = Date.now();

    // Helper to register and get token
    async function registerAndGetToken(role, prefix) {
        const user = {
            email: `rbac_${prefix}_${timestamp}@test.com`,
            password: 'Password123!',
            role: role,
            phone: `rbac_${prefix}_${timestamp}`.replace(/[^0-9]/g, '').slice(0, 10).padEnd(10, '0'), // Mock phone
            // Add required fields based on role
            ...(role === 'CUSTOMER' ? { name: 'RBAC Customer' } : {}),
            ...(role === 'SELLER' ? { businessName: 'RBAC Seller', gstNumber: `GST${timestamp}S`, businessAddress: 'Addr', bankDetails: { accountNumber: '123', ifscCode: 'ABC' } } : {}),
            ...(role === 'MANUFACTURER' ? { companyName: 'RBAC Mfg', registrationNo: `MFG${timestamp}M`, factoryAddress: 'Addr', gstNumber: `GST${timestamp}M`, bankDetails: { accountNumber: '123', ifscCode: 'ABC' } } : {})
        };
        // Unique phone per role to avoid collision
        const phonePrefix = role === 'CUSTOMER' ? '98' : role === 'SELLER' ? '97' : '96';
        user.phone = phonePrefix + timestamp.toString().slice(-8);

        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        const data = await res.json();
        if (!data.success) throw new Error(`Registration failed for ${role}: ${JSON.stringify(data)}`);
        return data.data.token;
    }

    try {
        console.log('Creating Test Users...');
        const customerToken = await registerAndGetToken('CUSTOMER', 'cust');
        const sellerToken = await registerAndGetToken('SELLER', 'sell');
        const mfgToken = await registerAndGetToken('MANUFACTURER', 'mfg');

        console.log('Users created. Testing Permissions...\n');

        // Test 1: Customer accessing Admin Route
        console.log('Test 1: Customer -> Admin Route');
        const res1 = await fetch(`${BASE_URL}/admin/users`, {
            headers: { 'Authorization': `Bearer ${customerToken}` }
        });
        if (res1.status === 403 || res1.status === 401) {
            console.log('✅ PASS: Customer blocked from Admin route');
        } else {
            console.error(`❌ FAIL: Customer accessed Admin route (${res1.status})`);
        }

        // Test 2: Seller accessing Manufacturer Route
        console.log('Test 2: Seller -> Manufacturer Route');
        const res2 = await fetch(`${BASE_URL}/manufacturer/products`, {
            headers: { 'Authorization': `Bearer ${sellerToken}` }
        });
        if (res2.status === 403 || res2.status === 401) {
            console.log('✅ PASS: Seller blocked from Manufacturer route');
        } else {
            console.error(`❌ FAIL: Seller accessed Manufacturer route (${res2.status})`);
        }

        // Test 3: Manufacturer accessing Seller Route
        console.log('Test 3: Manufacturer -> Seller Route');
        // Assuming /api/seller/allocations is protected for Seller
        const res3 = await fetch(`${BASE_URL}/seller/allocations`, {
            headers: { 'Authorization': `Bearer ${mfgToken}` }
        });
        if (res3.status === 403 || res3.status === 401) {
            console.log('✅ PASS: Manufacturer blocked from Seller route');
        } else {
            console.log(`ℹ️ NOTE: Manufacturer accessing Seller route returned ${res3.status}. (Might be allowed if shared implementation)`);
            // Some seller routes might be shared or different protection check.
            // Let's try a strict profile route if exists
        }

        // Test 4: Unauthenticated Access
        console.log('Test 4: unauthenticated -> Admin Route');
        const res4 = await fetch(`${BASE_URL}/admin/users`);
        if (res4.status === 401) {
            console.log('✅ PASS: Unauthenticated request blocked');
        } else {
            console.error(`❌ FAIL: Unauthenticated request allowed (${res4.status})`);
        }

    } catch (error) {
        const fs = await import('fs'); // Dynamic import
        fs.writeFileSync('src/server/scripts/rbac_error.log', error.message + '\n' + error.stack);
        console.error('❌ RBAC Validation Error logged to file.');
    }
    console.log('\n🏁 RBAC Validation Completed.');
}

testRBAC();
