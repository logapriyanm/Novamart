
const BASE_URL = 'http://localhost:5000/api';
const INVENTORY_ID = '698c1a32139a6c13e8702a0d';

async function testCustomerFlow() {
    const email = `customer_${Date.now()}@example.com`;
    const password = 'Password@123';
    let token = '';

    console.log(`Starting Customer Flow Test for ${email}...`);

    // 1. Register
    try {
        const regRes = await fetch(`${BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Customer',
                email,
                password,
                phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`,
                role: 'CUSTOMER'
            })
        });
        const regData = await regRes.json();
        if (!regRes.ok) throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
        console.log('✅ Registration Successful');
    } catch (e) {
        console.error('❌ Registration Error:', e.message);
        process.exit(1);
    }

    // 2. Login
    try {
        const loginRes = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const loginData = await loginRes.json();
        if (!loginRes.ok) throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
        console.log('Login Response:', JSON.stringify(loginData));
        token = loginData.token || (loginData.data && loginData.data.token);
        if (!token) throw new Error('Token not found in login response');
        console.log('✅ Login Successful, Token length:', token.length);
    } catch (e) {
        console.error('❌ Login Error:', e.message);
        process.exit(1);
    }

    // 3. Add to Cart
    try {
        const cartRes = await fetch(`${BASE_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                inventoryId: INVENTORY_ID,
                quantity: 1
            })
        });
        const cartData = await cartRes.json();
        if (!cartRes.ok) throw new Error(`Add to Cart failed: ${JSON.stringify(cartData)}`);
        console.log('✅ Added to Cart Successful');
    } catch (e) {
        console.error('❌ Add to Cart Error:', e.message);
        process.exit(1);
    }

    // 3.5 Fetch Cart to get items and dealerId
    let cartItems = [];
    let dealerId = '';
    try {
        const getCartRes = await fetch(`${BASE_URL}/cart`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const getCartData = await getCartRes.json();
        if (!getCartRes.ok) throw new Error(`Fetch Cart failed: ${JSON.stringify(getCartData)}`);

        cartItems = getCartData.data.items;
        if (cartItems.length > 0) {
            dealerId = cartItems[0].dealerId;
        }
        console.log('✅ Cart Fetched, Items:', cartItems.length, 'Dealer ID:', dealerId);
    } catch (e) {
        console.error('❌ Fetch Cart Error:', e.message);
        process.exit(1);
    }

    // 4. Place Order
    try {
        const orderRes = await fetch(`${BASE_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                dealerId,
                items: cartItems.map(item => ({
                    productId: item.product?._id || item.product,
                    inventoryId: item.inventoryId,
                    quantity: item.quantity,
                    price: item.price
                })),
                shippingAddress: '123 Test St, Test City, Test State, 123456, India',
                paymentMethod: 'COD' // Using COD for simplicity in test
            })
        });
        const orderData = await orderRes.json();

        // Handle if API returns success:true but maybe inside data
        if (!orderRes.ok && orderRes.status !== 201) {
            throw new Error(`Order Placement failed: ${JSON.stringify(orderData)}`);
        }
        console.log('✅ Order Placement Successful', orderData);
    } catch (e) {
        console.error('❌ Order Placement Error:', e.message);
        process.exit(1);
    }

    console.log('🎉 Customer Flow Verification Completed Successfully!');
}

testCustomerFlow();
