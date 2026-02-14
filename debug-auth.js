
import './src/server/env.js';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User, Seller, Session } from './src/server/models/index.js';

console.log('--- DEBUG AUTH START ---');

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@'));
        console.log('✅ Connected to MongoDB');

        // 1. Find a Seller User
        const sellerUser = await User.findOne({ role: 'SELLER' }).populate('seller');
        if (!sellerUser) {
            console.error('❌ No SELLER user found in database');
            process.exit(1);
        }

        console.log(`FOUND USER: ${sellerUser.email} (ID: ${sellerUser._id})`);
        console.log(`ROLE: ${sellerUser.role}`);
        console.log(`STATUS: ${sellerUser.status}`);

        if (sellerUser.seller) {
            console.log(`SELLER PROFILE: ${sellerUser.seller._id}`);
        } else {
            console.log('❌ User has SELLER role but no linked Seller profile');
        }

        // 2. Generate a valid token for this user
        const token = jwt.sign(
            { id: sellerUser._id, role: sellerUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );
        console.log(JSON.stringify({ VALID_TOKEN: token }));

        // 3. Create a Dummy Session (since auth middleware checks it)
        await Session.deleteMany({ userId: sellerUser._id }); // Clear old
        await Session.create({
            userId: sellerUser._id,
            token: token,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            ipAddress: '127.0.0.1',
            userAgent: 'Debug Script'
        });
        console.log('✅ Created active session for user');

        // 4. Test Verification
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('✅ Token verification passed locally');

            // Check Session
            const session = await Session.findOne({ token });
            if (session && session.expiresAt > new Date()) {
                console.log('✅ Session verification passed');
            } else {
                console.error('❌ Session verification FAILED (Missing or Expired)');
            }

        } catch (e) {
            console.error('❌ Token verification FAILED:', e.message);
        }

        console.log('\n--- CURL COMMAND TO TEST ---');
        console.log(`curl.exe -v -H "Authorization: Bearer ${token}" http://localhost:5002/api/seller/my-requests`);

    } catch (error) {
        console.error('❌ Script Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('--- DEBUG AUTH END ---');
        process.exit(0);
    }
};

run();
