
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';
let adminToken = '';

async function loginAsAdmin() {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, {
            email: 'admin@test.com',
            password: 'Admin@123'
        });
        adminToken = res.data.data.token;
        // console.log('✅ Admin Login Successful');
    } catch (error) {
        console.error('❌ Admin Login Failed:', error.response?.data || error.message);
        process.exit(1);
    }
}

async function testCMSFlow() {
    await loginAsAdmin();
    const headers = { Authorization: `Bearer ${adminToken}` };

    // 1. Get all sections
    let res = await axios.get(`${BASE_URL}/cms/admin/all`, { headers });
    // console.log(`✅ Fetched ${res.data.data.length} sections`);

    // 2. Create a test section
    const testSection = {
        sectionKey: 'test_validation_section',
        title: 'Validation Test Section',
        componentName: 'TrustStrip',
        order: 999,
        visibleFor: ['GUEST'],
        isActive: true,
        content: { items: [{ title: "Verified", text: "API works" }] }
    };
    res = await axios.post(`${BASE_URL}/cms/admin`, testSection, { headers });
    const sectionId = res.data.data._id;
    // console.log(`✅ Created test section with ID: ${sectionId}`);

    // 3. Update visibility
    res = await axios.put(`${BASE_URL}/cms/admin/${sectionId}`, { isActive: false }, { headers });
    // console.log(`✅ Updated visibility (isActive: false)`);

    // 4. Update content/SEO
    res = await axios.put(`${BASE_URL}/cms/admin/${sectionId}`, {
        title: 'Updated Title',
        seo: { metaTitle: 'SEO Title Test', metaDescription: 'SEO Desc Test' }
    }, { headers });
    // console.log(`✅ Updated Title and SEO Metadata`);

    // 5. Verify guest view reflects changes
    res = await axios.get(`${BASE_URL}/cms/home/guest`);
    const found = res.data.data.find(s => s.sectionKey === 'test_validation_section');
    if (found) {
        console.error('❌ Test section still visible in guest view even though isActive=false');
    } else {
        // console.log('✅ Test section hidden from guest view as expected');
    }

    // 6. Delete test section (cleanup)
    // Note: If delete is not implemented, just disable it permanently or use a unique key
    // console.log('ℹ️ CMS Delete not implemented in route mapping, leaving disabled.');

    // console.log('\n--- CMS E2E API Verification Complete ---');
}

testCMSFlow();
