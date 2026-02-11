import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const testFlow1 = async () => {
    console.log('--- Starting Flow 1: Authentication & Session Management ---');

    let testUser = {
        email: `test_customer_${Date.now()}@example.com`,
        phone: `9876543${Math.floor(Math.random() * 1000)}`,
        password: 'Password123!',
        role: 'CUSTOMER',
        name: 'Test Customer'
    };

    try {
        // 1. REGISTER
        console.log('\n[1.1] Testing Registration (CUSTOMER)...');
        const regRes = await axios.post(`${API_URL}/auth/register`, testUser);
        console.log('✅ Registration Success:', regRes.data.success);
        const { token, refreshToken } = regRes.data.data;
        console.log('   Tokens received:', { token: token.substring(0, 10) + '...', refreshToken: refreshToken.substring(0, 10) + '...' });

        // 2. REFRESH TOKEN
        console.log('\n[1.2] Testing Refresh Token...');
        const refreshRes = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        console.log('✅ Refresh Success:', refreshRes.data.success);
        const newToken = refreshRes.data.data.token;
        console.log('   New Token received:', newToken.substring(0, 10) + '...');

        // 3. GET ME (Self Profile)
        console.log('\n[1.3] Testing getCurrentUser...');
        const meRes = await axios.get(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${newToken}` }
        });
        console.log('✅ Current User:', meRes.data.data.email);

        // 4. LOGOUT
        console.log('\n[1.4] Testing Logout...');
        const logoutRes = await axios.post(`${API_URL}/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${newToken}` }
        });
        console.log('✅ Logout Success:', logoutRes.data.success);

        // 5. LOGIN (Standard)
        console.log('\n[1.5] Testing Login (Email/Password)...');
        const loginRes = await axios.post(`${API_URL}/auth/login`, {
            email: testUser.email,
            password: testUser.password
        });
        console.log('✅ Login Success:', loginRes.data.success);
        const loginToken = loginRes.data.data.token;
        console.log('   Login Token:', loginToken.substring(0, 10) + '...');

        // 6. OTP FLOW (MOCK)
        console.log('\n[1.6] Testing OTP Send...');
        const otpSendRes = await axios.post(`${API_URL}/auth/otp/send`, { phone: testUser.phone });
        console.log('✅ OTP Send success:', otpSendRes.data.success);
        // Note: OTP verification requires manual reading from console or DB since it's mock/whatsapp based.

        // 7. REGISTER DEALER
        console.log('\n[1.7] Testing Registration (DEALER)...');
        const dealerData = {
            email: `test_dealer_${Date.now()}@example.com`,
            phone: `9876544${Math.floor(Math.random() * 1000)}`,
            password: 'Password123!',
            role: 'DEALER',
            businessName: 'Test Dealer Corp',
            gstNumber: `GST${Date.now()}D`,
            businessAddress: '123 Dealer St, City',
            bankDetails: { accountNo: '123456789', bankName: 'Test Bank' }
        };
        const dealerRegRes = await axios.post(`${API_URL}/auth/register`, dealerData);
        console.log('✅ Dealer Registration Success:', dealerRegRes.data.success);
        console.log('   Dealer Status:', dealerRegRes.data.data.user.status);

        // 8. REGISTER MANUFACTURER
        console.log('\n[1.8] Testing Registration (MANUFACTURER)...');
        const manuData = {
            email: `test_manu_${Date.now()}@example.com`,
            phone: `9876545${Math.floor(Math.random() * 1000)}`,
            password: 'Password123!',
            role: 'MANUFACTURER',
            companyName: 'Test Manu Inc',
            registrationNo: `REG${Date.now()}M`,
            factoryAddress: '456 Manu Rd, Industrial Area',
            gstNumber: `GST${Date.now()}M`,
            bankDetails: { accountNo: '987654321', bankName: 'Manu Bank' }
        };
        const manuRegRes = await axios.post(`${API_URL}/auth/register`, manuData);
        console.log('✅ Manufacturer Registration Success:', manuRegRes.data.success);
        console.log('   Manufacturer Status:', manuRegRes.data.data.user.status);

        console.log('\n--- Flow 1 API Tests Passed! ---');

    } catch (error) {
        console.error('❌ Flow 1 Test Failed at step:');
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', JSON.stringify(error.response.data, null, 2));
        } else {
            console.error('   Error Message:', error.message);
        }
        process.exit(1);
    }
};

testFlow1();
