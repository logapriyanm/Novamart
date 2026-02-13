
const BASE_URL = 'http://127.0.0.1:5000/api';

async function testCustomerFlow() {
    console.log('🚀 Starting Customer Flow Validation...');
    const timestamp = Date.now();

    async function registerUser(role) { // Generic helper
        const user = {
            email: `flow_${role.toLowerCase().slice(0, 4)}_${timestamp}@test.com`,
            password: 'Password123!',
            role: role,
            phone: (role === 'CUSTOMER' ? '93' : '92') + timestamp.toString().slice(-8),
            ...(role === 'MANUFACTURER' ? { companyName: 'Flow Mfg', registrationNo: `MFG${timestamp}F`, factoryAddress: 'Addr', gstNumber: `GST${timestamp}F`, bankDetails: { accountNumber: '123', ifscCode: 'ABC' } } : {}),
            ...(role === 'CUSTOMER' ? { name: 'Flow Customer' } : {})
        };
        const res = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        });
        const data = await res.json();
        if (!data.success) throw new Error(`${role} Reg Failed: ` + JSON.stringify(data));
        return data.data.token;
    }

    try {
        // 0. Seed Product
        const mfgToken = await registerUser('MANUFACTURER');
        console.log('✅ Manufacturer Registered');

        // FORCE ACTIVATE MANUFACTURER via Mongoose (Simulate Admin Approval)
        // Accessing DB directly since we are in dev/test environment
        const mongoose = await import('mongoose');
        const { User } = await import('../models/index.js'); // Adjust path to models
        // We need to decode token to get ID or search by email.
        // Let's search by email.
        const mfgEmail = `flow_manu_${timestamp}@test.com`; // Matches registerUser logic? 
        // Wait, registerUser email logic: `flow_${role.toLowerCase().slice(0,4)}_${timestamp}@test.com`
        // Role: MANUFACTURER -> flow_manu_...

        // Need to load env for Mongo URI
        const dotenv = await import('dotenv');
        dotenv.config();

        if (process.env.MONGODB_URI) {
            await mongoose.connect(process.env.MONGODB_URI);
            await User.updateOne({ email: `flow_manu_${timestamp}@test.com` }, { status: 'ACTIVE' });
            console.log('✅ Manufacturer Force Activated');
            // Also activate Customer to be safe? Customer is ACTIVE by default but let's be sure.
            // Customer email: `flow_cust_${timestamp}@test.com`
        }

        const prodRes = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${mfgToken}` },
            body: JSON.stringify({
                name: `Flow Product ${timestamp}`,
                description: 'Flow Test',
                category: 'Electronics',
                basePrice: 500,
                moq: 1,
                availability: 'IN_STOCK',
                status: 'APPROVED',
                isApproved: true,
                specs: { color: 'Blue' }
            })
        });
        const prodData = await prodRes.json();
        if (!prodData.success) throw new Error('Product Seed Failed: ' + JSON.stringify(prodData));
        console.log(`✅ Seed Product Created: ${prodData.data._id}`);

        const token = await registerUser('CUSTOMER');
        console.log('✅ Customer Registered');

        // 1. Browse Products
        console.log('Test 1: Browse Products');
        const res1 = await fetch(`${BASE_URL}/products?limit=5`); // Public route usually? Or protected?
        // If public, no token needed. If protected, need token.
        // Assuming public for browsing.
        if (res1.ok) {
            const data1 = await res1.json();
            console.log(`✅ PASS: Browsed products. Count: ${data1.count || data1.data?.length}`);

            if (data1.data && data1.data.length > 0) {
                const productId = data1.data[0]._id || data1.data[0].id;

                // 2. View Details
                console.log('Test 2: View Product Details');
                const res2 = await fetch(`${BASE_URL}/products/${productId}`);
                if (res2.ok) {
                    console.log('✅ PASS: Viewed product details');
                } else {
                    console.error(`❌ FAIL: View Details failed. Status: ${res2.status}`);
                }

                // 3. Add to Cart
                console.log('Test 3: Add to Cart');
                const res3 = await fetch(`${BASE_URL}/cart/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId, quantity: 1 })
                });
                if (res3.ok) {
                    console.log('✅ PASS: Added to Cart');
                } else {
                    const d3 = await res3.json();
                    console.error(`❌ FAIL: Add to Cart failed. Status: ${res3.status}`, d3);
                }

                // 4. View Cart
                console.log('Test 4: View Cart');
                const res4 = await fetch(`${BASE_URL}/cart`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res4.ok) {
                    const data4 = await res4.json();
                    console.log(`✅ PASS: Viewed Cart. Items: ${data4.data?.items?.length || 0}`);
                } else {
                    console.error(`❌ FAIL: View Cart failed. Status: ${res4.status}`);
                }

            } else {
                console.warn('⚠️ No products found to test details/cart. (Run product flow first)');
            }

        } else {
            console.error(`❌ FAIL: Browse Products failed. Status: ${res1.status}`);
        }

    } catch (error) {
        const fs = await import('fs');
        fs.writeFileSync('src/server/scripts/customer_error.log', error.message + '\n' + error.stack);
        console.error('❌ Customer Flow Error logged to file.');
    }
    console.log('\n🏁 Customer Flow Validation Completed.');
}

testCustomerFlow();
