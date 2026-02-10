import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyFlow13() {
    console.log('🚀 Starting Consumer Payment Verification (FLOW 13)...\n');

    const timestamp = Date.now();
    const testCustomer = {
        email: `pay_test_${timestamp}@example.com`,
        password: 'Password123',
        firstName: 'Payment',
        lastName: 'Tester',
        name: 'Payment Tester',
        role: 'CUSTOMER',
        phone: `9${Math.floor(100000000 + Math.random() * 900000000)}`
    };

    try {
        // --- 1. Setup: Register & Login ---
        console.log('--- 1. Registering & Logging in ---');
        await axios.post(`${API_URL}/auth/register`, testCustomer);
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testCustomer.email,
            password: testCustomer.password
        });
        const token = loginRes.data.data.token;
        const headers = { Authorization: `Bearer ${token}` };

        // --- 2. Create Order ---
        console.log('--- 2. Creating Order ---');
        // Find product
        const productsRes = await axios.get(`${API_URL}/products`);
        const product = (productsRes.data.data.products || []).find(p => p.inventory && p.inventory.length > 0);

        if (!product) throw new Error('No products found');

        const inventory = product.inventory[0];

        // Create Order
        const orderRes = await axios.post(`${API_URL}/orders`, {
            dealerId: inventory.dealerId,
            items: [{ inventoryId: inventory.id, quantity: 1 }],
            shippingAddress: '123 Payment Lane'
        }, { headers });

        const orderId = orderRes.data.data.id;
        console.log(`Order Created: ${orderId}`);

        // --- 3. Initiate Payment (Mock) ---
        console.log('--- 3. Initiating Mock Payment ---');
        const paymentInitRes = await axios.post(`${API_URL}/payments/create-order`, {
            orderId
        }, { headers });

        if (!paymentInitRes.data.success) throw new Error('Payment initialization failed');

        const { razorpayOrderId, isMock } = paymentInitRes.data.data;
        console.log(`Razorpay Order ID: ${razorpayOrderId} (Mock: ${isMock})`);

        // --- 4. Verify Payment (Simulate Success) ---
        console.log('--- 4. Verifying Payment ---');
        const verifyRes = await axios.post(`${API_URL}/payments/verify`, {
            orderId,
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id: `pay_${timestamp}`,
            razorpay_signature: 'mock_signature'
        }, { headers });

        if (verifyRes.data.success) {
            console.log('✅ Payment Verified Successfully.');
            const { order, payment } = verifyRes.data.data;
            console.log(`Order Status: ${order.status}`);
            console.log(`Payment Status: ${payment.status}`);

            if (order.status !== 'PAID') throw new Error('Order status not updated to PAID');
        }

        // --- 5. Verify Escrow ---
        console.log('--- 5. Verifying Escrow Record ---');
        const statusRes = await axios.get(`${API_URL}/payments/status/${orderId}`, { headers });
        const escrow = statusRes.data.data.order.escrow;

        if (escrow) {
            console.log(`✅ Escrow Record Created: ${escrow.id}`);
            console.log(`Escrow Status: ${escrow.status}`);
            console.log(`Escrow Amount: ${escrow.amount}`);
        } else {
            throw new Error('Escrow record not found!');
        }

        console.log('\n✨ FLOW 13: Consumer Payment Verification Successful!');

    } catch (error) {
        console.error('❌ Verification Failed:', error.response?.data || error.message);
    }
}

verifyFlow13();
