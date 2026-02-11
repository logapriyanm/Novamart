import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env from project root
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const testCloudinary = async () => {
    console.log('🔍 Testing Cloudinary Configuration...');

    const config = {
        cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET ? '******' : undefined
    };

    console.log('Environment Variables Check:');
    console.log(`CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? '✅' : '❌'}`);
    console.log(`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: ${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✅' : '❌'}`);
    console.log(`CLOUDINARY_API_KEY: ${process.env.CLOUDINARY_API_KEY ? '✅' : '❌'}`);
    console.log(`CLOUDINARY_API_SECRET: ${process.env.CLOUDINARY_API_SECRET ? '✅' : '❌'}`);

    if (!config.cloud_name || !config.api_key || !process.env.CLOUDINARY_API_SECRET) {
        console.error('❌ Missing Cloudinary Credentials');
        process.exit(1);
    }

    cloudinary.config({
        cloud_name: config.cloud_name,
        api_key: config.api_key,
        api_secret: process.env.CLOUDINARY_API_SECRET,
        secure: true,
    });

    try {
        console.log('📡 Pinging Cloudinary API...');
        const result = await cloudinary.api.ping();
        console.log('✅ Cloudinary Connection Successful:', result);
    } catch (error) {
        console.error('❌ Cloudinary Connection Failed:', error.message);
        if (error.error) console.error('Details:', error.error);
    }
};

testCloudinary();
