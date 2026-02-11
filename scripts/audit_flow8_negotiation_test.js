import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testNegotiation = async () => {
    console.log('--- Starting Flow 8: Manufacturer ↔ Dealer Negotiation Readiness ---');

    try {
        const suiteId = Math.floor(Math.random() * 1000000);

        // 1. Setup Manufacturer
        console.log('\n[8.1] Setting up Manufacturer and Product...');
        const manuData = {
            email: `mfg_f8_${suiteId}@test.com`,
            phone: `${Math.floor(7000000000 + Math.random() * 1000000000)}`,
            password: 'Password123!',
            role: 'MANUFACTURER',
            companyName: 'MFG Flow 8 LTD',
            registrationNo: `REG8_${suiteId}`,
            factoryAddress: '888 Factory Ave',
            gstNumber: `GST8_${suiteId}`,
            bankDetails: { accountNo: '888999' }
        };
        const manuRes = await axios.post(`${API_URL}/auth/register`, manuData);
        console.log('   - Registration Response:', manuRes.status);

        const manuLogin = await axios.post(`${API_URL}/auth/login`, {
            email: manuData.email,
            password: manuData.password
        });
        console.log('   - Login Response:', manuLogin.status);
        const manuToken = manuLogin.data.data.token;
        const manuUserId = manuLogin.data.data.user.id;

        // Activate Manufacturer
        await axios.patch(`${API_URL}/mongodb/User/${manuUserId}/status`, { status: 'ACTIVE' });

        const mfgProfRes = await axios.get(`${API_URL}/mongodb/Manufacturer`, {
            params: { query: JSON.stringify({ userId: manuUserId }) }
        });
        const mfgProfileId = mfgProfRes.data.data[0]._id;

        // Create a Product
        const productData = {
            name: `Negotiable Widget ${suiteId}`,
            description: 'A high-quality widget for bulk testing.',
            basePrice: 1000,
            moq: 10,
            inventory: 5000,
            category: 'Testing Items',
            images: ['http://example.com/widget.jpg']
        };
        const productRes = await axios.post(`${API_URL}/products`, productData, {
            headers: { Authorization: `Bearer ${manuToken}` }
        });
        console.log('   - Product Creation Response:', productRes.status);
        const productId = productRes.data.data._id;
        console.log(`✅ Manufacturer Ready & Product Created (ID: ${productId})`);

        // 2. Setup Dealer
        console.log('\n[8.2] Setting up Dealer and Approval...');
        const dealerData = {
            email: `dealer_f8_${suiteId}@test.com`,
            phone: `${Math.floor(6000000000 + Math.random() * 1000000000)}`,
            password: 'Password123!',
            role: 'DEALER',
            businessName: 'Dealer Flow 8 Enterprise',
            gstNumber: `GST_D8_${suiteId}`,
            businessAddress: '888 Dealer Road',
            bankDetails: { accountNo: '333444' }
        };
        await axios.post(`${API_URL}/auth/register`, dealerData);
        const dealerLogin = await axios.post(`${API_URL}/auth/login`, {
            email: dealerData.email,
            password: dealerData.password
        });
        const dealerToken = dealerLogin.data.data.token;
        const dealerUserId = dealerLogin.data.data.user.id;

        // Get Dealer Profile ID
        const dealerProfRes = await axios.get(`${API_URL}/mongodb/Dealer`, {
            params: { query: JSON.stringify({ userId: dealerUserId }) }
        });
        const dealerProfileId = dealerProfRes.data.data[0]._id;

        // Approve Dealer
        await axios.post(`${API_URL}/manufacturer/dealers/handle`, {
            dealerId: dealerProfileId,
            status: 'APPROVED'
        }, { headers: { Authorization: `Bearer ${manuToken}` } });
        console.log('✅ Dealer Approved and in Network.');

        // 3. Start Negotiation
        console.log('\n[8.3] Dealer starting negotiation...');
        const negRes = await axios.post(`${API_URL}/negotiation/create`, {
            productId: productId,
            quantity: 100,
            proposedPrice: 850,
            message: 'Looking for a better price for a bulk order of 100 units.'
        }, { headers: { Authorization: `Bearer ${dealerToken}` } });

        const negotiationId = negRes.data.data._id;
        console.log(`✅ Negotiation Started (ID: ${negotiationId}, Initial Offer: ${negRes.data.data.currentOffer})`);

        // 4. Manufacturer Counter-Offer
        console.log('\n[8.4] Manufacturer sending counter-offer...');
        await axios.put(`${API_URL}/negotiation/${negotiationId}`, {
            counterPrice: 900,
            message: 'We can do ₹900 for 100 units. Best price possible.'
        }, { headers: { Authorization: `Bearer ${manuToken}` } });
        console.log('✅ Counter-offer sent.');

        // 5. Dealer Accepts Offer
        console.log('\n[8.5] Dealer accepting offer...');
        await axios.put(`${API_URL}/negotiation/${negotiationId}`, {
            status: 'ACCEPTED',
            message: 'Agreed. ₹900 works for us.'
        }, { headers: { Authorization: `Bearer ${dealerToken}` } });
        console.log('✅ Offer accepted by dealer.');

        // 6. Manufacturer Fulfills Order (Triggers Stock Allocation)
        console.log('\n[8.6] Manufacturer fulfilling order...');
        const fulfillRes = await axios.put(`${API_URL}/negotiation/${negotiationId}`, {
            status: 'ORDER_FULFILLED'
        }, { headers: { Authorization: `Bearer ${manuToken}` } });
        console.log(`✅ Order Fulfilled. Status: ${fulfillRes.data.data.status}`);

        // 7. Verify Stock Allocation
        console.log('\n[8.7] Verifying Stock Allocation...');
        const invRes = await axios.get(`${API_URL}/dealer/allocations`, {
            headers: { Authorization: `Bearer ${dealerToken}` }
        });

        const allocation = invRes.data.data.find(a => a.productId._id === productId || a.productId.id === productId);
        if (allocation && allocation.allocatedStock >= 100) {
            console.log(`✅ Stock Allocated Successfully: ${allocation.allocatedStock} units at ₹${allocation.dealerBasePrice}`);
            console.log('🎉 Flow 8: Negotiation & Allocation SUCCESS!');
        } else {
            console.log('❌ Flow 8: Negotiation & Allocation FAILED');
            console.log('Final Allocation Data:', JSON.stringify(allocation, null, 2));
        }

        console.log('\n--- Flow 8 API Tests Completed! ---');

    } catch (error) {
        console.error('❌ Flow 8 Test Failed:', error.response?.data || error.message);
    }
};

testNegotiation();
