import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { User, Customer } from '../models/index.js';

dotenv.config();

const seedTestUser = async () => {
    try {
        console.log('🌱 Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        const email = 'testcustomer@gmail.com';
        const password = 'Test@123456';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(`🔍 Checking for existing user: ${email}`);
        let user = await User.findOne({ email });

        if (user) {
            console.log('User exists. Updating password...');
            user.password = hashedPassword;
            user.role = 'CUSTOMER';
            user.status = 'ACTIVE';
            await user.save();
            console.log('✅ User updated.');
        } else {
            console.log('User not found. Creating new user...');
            const randomPhone = '9' + Math.floor(100000000 + Math.random() * 900000000);
            user = await User.create({
                email,
                phone: randomPhone,
                password: hashedPassword,
                role: 'CUSTOMER',
                status: 'ACTIVE'
            });
            console.log(`✅ User created with phone: ${randomPhone}`);
        }

        // Ensure Customer Profile exists
        const customer = await Customer.findOne({ userId: user._id });
        if (!customer) {
            console.log('Creating customer profile...');
            await Customer.create({
                userId: user._id,
                name: 'Test Customer'
            });
            console.log('✅ Customer profile created.');
        } else {
            console.log('✅ Customer profile already exists.');
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

seedTestUser();
