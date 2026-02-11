
import mongoose from 'mongoose';
import HomePageCMS from './src/server/models/HomePageCMS.js';
import dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/novamart';

async function auditCMS() {
    try {
        await mongoose.connect(MONGO_URI);
        const count = await HomePageCMS.countDocuments();
        console.log(`--- CMS Audit ---`);
        console.log(`Total Sections: ${count}`);

        if (count > 0) {
            const sections = await HomePageCMS.find().sort({ order: 1 });
            sections.forEach(s => {
                console.log(`- [${s.isActive ? 'ACTIVE' : 'INACTIVE'}] ${s.title} (${s.sectionKey}) - Order: ${s.order}`);
            });
        } else {
            console.log('⚠️ CMS is EMPTY. Seeding might be required.');
        }

        await mongoose.disconnect();
    } catch (err) {
        console.error('Error:', err);
    }
}

auditCMS();
