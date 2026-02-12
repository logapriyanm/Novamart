
const BASE_URL = 'http://localhost:5000/api';
const ADMIN_EMAIL = 'admin@test.com';
const ADMIN_PASSWORD = 'Admin@123';

async function testDealerFlow() {
    const email = `dealer_${Date.now()}@example.com`;
    const password = 'Password@123';
    let dealerToken = '';
    let adminToken = '';
    let dealerId = '';
    let userId = '';

    console.log(`Starting Dealer Flow Test for ${email}...`);

    // 1. Register Dealer
    try {
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Dealer',
                email,
                password,
                phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
                role: 'DEALER',
                businessName: 'Test Dealer Business',
                gstNumber: `29ABCDE${Math.floor(1000 + Math.random() * 9000)}F1Z5`,
                businessAddress: '456 Business Park, Mumbai, Maharashtra 400001',
                city: 'Mumbai',
                state: 'Maharashtra',
                bankDetails: {
                    accountNumber: '1234567890',
                    ifscCode: 'ICIC0001234',
                    bankName: 'ICICI Bank'
                }
            })
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(`Dealer Registration failed: ${JSON.stringify(regData)}`);
        userId = regData.data.user.id;
        console.log('✅ Dealer User Registration Successful, User ID:', userId);
    } catch (e) {
        console.error('❌ Dealer Registration Error:', e.message);
        process.exit(1);
    }

    // 2. Admin Login
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(`Admin Login failed: ${JSON.stringify(loginData)}`);
        adminToken = loginData.token || (loginData.data && loginData.data.token);
        console.log('✅ Admin Login Successful');
    } catch (e) {
        console.error('❌ Admin Login Error:', e.message);
        console.log('Attempting to find different admin password...');
        // Fallback or skip if not found
        process.exit(1);
    }

    // 2.5 Admin finds Dealer ID by Email/UserId
    try {
        const dealersRes = await fetch(`${BASE_URL}/admin/dealers`, {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const dealersData = await dealersRes.json();
        const dealer = dealersData.data.find(d => d.userId?._id === userId || d.userId === userId || d.userId?.email === email);
        if (!dealer) throw new Error('Dealer not found by Admin');
        dealerId = dealer._id;
        console.log('✅ Admin found Dealer ID:', dealerId);
    } catch (e) {
        console.error('❌ Admin Find Dealer Error:', e.message);
        process.exit(1);
    }

    // 3. Approve Dealer
    try {
        const approveRes = await fetch(`${BASE_URL}/admin/dealers/${dealerId}/verify`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({ isVerified: true })
        });
        const approveData = await approveRes.json();
        if (!approveRes.ok) throw new Error(`Dealer Approval failed: ${JSON.stringify(approveData)}`);
        console.log('✅ Dealer Approval Successful');

        // Wait a bit for status to propagate
        await new Promise(r => setTimeout(r, 1000));
    } catch (e) {
        console.error('❌ Dealer Approval Error:', e.message);
        process.exit(1);
    }

    // 4. Dealer Login (Post-approval)
    const loginUrl = `${BASE_URL}/auth/login`;
    const loginBody = JSON.stringify({ email, password });
    console.log(`Calling Dealer Login: POST ${loginUrl}`);
    console.log(`Body: ${loginBody}`);
    try {
        const loginRes = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: loginBody
        });
        const responseText = await loginRes.text();
        let loginData;
        try {
            loginData = JSON.parse(responseText);
        } catch (je) {
            throw new Error(`Dealer Login failed (HTTP ${loginRes.status}) for ${email} with non-JSON response: ${responseText.substring(0, 500)}...`);
        }
        if (!loginRes.ok) throw new Error(`Dealer Login failed: ${JSON.stringify(loginData)}`);
        dealerToken = loginData.token || (loginData.data && loginData.data.token);
        console.log('✅ Dealer Login Successful');
    } catch (e) {
        console.error('❌ Dealer Login Error:', e.message);
        process.exit(1);
    }

    // 5. Source Product (Add Inventory)
    try {
        // Fetch a product first
        const productsRes = await fetch(`${BASE_URL}/products?limit=1`);
        const productsText = await productsRes.text();
        let productsData;
        try {
            productsData = JSON.parse(productsText);
        } catch (je) {
            throw new Error(`Product fetch failed (HTTP ${productsRes.status}) with non-JSON response: ${productsText.substring(0, 500)}...`);
        }
        if (!productsRes.ok) throw new Error(`Product fetch failed: ${JSON.stringify(productsData)}`);

        const productId = productsData.data.products[0]._id;

        const sourceRes = await fetch(`${BASE_URL}/dealer/source`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${dealerToken}`
            },
            body: JSON.stringify({
                productId,
                region: 'North',
                stock: 50,
                price: 15000
            })
        });
        const sourceText = await sourceRes.text();
        let sourceData;
        try {
            sourceData = JSON.parse(sourceText);
        } catch (je) {
            throw new Error(`Source Product failed (HTTP ${sourceRes.status}) with non-JSON response: ${sourceText.substring(0, 500)}...`);
        }
        if (!sourceRes.ok) throw new Error(`Source Product failed: ${JSON.stringify(sourceData)}`);
        console.log('✅ Product Sourced Successfully');
    } catch (e) {
        console.error('❌ Source Product Error:', e.message);
        process.exit(1);
    }

    console.log('🎉 Dealer Flow Verification Completed Successfully!');
}

testDealerFlow();
