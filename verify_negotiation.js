import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const timestamp = Date.now();
const runId = Math.floor(Math.random() * 1000);

const MFR_EMAIL = `mfr_neg_${timestamp}_${runId}@novamart.com`;
const DEALER_EMAIL = `dealer_neg_${timestamp}_${runId}@novamart.com`;
const PASS = 'Password123';

async function verifyNegotiation() {
    console.log('🚀 Starting B2B Negotiation Flow Verification...');

    try {
        // --- 1. SETUP ---
        console.log('\n--- 1. Setting up Partners ---');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'test_admin_super@novamart.com',
            password: 'AdminPassword123'
        });
        const adminHeader = { headers: { Authorization: `Bearer ${adminLogin.data.data.token}` } };

        // Register & Approve Mfr
        await axios.post(`${API_URL}/auth/register`, {
            email: MFR_EMAIL, password: PASS, name: 'Neg Mfr', phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`,
            role: 'MANUFACTURER', companyName: 'Neg Mfr Ltd', gstNumber: `NEG${timestamp}M`,
            registrationNo: `REG_NEG_${timestamp}`, factoryAddress: 'Neg Factory',
            bankDetails: { account: '123' }
        });
        const mfrList = await axios.get(`${API_URL}/admin/manufacturers`, adminHeader);
        const targetMfr = mfrList.data.data.find(m => m.user.email === MFR_EMAIL);
        await axios.put(`${API_URL}/admin/manufacturers/${targetMfr.id}/verify`, { isVerified: true }, adminHeader);

        // Register & Approve Dealer
        await axios.post(`${API_URL}/auth/register`, {
            email: DEALER_EMAIL, password: PASS, name: 'Neg Dealer', phone: `9${Math.floor(Math.random() * 900000000 + 100000000)}`,
            role: 'DEALER', businessName: 'Neg Retail', gstNumber: `NEG${timestamp}D`,
            businessAddress: 'Neg Street', bankDetails: { account: '456' }
        });
        const dealerList = await axios.get(`${API_URL}/admin/dealers`, adminHeader);
        const targetDealer = dealerList.data.data.find(d => d.user.email === DEALER_EMAIL);
        await axios.put(`${API_URL}/admin/dealers/${targetDealer.id}/verify`, { isVerified: true }, adminHeader);

        console.log('✅ Partners setup and approved.');

        // --- 2. CREATE PRODUCT ---
        console.log('\n--- 2. Manufacturer Creating Product ---');
        const mfrLogin = await axios.post(`${API_URL}/auth/login`, { email: MFR_EMAIL, password: PASS });
        const mfrHeader = { headers: { Authorization: `Bearer ${mfrLogin.data.data.token}` } };

        const productRes = await axios.post(`${API_URL}/products`, {
            name: 'Negotiable Turbine',
            description: 'A turbine with flexible pricing.',
            basePrice: 50000,
            moq: 10,
            category: 'machinery',
            images: ['https://example.com/turbine.jpg']
        }, mfrHeader);
        const productId = productRes.data.data.id;
        console.log(`✅ Product created: ${productId} (Base Price: ₹50,000)`);

        // --- 3. START NEGOTIATION ---
        console.log('\n--- 3. Dealer Initiating Negotiation ---');
        const dealerLogin = await axios.post(`${API_URL}/auth/login`, { email: DEALER_EMAIL, password: PASS });
        const dealerHeader = { headers: { Authorization: `Bearer ${dealerLogin.data.data.token}` } };

        const negRes = await axios.post(`${API_URL}/negotiation/create`, {
            productId: productId,
            quantity: 20,
            initialOffer: 40000
        }, dealerHeader);
        const negId = negRes.data.data.id;
        console.log(`✅ Negotiation started: ${negId}. Dealer offered: ₹40,000 for 20 units.`);

        // --- 4. COUNTER OFFER ---
        console.log('\n--- 4. Manufacturer Counter-Offering ---');
        const counterRes = await axios.put(`${API_URL}/negotiation/${negId}`, {
            message: 'We can do 45,000 for 20 units.',
            newOffer: 45000
        }, mfrHeader);
        console.log(`✅ Counter-offer sent: ₹45,000. Status: ${counterRes.data.data.status}`);

        // --- 5. ACCEPTANCE ---
        console.log('\n--- 5. Dealer Accepting Terms ---');
        const acceptRes = await axios.put(`${API_URL}/negotiation/${negId}`, {
            message: 'Deal accepted at 45k.',
            status: 'ACCEPTED'
        }, dealerHeader);
        console.log(`✅ Negotiation ACCEPTED. Final Price: ₹${acceptRes.data.data.currentOffer}`);

        // --- 6. VERIFY HISTORY ---
        console.log('\n--- 6. Verifying Chat History ---');
        const finalNegRes = await axios.get(`${API_URL}/negotiation/${negId}`, dealerHeader);
        const log = finalNegRes.data.data.chatLog;
        console.log(`✅ History contains ${log.length} entries.`);
        log.forEach(entry => console.log(`   [${entry.sender}] ${entry.message}`));

        console.log('\n✨ FLOW 8: Manufacturer ↔ Dealer Negotiation Verified Successfully!');
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

verifyNegotiation();
