
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novamart';

async function checkAdmin() {
    try {
        await mongoose.connect(MONGO_URI);
        const User = mongoose.model('User', new mongoose.Schema({ email: String, role: String, status: String }));
        const admins = await User.find({ role: 'ADMIN' });
        console.log('--- Registered Admins ---');
        admins.forEach(a => console.log(`Email: ${a.email}, Role: ${a.role}, Status: ${a.status}`));
        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

checkAdmin();
