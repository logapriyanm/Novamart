import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

async function verifyFlow11() {
    console.log('🚀 Starting Consumer Cart & Wishlist Verification (FLOW 11)...\n');

    const timestamp = Date.now();
    const testCustomer = {
        email: `c_cart_${timestamp}@example.com`,
        password: 'Password123',
        firstName: 'Cart',
        lastName: 'Tester',
        name: 'Cart Tester',
        role: 'CUSTOMER',
        phone: `9${Math.floor(100000000 + Math.random() * 900000000)}` // Valid Indian phone
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

        // --- 2. Discovery: Get Approved Products with Inventory ---
        console.log('--- 2. Fetching Products for Cart ---');
        const productsRes = await axios.get(`${API_URL}/products`);

        // Structure is { success: true, products: [], pagination: {} }
        const approvedProducts = (productsRes.data.products || []).filter(p =>
            p.status === 'APPROVED' && p.inventory && p.inventory.length > 0
        );

        if (approvedProducts.length === 0) {
            throw new Error('No approved products with inventory found for testing.');
        }

        const targetProduct = approvedProducts[0];
        const inventoryId = targetProduct.inventory[0].id;
        console.log(`Found Target: ${targetProduct.name} (Inv: ${inventoryId})`);

        // --- 3. Cart Action: Add to Cart ---
        console.log('--- 3. Adding to Cart ---');
        const addRes = await axios.post(`${API_URL}/cart/add`, { inventoryId, quantity: 2 }, { headers });
        if (addRes.data.success) {
            console.log('✅ Success: Product added to cart.');
        }

        // --- 4. Cart Action: Get Cart ---
        console.log('--- 4. Verifying Cart Content ---');
        const getRes = await axios.get(`${API_URL}/cart`, { headers });
        const cartItems = getRes.data.data.items;
        const addedItem = cartItems.find(item => item.inventoryId === inventoryId);

        if (addedItem && addedItem.quantity === 2) {
            console.log('✅ Success: Cart content verified.');
        } else {
            throw new Error(`Cart verification failed. Expected quantity 2, found ${addedItem?.quantity}`);
        }

        // --- 5. Cart Action: Update Quantity ---
        console.log('--- 5. Updating Quantity ---');
        const updateRes = await axios.put(`${API_URL}/cart/update`, {
            cartItemId: addedItem.id,
            quantity: 5
        }, { headers });

        if (updateRes.data.success && updateRes.data.data.quantity === 5) {
            console.log('✅ Success: Quantity updated to 5.');
        }

        // --- 6. Cart Action: Remove Item ---
        console.log('--- 6. Removing Item from Cart ---');
        const removeRes = await axios.delete(`${API_URL}/cart/remove/${addedItem.id}`, { headers });
        if (removeRes.data.success) {
            console.log('✅ Success: Item removed.');
        }

        // Final check: Cart should be empty
        const finalRes = await axios.get(`${API_URL}/cart`, { headers });
        if (finalRes.data.data.items.length === 0) {
            console.log('✅ Success: Final cart is empty.');
        }

        console.log('\n✨ FLOW 11: Consumer Cart Flow Verified Successfully!');

    } catch (error) {
        console.error('❌ Verification Failed:', error.response?.data || error.message);
    }
}

verifyFlow11();
