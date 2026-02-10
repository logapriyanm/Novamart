import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

const API_URL = 'http://localhost:5000/api';
const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';
const prisma = new PrismaClient();

async function createTestUser(email, role, status = 'ACTIVE', adminRole = null) {
    const password = 'Password123!';
    const user = await prisma.user.upsert({
        where: { email },
        update: { role, status, adminRole },
        create: {
            email,
            password: 'hashed_password_placeholder', // Not checking password for these tests
            role,
            status,
            adminRole,
            phone: Math.floor(Math.random() * 1000000000).toString()
        }
    });

    // Generate Token
    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

    // Create Session in DB
    await prisma.session.upsert({
        where: { token: token },
        update: {},
        create: {
            userId: user.id,
            token: token,
            expiresAt: new Date(Date.now() + 3600000)
        }
    });

    return token;
}

async function testAccess(token, endpoint, expectedStatus, label) {
    try {
        console.log(`Testing ${label} -> ${endpoint}...`);
        const response = await axios.get(`${API_URL}${endpoint}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (response.status === expectedStatus) {
            console.log(`✅ Success: Received ${response.status} as expected.`);
        } else {
            console.error(`❌ Failure: Expected ${expectedStatus}, but got ${response.status}`);
        }
    } catch (error) {
        if (error.response && error.response.status === expectedStatus) {
            console.log(`✅ Success: Received ${expectedStatus} (${error.response.data.error || 'Blocked'}) as expected.`);
        } else {
            console.error(`❌ Failure: Expected ${expectedStatus}, but got ${error.response ? error.response.status : error.message}`);
            if (error.response) console.error('Response Data:', error.response.data);
        }
    }
}

async function verifyRBAC() {
    console.log('🚀 Starting RBAC Verification...');

    try {
        // Setup Users
        const customerToken = await createTestUser('test_customer_rbac@novamart.com', 'CUSTOMER');
        const manufacturerPendingToken = await createTestUser('test_mfr_pending@novamart.com', 'MANUFACTURER', 'PENDING');
        const manufacturerActiveToken = await createTestUser('test_mfr_active@novamart.com', 'MANUFACTURER', 'ACTIVE');
        const adminSuperToken = await createTestUser('test_admin_super@novamart.com', 'ADMIN', 'ACTIVE', 'SUPER_ADMIN');
        const adminFinanceToken = await createTestUser('test_admin_finance@novamart.com', 'ADMIN', 'ACTIVE', 'FINANCE_ADMIN');

        console.log('\n--- Scenario 1: Cross-Role Blocking ---');
        // Customer should not access Admin Stats
        await testAccess(customerToken, '/admin/stats', 403, 'Customer trying Admin');
        // Customer should not access Manufacturer Profile
        await testAccess(customerToken, '/manufacturer/profile', 403, 'Customer trying Manufacturer');

        console.log('\n--- Scenario 2: Account Status Blocking ---');
        // Pending Manufacturer should be blocked from protected routes
        await testAccess(manufacturerPendingToken, '/manufacturer/profile', 403, 'Pending Mfr trying Profile');
        // Active Manufacturer should have access
        await testAccess(manufacturerActiveToken, '/manufacturer/profile', 200, 'Active Mfr trying Profile');

        console.log('\n--- Scenario 3: Granular Admin Roles ---');
        // Finance Admin trying to access General Stats (Allowed)
        await testAccess(adminFinanceToken, '/admin/stats', 200, 'Finance Admin trying Stats');
        // Finance Admin trying to access Users (Blocked - only SUPER/OPS)
        await testAccess(adminFinanceToken, '/admin/users', 403, 'Finance Admin trying Users');
        // Super Admin trying to access Users (Allowed)
        await testAccess(adminSuperToken, '/admin/users', 200, 'Super Admin trying Users');

        console.log('\n✨ RBAC Verification Completed!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Verification Error:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

verifyRBAC();
