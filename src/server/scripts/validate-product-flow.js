
const BASE_URL = 'http://127.0.0.1:5000/api';

async function testProductFlow() {
    console.log('🚀 Starting Product Flow Validation...');

    const timestamp = Date.now();

    // Helper to register and get token
    async function registerAndGetToken(role, prefix) {
        const user = {
            email: `prod_${prefix}_${timestamp}@test.com`,
            password: 'Password123!',
            role: role,
            phone: (role === 'SELLER' ? '95' : '94') + timestamp.toString().slice(-8),
            ...(role === 'SELLER' ? { businessName: 'Prod Seller', gstNumber: `GST${timestamp}S`, businessAddress: 'Addr', bankDetails: { accountNumber: '123', ifscCode: 'ABC' } } : {}),
            ...(role === 'MANUFACTURER' ? { companyName: 'Prod Mfg', registrationNo: `MFG${timestamp}M`, factoryAddress: 'Addr', gstNumber: `GST${timestamp}M`, bankDetails: { accountNumber: '123', ifscCode: 'ABC' } } : {})
        };

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
        const mfgToken = await registerAndGetToken('MANUFACTURER', 'mfg');
        const sellerToken = await registerAndGetToken('SELLER', 'sell');

        console.log('Users created. Testing Product CRUD...\n');

        // 1. Manufacturer Create Product
        console.log('Test 1: Manufacturer Create Product');
        const productData = {
            name: `Test Product ${timestamp}`,
            description: 'A test product description',
            category: 'Electronics',
            price: 1999,
            moq: 10,
            availability: 'IN_STOCK',
            specs: { color: 'Black', weight: '1kg' }
        };

        const res1 = await fetch(`${BASE_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${mfgToken}`
            },
            body: JSON.stringify(productData)
        });
        const data1 = await res1.json();

        if (res1.ok && data1.success) {
            console.log(`✅ PASS: Manufacturer created product ID: ${data1.data._id}`);
            const productId = data1.data._id;

            // 2. Update Product
            console.log('Test 2: Update Product');
            const res2 = await fetch(`${BASE_URL}/products/${productId}`, {
                method: 'PUT', // or PATCH
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${mfgToken}`
                },
                body: JSON.stringify({ price: 2499 })
            });
            const data2 = await res2.json();
            if (res2.ok && data2.data.price === 2499) {
                console.log('✅ PASS: Product updated successfully');
            } else {
                console.error(`❌ FAIL: Product update failed. Status: ${res2.status}`);
            }

            // 3. Delete Product
            console.log('Test 3: Delete Product');
            const res3 = await fetch(`${BASE_URL}/products/${productId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${mfgToken}` }
            });
            if (res3.ok) {
                console.log('✅ PASS: Product deleted successfully');
            } else {
                console.error(`❌ FAIL: Product delete failed. Status: ${res3.status}`);
            }

        } else {
            console.error(`❌ FAIL: Product creation failed. Status: ${res1.status}`, data1);
        }

    } catch (error) {
        const fs = await import('fs');
        fs.writeFileSync('src/server/scripts/product_error.log', error.message + '\n' + error.stack);
        console.error('❌ Product Validation Error logged to file.');
    }
    console.log('\n🏁 Product Flow Validation Completed.');
}

testProductFlow();
