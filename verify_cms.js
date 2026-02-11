
import http from 'http';

const API_BASE = 'http://localhost:5000/api/cms/home/guest';

function getCMS() {
    return new Promise((resolve, reject) => {
        http.get(API_BASE, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', (err) => reject(err));
    });
}

async function verify() {
    console.log('🚀 Starting CMS Verification (ESM)...');
    try {
        const data = await getCMS();
        console.log(`✅ Connection Success! Found ${data.data.length} sections.`);

        // Audit roles
        const nonGuest = data.data.filter(s => !s.visibleFor.includes('GUEST'));
        if (nonGuest.length > 0) {
            console.log('❌ Error: Found non-guest sections in Guest API!');
        } else {
            console.log('✅ Role Filtering: OK (Guest API clean)');
        }

        // Audit SEO
        const seoSection = data.data.find(s => s.seo?.metaTitle);
        console.log(`✅ SEO Title Audit: ${seoSection ? seoSection.seo.metaTitle : 'Default Title active'}`);

        // Placeholder check
        const placeholders = data.data.filter(s => s.title?.includes('{{') || s.subtitle?.includes('{{'));
        console.log(`✅ Placeholders detected in ${placeholders.length} sections.`);

        console.log('\n--- CMS READY ---');
    } catch (e) {
        console.log('❌ Failed:', e.message);
    }
}

verify();
