import http from 'http';

const PORT = 5002;
const BASE_URL = `http://localhost:${PORT}`;

function request(path, options = {}) {
    return new Promise((resolve, reject) => {
        const req = http.request(`${BASE_URL}${path}`, {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        }, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, data: JSON.parse(data) });
                } catch {
                    resolve({ status: res.statusCode, data });
                }
            });
        });

        req.on('error', reject);

        if (options.body) {
            req.write(JSON.stringify(options.body));
        }
        req.end();
    });
}

async function run() {
    console.log('Running Critical Smoke Tests...\n');

    try {
        // 1. Health Check
        console.log('[1] Checking Server Health...');
        try {
            const health = await request('/');
            console.log(`    Status: ${health.status} ${health.status === 200 ? '✅' : '❌'}`);
        } catch (e) {
            console.log('    Failed to connect to server. Is it running?');
            process.exit(1);
        }

        // 2. RBAC Check - Admin Route without Token
        console.log('\n[2] Checking RBAC (Admin Route without Token)...');
        const rbac = await request('/api/escrow/admin/all');
        if (rbac.status === 401 || rbac.status === 403) {
            console.log(`    Status: ${rbac.status} (Access Denied) ✅`);
        } else {
            console.log(`    Status: ${rbac.status} (Unexpected) ❌`);
        }

        // 3. Auth Check - Invalid Login
        console.log('\n[3] Checking Auth (Invalid Credentials)...');
        const login = await request('/api/auth/login', {
            method: 'POST',
            body: { email: 'fake@example.com', password: 'wrong' }
        });
        if (login.status === 401 || login.status === 400) {
            console.log(`    Status: ${login.status} (Rejected) ✅`);
        } else {
            console.log(`    Status: ${login.status} (Unexpected) ❌`);
        }

        console.log('\nSmoke Tests Complete.');

    } catch (error) {
        console.error('Test Failed:', error);
    }
}

run();
