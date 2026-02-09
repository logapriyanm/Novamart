import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function runTests() {
    console.log('🚀 Starting API Verification...\n');

    try {
        // 1. Health Check
        console.log('--- [Health Check] ---');
        const health = await axios.get(`${API_URL}/health`);
        console.log('✅ Health:', health.data.message);

        // 2. Auth: Login (Customer)
        console.log('\n--- [Auth: Login Customer] ---');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: 'demo@novamart.com',
            password: 'MONI@VKY21'
        });
        const token = loginRes.data.data.token;
        console.log('✅ Login successful for demo@novamart.com');

        // 3. Products: List
        console.log('\n--- [Products: List] ---');
        const productsRes = await axios.get(`${API_URL}/products`);
        const productList = productsRes.data.products || productsRes.data.data || [];
        console.log(`✅ Fetched ${productList.length} products`);

        if (productList.length > 0) {
            const product = productList[productList.length - 1]; // Use the one we seeded
            const inventory = product.inventory?.[0];

            if (inventory) {
                console.log(`\n--- [Orders: Create Order] ---`);
                const orderPayload = {
                    dealerId: inventory.dealerId,
                    items: [
                        {
                            productId: product.id,
                            quantity: 1,
                            inventoryId: inventory.id // Testing the specific fix for inventoryId handling
                        }
                    ]
                };

                const createRes = await axios.post(`${API_URL}/orders`, orderPayload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const orderId = createRes.data.data.id;
                console.log(`✅ Order created: ${orderId}`);

                // 4. Orders: Get My Orders
                console.log('\n--- [Orders: Get My Orders] ---');
                const ordersRes = await axios.get(`${API_URL}/orders/my`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const orderList = ordersRes.data.data || [];
                const found = orderList.find(o => o.id === orderId);
                console.log(`✅ Fetched ${orderList.length} orders. New order found: ${!!found}`);
            } else {
                console.log('⚠️ No inventory found for testing order creation.');
                console.log('Product details:', JSON.stringify(product, null, 2));
            }
        }

        console.log('\n✨ All basic API checks passed!');
    } catch (error) {
        console.error('\n❌ Verification Failed:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`URL: ${error.config.url}`);
            console.error('Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error(error.message);
        }
    }
}

runTests();
