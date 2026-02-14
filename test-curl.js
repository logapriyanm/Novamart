
import jwt from 'jsonwebtoken';
import { exec } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { User, Session } from './src/server/models/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from root
dotenv.config({ path: path.join(__dirname, '.env') });

const secret = process.env.JWT_SECRET;
if (!secret) {
    console.error('❌ JWT_SECRET not found');
    process.exit(1);
}

// Generate token for a known SELLER ID (from previous debug-auth.js output if available, or a placeholder I found earlier)
// I'll use the ID found in the previous debug run or query it again if needed.
// For now, let's query the DB quickly to get a valid ID to be sure.
// Actually, I'll just use the debug-auth.js logic again but simpler.

import mongoose from 'mongoose';
import { User } from './src/server/models/index.js';

const run = async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    const user = await User.findOne({ role: 'SELLER', status: 'ACTIVE' });
    if (!user) {
        console.error('❌ No active SELLER found');
        process.exit(1);
    }
    await mongoose.disconnect();

    const token = jwt.sign(
        { id: user._id, role: user.role },
        secret,
        { expiresIn: '1h' }
    );

    // Create session in DB which is required by auth middleware
    await Session.create({
        userId: user._id,
        token: token,
        expiresAt: new Date(Date.now() + 3600000), // 1h
        ipAddress: '127.0.0.1',
        userAgent: 'test-curl'
    });
    console.log('✅ Created temporary session in DB');

    console.log(`Testing with User: ${user.email} (${user._id})`);

    // Test the endpoint
    const cmd = `curl.exe -s -o NUL -w "%{http_code}" -H "Authorization: Bearer ${token}" http://localhost:5002/api/seller/my-requests`;
    console.log(`Executing: ${cmd}`);

    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
        console.log(`HTTP STATUS: ${stdout}`);
    });
};

run();
