
import './src/server/env.js';
import mongoose from 'mongoose';
import { Manufacturer } from './src/server/models/index.js';

console.log('--- DEBUG START ---');

if (Manufacturer) {
    console.log('✅ Manufacturer model loaded successfully');
} else {
    console.error('❌ Manufacturer model FAILED to load');
}

const uri = process.env.MONGODB_URI;
console.log('MONGODB_URI is', uri ? 'SET' : 'MISSING');

if (!uri) {
    console.error('❌ Missing MONGODB_URI');
    process.exit(1);
}

console.log('Attempting to connect to MongoDB...');

try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB successfully');
} catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
}

console.log('--- DEBUG END ---');
process.exit(0);
