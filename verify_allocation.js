import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const timestamp = Date.now();
const runId = Math.floor(Math.random() * 1000);

const MFR_EMAIL = `mfr_alloc_${timestamp}_${runId}@novamart.com`;
const DEALER_EMAIL = `dealer_alloc_${timestamp}_${runId}@novamart.com`;
const PASS = 'Password123';

async function verifyAllocation() {
    console.log('🚀 Starting Stock Allocation & Inventory Flow Verification...');

    try {
        // --- 1. SETUP ---
        console.log('\n--- 1. Setting up Partners ---');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'test_admin_super@novamart.com',
            password: 'AdminPassword123'
        });
        const adminHeader = { headers: { Authorization: `Bearer ${adminLogin.data.data.token}` } };

        // Register & Approve Mfr
        const mfrReg = await axios.post(`${API_URL}/auth/register`, {
            email: MFR_EMAIL, password: PASS, name: 'Alloc Mfr', phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`,
            role: 'MANUFACTURER', companyName: 'Alloc Mfr Ltd', gstNumber: `ALC${timestamp}M`,
            registrationNo: `REG_ALC_${timestamp}`, factoryAddress: 'Alloc Factory',
            bankDetails: { account: '111' }
        });
        const mfrList = await axios.get(`${API_URL}/admin/manufacturers`, adminHeader);
        const targetMfr = mfrList.data.data.find(m => m.user.email === MFR_EMAIL);
        await axios.put(`${API_URL}/admin/manufacturers/${targetMfr.id}/verify`, { isVerified: true }, adminHeader);

        // Register & Approve Dealer
        const dealerReg = await axios.post(`${API_URL}/auth/register`, {
            email: DEALER_EMAIL, password: PASS, name: 'Alloc Dealer', phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`,
            role: 'DEALER', businessName: 'Alloc Retail', gstNumber: `ALC${timestamp}D`,
            businessAddress: 'Alloc Street', bankDetails: { account: '222' }
        });
        const dealerList = await axios.get(`${API_URL}/admin/dealers`, adminHeader);
        const targetDealer = dealerList.data.data.find(d => d.user.email === DEALER_EMAIL);
        await axios.put(`${API_URL}/admin/dealers/${targetDealer.id}/verify`, { isVerified: true }, adminHeader);

        // Connect them (Network)
        await axios.post(`${API_URL}/manufacturer/network/handle`, {
            dealerId: targetDealer.id,
            status: 'APPROVED'
        }, { headers: { Authorization: `Bearer ${mfrReg.data.data.token}` } });

        console.log('✅ Partners setup, approved, and connected in network.');

        // --- 2. CREATE PRODUCT ---
        console.log('\n--- 2. Manufacturer Creating Product ---');
        const mfrLogin = await axios.post(`${API_URL}/auth/login`, { email: MFR_EMAIL, password: PASS });
        const mfrHeader = { headers: { Authorization: `Bearer ${mfrLogin.data.data.token}` } };

        const productRes = await axios.post(`${API_URL}/products`, {
            name: 'Bulk Industrial Fan',
            description: 'High capacity fan for warehouses.',
            basePrice: 12000,
            moq: 5,
            category: 'appliances',
            images: ['https://example.com/fan.jpg']
        }, mfrHeader);
        const productId = productRes.data.data.id;
        console.log(`✅ Product created: ${productId}`);

        // --- 3. ALLOCATE STOCK ---
        console.log('\n--- 3. Manufacturer Allocating Stock ---');
        const allocRes = await axios.post(`${API_URL}/manufacturer/inventory/allocate`, {
            productId: productId,
            dealerId: targetDealer.id,
            region: 'North',
            quantity: 100,
            dealerBasePrice: 10500,
            dealerMoq: 10,
            maxMargin: 25
        }, mfrHeader);
        const allocationId = allocRes.data.data.id;
        console.log(`✅ Stock allocated! ID: ${allocationId}, Qty: 100, Price: ₹10,500`);

        // --- 4. VERIFY DEALER INVENTORY ---
        console.log('\n--- 4. Checking Dealer Inventory ---');
        const dealerLogin = await axios.post(`${API_URL}/auth/login`, { email: DEALER_EMAIL, password: PASS });
        const dealerHeader = { headers: { Authorization: `Bearer ${dealerLogin.data.data.token}` } };

        const invRes = await axios.get(`${API_URL}/dealer/inventory`, dealerHeader);
        const myInventory = invRes.data.data;
        const targetInv = myInventory.find(i => i.productId === productId);

        if (targetInv && targetInv.allocatedStock === 100) {
            console.log(`✅ Success: Dealer sees allocated stock (100 units).`);
            console.log(`   Base Price: ₹${targetInv.dealerBasePrice}, MOQ: ${targetInv.dealerMoq}`);
        } else {
            throw new Error('Dealer inventory check failed.');
        }

        // --- 5. DEALER UPDATING PRICE & STOCK ---
        console.log('\n--- 5. Dealer Updating Retail Parameters ---');
        await axios.put(`${API_URL}/dealer/inventory/price`, {
            inventoryId: targetInv.id,
            price: 11500 // Within 25% margin (10500 * 1.25 = 13125)
        }, dealerHeader);

        await axios.put(`${API_URL}/dealer/inventory/stock`, {
            inventoryId: targetInv.id,
            stock: 50 // Setting actual physical stock
        }, dealerHeader);

        const finalInvRes = await axios.get(`${API_URL}/dealer/inventory`, dealerHeader);
        const finalInv = finalInvRes.data.data.find(i => i.id === targetInv.id);

        console.log(`✅ Update successful! Retail Price: ₹${finalInv.price}, Physical Stock: ${finalInv.stock}`);

        console.log('\n✨ FLOW 9: Stock Allocation & Dealer Inventory Management Verified Successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ FATAL ERROR:');
        if (error.response) {
            console.error(`Status: ${error.response.status}`);
            console.error(`Data: ${JSON.stringify(error.response.data)}`);
        } else {
            console.error(error.message);
        }
        process.exit(1);
    }
}

verifyAllocation();
