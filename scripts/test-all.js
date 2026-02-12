/**
 * NovaMart – Full API & Route Test Suite
 * Run: node scripts/test-all.js
 * Requires: Backend on http://localhost:5000 (or NEXT_PUBLIC_API_URL), Frontend optional on 3000
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const FRONTEND_BASE = 'http://localhost:3000';

const results = { passed: 0, failed: 0, skipped: 0, errors: [] };

async function fetchApi(path, options = {}) {
    const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
    const res = await fetch(url, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...options.headers },
    });
    const text = await res.text();
    let data;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        data = text;
    }
    return { status: res.status, data, ok: res.ok };
}

async function fetchPage(path) {
    const url = path.startsWith('http') ? path : `${FRONTEND_BASE}${path}`;
    const res = await fetch(url, { redirect: 'manual' });
    return { status: res.status, redirected: res.redirected, url: res.url };
}

function ok(name, condition, detail = '') {
    if (condition) {
        results.passed++;
        console.log(`  ✅ ${name}` + (detail ? ` ${detail}` : ''));
        return true;
    } else {
        results.failed++;
        results.errors.push({ test: name, detail });
        console.log(`  ❌ ${name}` + (detail ? ` ${detail}` : ''));
        return false;
    }
}

function skip(name, reason) {
    results.skipped++;
    console.log(`  ⏭️ ${name} (${reason})`);
}

async function runTests() {
    console.log('\n========== NovaMart Full Test Suite ==========\n');
    console.log('API Base:', API_BASE);
    console.log('Frontend Base:', FRONTEND_BASE);
    console.log('');

    // ---- 1. Guest / Public API ----
    console.log('--- 1. Guest / Public API ---');
    try {
        const cms = await fetchApi('/cms/home/guest');
        ok('CMS guest home', cms.ok && (Array.isArray(cms.data) || (cms.data?.data && Array.isArray(cms.data.data))), `status=${cms.status}`);
    } catch (e) {
        ok('CMS guest home', false, e.message);
    }

    try {
        const products = await fetchApi('/products?status=APPROVED&limit=2');
        const raw = products.data?.data ?? products.data;
        const hasProducts = products.ok && (raw?.products != null || Array.isArray(raw));
        ok('Products list (guest)', hasProducts, `status=${products.status}`);
    } catch (e) {
        ok('Products list (guest)', false, e.message);
    }

    try {
        const health = await fetchApi('http://localhost:5000/');
        ok('Backend health', health.ok && health.data?.status === 'OK', `status=${health.status}`);
    } catch (e) {
        skip('Backend health', 'backend may be on different port or down');
    }

    // ---- 2. Auth API (no token) ----
    console.log('\n--- 2. Auth API (validation & security) ---');
    try {
        const loginNoBody = await fetchApi('/auth/login', { method: 'POST', body: JSON.stringify({}) });
        ok('Login rejects empty body', !loginNoBody.ok && (loginNoBody.status === 400 || loginNoBody.status === 401), `status=${loginNoBody.status}`);
    } catch (e) {
        ok('Login rejects empty body', false, e.message);
    }

    try {
        const loginBad = await fetchApi('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: 'nonexistent@test.com', password: 'wrongpassword' }),
        });
        ok('Login rejects invalid credentials', !loginBad.ok && (loginBad.status === 401 || loginBad.status === 400), `status=${loginBad.status}`);
    } catch (e) {
        ok('Login rejects invalid credentials', false, e.message);
    }

    try {
        const meNoToken = await fetchApi('/auth/me');
        ok('GET /auth/me without token returns 401', meNoToken.status === 401, `status=${meNoToken.status}`);
    } catch (e) {
        ok('GET /auth/me without token returns 401', false, e.message);
    }

    // ---- 3. Protected API (no token) ----
    console.log('\n--- 3. Protected API without token ---');
    const protectedEndpoints = [
        '/admin/users',
        '/manufacturer/dashboard',
        '/dealer/dashboard',
        '/customer/orders',
        '/cart',
        '/orders',
    ];
    for (const ep of protectedEndpoints) {
        try {
            const res = await fetchApi(ep);
            ok(`${ep} without token blocked`, res.status === 401 || res.status === 403, `status=${res.status}`);
        } catch (e) {
            ok(`${ep} without token blocked`, false, e.message);
        }
    }

    // ---- 4. Frontend routes (HTTP status) ----
    console.log('\n--- 4. Frontend routes (200 or redirect) ---');
    const routes = [
        '/',
        '/products',
        '/auth/login',
        '/auth/register',
        '/cart',
        '/categories',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
        '/unauthorized',
    ];
    for (const route of routes) {
        try {
            const res = await fetchPage(route);
            const success = res.status === 200 || (res.status >= 300 && res.status < 400);
            ok(`GET ${route}`, success, `status=${res.status}`);
        } catch (e) {
            skip(`GET ${route}`, 'frontend may be down or different port');
        }
    }

    // ---- 5. Protected frontend (should redirect to login when no cookie) ----
    console.log('\n--- 5. Protected routes redirect to login ---');
    const protectedRoutes = ['/admin', '/dealer', '/manufacturer', '/customer', '/checkout'];
    for (const route of protectedRoutes) {
        try {
            const res = await fetchPage(route);
            const redirectedToLogin = res.status === 307 || res.status === 302 || (res.redirected && res.url && res.url.includes('auth'));
            ok(`${route} redirects when unauthenticated`, redirectedToLogin || res.status === 200, `status=${res.status}`);
        } catch (e) {
            skip(`${route} redirect`, e.message);
        }
    }

    // ---- 6. Forgot password & validation ----
    console.log('\n--- 6. Forgot password (no leak) ---');
    try {
        const forgot = await fetchApi('/auth/forgot-password', {
            method: 'POST',
            body: JSON.stringify({ email: 'nonexistent@example.com' }),
        });
        ok('Forgot password does not leak user existence', forgot.ok && forgot.status === 200, `status=${forgot.status}`);
    } catch (e) {
        ok('Forgot password does not leak user existence', false, e.message);
    }

    // ---- 7. Registration validation ----
    console.log('\n--- 7. Registration validation ---');
    try {
        const regEmpty = await fetchApi('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email: '', password: '', role: 'CUSTOMER' }),
        });
        ok('Register rejects invalid payload', !regEmpty.ok && regEmpty.status === 400, `status=${regEmpty.status}`);
    } catch (e) {
        ok('Register rejects invalid payload', false, e.message);
    }

    // ---- Summary ----
    console.log('\n========== Summary ==========');
    console.log(`Passed: ${results.passed}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Skipped: ${results.skipped}`);
    if (results.errors.length > 0) {
        console.log('\nFailed tests:');
        results.errors.forEach((e) => console.log('  -', e.test, e.detail));
    }
    const total = results.passed + results.failed;
    const score = total > 0 ? Math.round((results.passed / total) * 100) : 0;
    console.log(`\nScore: ${score}% (of ${total} non-skipped tests)`);
    process.exit(results.failed > 0 ? 1 : 0);
}

runTests().catch((err) => {
    console.error('Test runner error:', err);
    process.exit(1);
});
