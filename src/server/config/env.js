import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env file
// Go up 3 levels: src/server/config -> src/server -> src -> root
dotenv.config({ path: path.join(__dirname, '../../../.env') });

const requiredEnvVars = [
    'MONGODB_URI',
    'JWT_SECRET',
    'REFRESH_SECRET',
    'GOOGLE_CLIENT_ID',
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET',
    'RAZORPAY_KEY_ID',
    'RAZORPAY_KEY_SECRET',
    'RAZORPAY_KEY_SECRET',
    'SMTP_USER',
    'SMTP_PASSWORD',
    'SMTP_HOST',
    'SMTP_PORT',
    'EMAIL_FROM'
];

export const validateEnv = () => {
    const missing = requiredEnvVars.filter(key => !process.env[key]);

    if (missing.length > 0) {
        console.error('❌ CRITICAL ERROR: Missing required environment variables:');
        missing.forEach(key => console.error(`   - ${key}`));
        // In production, we should exit. In dev, we might warn.
        if (process.env.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
};
