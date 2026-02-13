

const BASE_URL = 'http://127.0.0.1:5000/api/auth';

async function testAuth() {
    console.log('🚀 Starting Auth Flow Validation...');

    // override email to avoid unique constraint if running multiple times
    const timestamp = Date.now();
    const customer = {
        name: 'Test Customer',
        email: `auth_test_cust_${timestamp}@novamart.com`,
        phone: `98${timestamp.toString().slice(-8)}`,
        password: 'Password123!',
        role: 'CUSTOMER'
    };

    const seller = {
        email: `auth_test_sell_${timestamp}@novamart.com`,
        phone: `97${timestamp.toString().slice(-8)}`,
        password: 'Password123!',
        role: 'SELLER',
        businessName: `Test Seller Inc ${timestamp}`,
        gstNumber: `29${timestamp.toString().slice(-10)}Z5`,
        businessAddress: '123 Seller St',
        bankDetails: { accountNumber: '1234567890', ifscCode: 'HDFC0001234' }
    };

    const manufacturer = {
        email: `auth_test_mfg_${timestamp}@novamart.com`,
        phone: `96${timestamp.toString().slice(-8)}`,
        password: 'Password123!',
        role: 'MANUFACTURER',
        companyName: `Test Mfg Ltd ${timestamp}`,
        registrationNo: `MFG${timestamp}`,
        factoryAddress: '456 Factory Rd',
        gstNumber: `29${timestamp.toString().slice(-10)}Z6`, // Different suffix
        bankDetails: { accountNumber: '0987654321', ifscCode: 'SBIN0001234' }
    };

    // 1. Register Customer
    console.log(`\nTesting Customer Registration...`);
    const regCustRes = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customer)
    });
    const regCustData = await regCustRes.json();
    if (regCustRes.ok && regCustData.success) {
        console.log('✅ Customer Registration Successful');
    } else {
        console.error('❌ Customer Registration Failed:', regCustData);
    }

    // 2. Login Customer
    console.log(`\nTesting Customer Login...`);
    const loginCustRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: customer.email, password: customer.password })
    });
    const loginCustData = await loginCustRes.json();
    if (loginCustRes.ok && loginCustData.data?.token) {
        console.log('✅ Customer Login Successful');
    } else {
        console.error('❌ Customer Login Failed:', loginCustData);
    }

    // 3. Register Seller
    console.log(`\nTesting Seller Registration...`);
    const regSellRes = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(seller)
    });
    const regSellData = await regSellRes.json();
    if (regSellRes.ok && regSellData.success) {
        console.log('✅ Seller Registration Successful');
    } else {
        console.error('❌ Seller Registration Failed:', regSellData);
    }

    // 4. Register Manufacturer
    console.log(`\nTesting Manufacturer Registration...`);
    const regMfgRes = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manufacturer)
    });
    const regMfgData = await regMfgRes.json();
    if (regMfgRes.ok && regMfgData.success) {
        console.log('✅ Manufacturer Registration Successful');
    } else {
        console.error('❌ Manufacturer Registration Failed:', regMfgData);
    }

    console.log('\n🏁 Auth Flow Validation Completed.');
}

testAuth();
