
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novamart';

async function resetPassword() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ email: String, password: String }));
        const hashedPassword = await bcrypt.hash('Admin@123', 10);
        const result = await User.updateOne({ email: 'admin@test.com' }, { password: hashedPassword });
        if (result.matchedCount > 0) {
            console.log('✅ Password reset successful for admin@test.com');
        } else {
            console.log('❌ User admin@test.com not found');
        }
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

resetPassword();
