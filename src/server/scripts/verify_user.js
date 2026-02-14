import '../env.js';
import mongoose from 'mongoose';
import { User } from '../models/index.js';
import bcrypt from 'bcryptjs';

const email = process.argv[2];
const password = process.argv[3];

const run = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            console.error('MONGODB_URI is missing');
            process.exit(1);
        }
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB');

        if (!email) {
            console.log('No email provided. Listing last 5 users:');
            const users = await User.find().sort({ createdAt: -1 }).limit(5);
            users.forEach(u => {
                console.log(`- ${u.email} (Role: ${u.role}, Status: ${u.status})`);
            });
            console.log('\nUsage: node verify_user.js <email> <password> to verify credentials');
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            console.log(`❌ User not found: ${email}`);
            return;
        }

        console.log(`User found: ID=${user._id}, Role=${user.role}, Status=${user.status}`);

        if (!password) {
            console.log('No password provided for verification.');
            return;
        }

        if (!user.password) {
            console.log('⚠️ User has no password set (possibly social login only)');
        } else {
            const match = await bcrypt.compare(password, user.password);
            if (match) {
                console.log('✅ Password matches!');
            } else {
                console.log('❌ Password does NOT match.');
                // console.log('Stored hash:', user.password);
            }
        }
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

run();
