import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import prisma from './lib/prisma.js';

// Route Imports
import authRoutes from './routes/auth/authRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import manufacturerRoutes from './routes/manufacturer/manufacturerRoutes.js';
import dealerRoutes from './routes/dealer/dealerRoutes.js';
import customerRoutes from './routes/customer/customerRoutes.js';
import trackingRoutes from './routes/tracking/trackingRoutes.js';
import chatRoutes from './routes/chat/chatRoutes.js';
import productRoutes from './routes/products/productRoutes.js';
import mongodbRoutes from './routes/mongodb.js';
import { Message, Chat } from './models/index.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log(`🔌 New Connection: ${socket.id}`);

    socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`👤 User joined room: ${roomId}`);
    });

    socket.on('chat:message', async (data) => {
        try {
            const { chatId, message, senderId, senderRole } = data;

            // 1. Persist to MongoDB
            const newMessage = new Message({
                chatId,
                message,
                senderId,
                senderRole
            });
            await newMessage.save();

            // 2. Update Chat's last message
            await Chat.findByIdAndUpdate(chatId, {
                lastMessage: {
                    text: message,
                    senderId,
                    createdAt: new Date()
                }
            });

            // 3. Broadcast to Room
            io.to(chatId).emit('chat:message', newMessage);
        } catch (error) {
            console.error('❌ Socket Message Error:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`🚫 Disconnected: ${socket.id}`);
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/manufacturer', manufacturerRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/mongodb', mongodbRoutes);

app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Novamart API + Socket.IO is running',
        db: 'PostgreSQL Connected (Prisma)'
    });
});

// Database Connections (Non-blocking MongoDB)
const startServer = async () => {
    try {
        if (process.env.MONGODB_URI) {
            mongoose.connect(process.env.MONGODB_URI, {
                serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
            })
                .then(() => console.log('✅ Connected to MongoDB (Chat & Tracking)'))
                .catch(err => console.error('⚠️ MongoDB Connection Failed:', err.message));
        }

        httpServer.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('❌ Server startup failed:', error);
    }
};

startServer();

