import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
const timestamp = Date.now();

// 1. Manufacturer details
const MFR_EMAIL = `mfr_access_${timestamp}@novamart.com`;
const MFR_PHONE = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;
const MFR_GST = `${Math.floor(Math.random() * 90 + 10)}AAAAA${Math.floor(Math.random() * 9000 + 1000)}A1Z${Math.floor(Math.random() * 9)}`;

// 2. Dealer details
const DEALER_EMAIL = `dealer_access_${timestamp}@novamart.com`;
const DEALER_PHONE = `9${Math.floor(Math.random() * 900000000 + 100000000)}`;
const DEALER_GST = `${Math.floor(Math.random() * 90 + 10)}BBBBB${Math.floor(Math.random() * 9000 + 1000)}B1Z${Math.floor(Math.random() * 9)}`;

const PASS = 'Password123';

async function verifyAccessRequest() {
    console.log('🚀 Starting Dealer Access Request System Verification...');

    try {
        // --- PREPARATION ---

        // A. Setup Admin
        console.log('\n--- A. Logging in as Admin ---');
        const adminLogin = await axios.post(`${API_URL}/auth/login`, {
            email: 'test_admin_super@novamart.com',
            password: 'AdminPassword123'
        });
        const adminHeader = { headers: { Authorization: `Bearer ${adminLogin.data.data.token}` } };

        // B. Setup Manufacturer (ACTIVE)
        console.log(`\n--- B. Setting up Manufacturer: ${MFR_EMAIL} ---`);
        await axios.post(`${API_URL}/auth/register`, {
            email: MFR_EMAIL, password: PASS, name: 'Access Test Mfr', phone: MFR_PHONE,
            role: 'MANUFACTURER', companyName: 'Access Test Mfr Ltd', gstNumber: MFR_GST,
            registrationNo: `REG_ACC_${timestamp}`, factoryAddress: 'Test Factory 101',
            bankDetails: { account: '123' }
        });
        // Approve Mfr
        const mfrsList = await axios.get(`${API_URL}/admin/manufacturers`, adminHeader);
        const targetMfr = mfrsList.data.data.find(m => m.user.email === MFR_EMAIL);
        await axios.put(`${API_URL}/admin/manufacturers/${targetMfr.id}/verify`, { isVerified: true }, adminHeader);
        console.log('✅ Manufacturer setup and approved.');

        // C. Setup Dealer (ACTIVE)
        console.log(`\n--- C. Setting up Dealer: ${DEALER_EMAIL} ---`);
        await axios.post(`${API_URL}/auth/register`, {
            email: DEALER_EMAIL, password: PASS, name: 'Access Test Dealer', phone: DEALER_PHONE,
            role: 'DEALER', businessName: 'Access Hub', gstNumber: DEALER_GST,
            businessAddress: 'Hub Street 7', bankDetails: { account: '456' }
        });
        // Approve Dealer
        const dealerList = await axios.get(`${API_URL}/admin/dealers`, adminHeader);
        const targetDealer = dealerList.data.data.find(d => d.user.email === DEALER_EMAIL);
        await axios.put(`${API_URL}/admin/dealers/${targetDealer.id}/verify`, { isVerified: true }, adminHeader);
        console.log('✅ Dealer setup and approved.');

        // --- THE FLOW ---

        // 1. Dealer Discovery
        console.log('\n--- 1. Dealer Discovery ---');
        const dealerLogin = await axios.post(`${API_URL}/auth/login`, { email: DEALER_EMAIL, password: PASS });
        const dealerToken = dealerLogin.data.data.token;
        const dealerHeader = { headers: { Authorization: `Bearer ${dealerToken}` } };

        const marketplace = await axios.get(`${API_URL}/dealer/manufacturers`, dealerHeader);
        const foundMfr = marketplace.data.data.find(m => m.companyName === 'Access Test Mfr Ltd');
        if (foundMfr) {
            console.log(`✅ Success: Dealer discovered Manufacturer (${foundMfr.id}) in marketplace.`);
        } else {
            throw new Error('MFR_NOT_FOUND_IN_MARKETPLACE');
        }

        // 2. Dealer: Request Access
        console.log('\n--- 2. Dealer Requesting Access ---');
        const reqPayload = {
            manufacturerId: foundMfr.id,
            message: 'Looking for bulk industrial fans for North region.',
            expectedQuantity: 50,
            region: 'North',
            priceExpectation: 'Competitive'
        };
        const requestRes = await axios.post(`${API_URL}/dealer/request-access`, reqPayload, dealerHeader);
        console.log(`✅ Success: Request submitted. Status: ${requestRes.data.data.status}`);

        // 3. Manufacturer: Check Requests
        console.log('\n--- 3. Manufacturer Checking Requests ---');
        const mfrLogin = await axios.post(`${API_URL}/auth/login`, { email: MFR_EMAIL, password: PASS });
        const mfrToken = mfrLogin.data.data.token;
        const mfrHeader = { headers: { Authorization: `Bearer ${mfrToken}` } };

        const pendingRequests = await axios.get(`${API_URL}/manufacturer/dealers/requests?status=PENDING`, mfrHeader);
        const targetReq = pendingRequests.data.data.find(r => r.dealer.businessName === 'Access Hub');

        if (targetReq) {
            console.log(`✅ Success: Manufacturer found the request from ${targetReq.dealer.businessName}.`);
            console.log(`📝 Message: "${targetReq.message}"`);
        } else {
            console.error('❌ Failure: Manufacturer did not see the pending request.');
            console.log('Data found:', JSON.stringify(pendingRequests.data.data));
            process.exit(1);
        }

        // 4. Manufacturer: Approve Request
        console.log('\n--- 4. Manufacturer Approving Request ---');
        await axios.post(`${API_URL}/manufacturer/dealers/handle`, {
            dealerId: targetReq.dealerId,
            status: 'APPROVED'
        }, mfrHeader);
        console.log('✅ Success: Partnership APPROVED.');

        // 5. Verify Partnership
        console.log('\n--- 5. Verifying Partnership in Network ---');
        const networkRes = await axios.get(`${API_URL}/manufacturer/network`, mfrHeader);
        const approvedPartner = networkRes.data.data.find(d => d.businessName === 'Access Hub');
        if (approvedPartner) {
            console.log(`✨ Success: ${approvedPartner.businessName} is now in the Manufacturer's approved network.`);
        } else {
            throw new Error('PARTNER_NOT_IN_NETWORK');
        }

        console.log('\n✨ FLOW 7: Dealer Access Request System Verified Successfully!');
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

verifyAccessRequest();
