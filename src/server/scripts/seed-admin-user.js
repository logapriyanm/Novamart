import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User } from '../models/index.js';

dotenv.config();

const seedAdminUser = async () => {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        const email = 'admin@novamart.com';
        const password = 'Admin@123456';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`🔍 Checking for existing admin: ${email}`);
        let user = await User.findOne({ email });

        if (user) {
            console.log('User exists. Updating password and role to ADMIN...');
            user.password = hashedPassword;
            user.role = 'ADMIN';
            user.status = 'ACTIVE';
            await user.save();
            console.log('✅ Admin user updated.');
        } else {
            console.log('User not found. Creating new admin user...');
            const randomPhone = '9' + Math.floor(100000000 + Math.random() * 900000000);
            user = await User.create({
                email,
                phone: randomPhone,
                password: hashedPassword,
                role: 'ADMIN',
                status: 'ACTIVE'
            });
            console.log(`✅ Admin user created with phone: ${randomPhone}`);
        }

        console.log('🎉 Seed complete. You can now login with:');
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    }
};

seedAdminUser();
