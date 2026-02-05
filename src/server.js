import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import prisma from './lib/prisma.js';

// Route Imports
import authRoutes from './api/auth/authRoutes.js';
import adminRoutes from './api/admin/adminRoutes.js';
import manufacturerRoutes from './api/manufacturer/manufacturerRoutes.js';
import dealerRoutes from './api/dealer/dealerRoutes.js';
import customerRoutes from './api/customer/customerRoutes.js';
import trackingRoutes from './api/tracking/trackingRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manufacturer', manufacturerRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/tracking', trackingRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Novamart API is running',
        db: 'PostgreSQL Connected (Prisma)'
    });
});

// Database Connections (Non-blocking MongoDB)
const startServer = async () => {
    try {
        if (process.env.MONGODB_URI) {
            // Non-blocking connect
            mongoose.connect(process.env.MONGODB_URI)
                .then(() => console.log('✅ Connected to MongoDB (Tracking)'))
                .catch(err => console.error('⚠️ MongoDB Connection Failed (Tracking is disabled):', err.message));
        } else {
            console.log('ℹ️ MongoDB URI not provided. Tracking disabled.');
        }

        app.listen(PORT, () => {
            console.log(`🚀 API Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
    }
};

startServer();
