import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyFlow12() {
    console.log('🚀 Starting Consumer Checkout Verification (FLOW 12)...\n');

    const timestamp = Date.now();
    const testCustomer = {
        email: `c_check_${timestamp}@example.com`,
        password: 'Password123',
        firstName: 'Check',
        lastName: 'Tester',
        name: 'Checkout Tester',
        role: 'CUSTOMER',
        phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`
    };

    try {
        // --- 1. Setup: Register & Login Customer ---
        console.log('--- 1. Registering & Logging in Customer ---');
        await axios.post(`${API_URL}/auth/register`, testCustomer);
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testCustomer.email,
            password: testCustomer.password
        });
        const token = loginRes.data.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // --- 2. Discovery: Find Product with Stock ---
        console.log('--- 2. Fetching Products ---');
        const productsRes = await axios.get(`${API_URL}/products`);
        const approvedProducts = (productsRes.data.products || []).filter(p =>
            p.status === 'APPROVED' && p.inventory && p.inventory.length > 0
        );

        if (approvedProducts.length === 0) {
            throw new Error('No approved products found.');
        }

        const target = approvedProducts[0];
        const inventory = target.inventory[0];
        console.log(`Target: ${target.name} (Dealer: ${inventory.dealer.businessName})`);

        // --- 3. Checkout: Create Order ---
        console.log('--- 3. Creating Order (Checkout) ---');
        const shippingAddress = '123 Test Lane, Apartment 4B, Metro City, 500001';

        const orderRes = await axios.post(`${API_URL}/orders`, {
            dealerId: inventory.dealerId,
            items: [
                { inventoryId: inventory.id, quantity: 2 }
            ],
            shippingAddress
        }, { headers });

        if (orderRes.data.success) {
            const order = orderRes.data.data;
            console.log('✅ Success: Order created.');
            console.log('Order ID:', order.id);
            console.log('Total Amount:', order.totalAmount);
            console.log('Tax Amount:', order.taxAmount);
            console.log('Shipping Address:', order.shippingAddress);

            if (order.shippingAddress !== shippingAddress) {
                throw new Error('Shipping address mismatch!');
            }

            // --- 4. Verification: Check Order Details ---
            console.log('--- 4. Verifying Order Details ---');
            const getOrderRes = await axios.get(`${API_URL}/orders/${order.id}`, { headers });
            if (getOrderRes.data.data.status === 'CREATED') {
                console.log('✅ Success: Order status is CREATED.');
            }
        }

        console.log('\n✨ FLOW 12: Consumer Checkout Flow Verified Successfully!');

    } catch (error) {
        console.error('❌ Verification Failed:', error.response?.data || error.message);
    }
}

verifyFlow12();
