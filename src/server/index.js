import './env.js'; // MUST BE FIRST
import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './lib/logger.js';
import { authRateLimiter } from './middleware/rateLimiter.js';

// Route Imports
import authRoutes from './routes/auth/authRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import manufacturerRoutes from './routes/manufacturer/manufacturerRoutes.js';
import dealerRoutes from './routes/dealer/dealerRoutes.js';
import customerRoutes from './routes/customer/customerRoutes.js';
import trackingRoutes from './routes/tracking/trackingRoutes.js';
import chatRoutes from './routes/chat/chatRoutes.js';
import productRoutes from './routes/products/productRoutes.js';
import notificationRoutes from './routes/notifications.js';
import mongodbRoutes from './routes/mongodb.js';
import homeRoutes from './routes/home/homeRoutes.js';
import cmsRoutes from './routes/home/cmsRoutes.js';
import reviewRoutes from './routes/review/reviewRoutes.js';
import notificationService from './services/notificationService.js';
import { Message, Chat, User } from './models/index.js';
import ordersRouter from './routes/orders/index.js';
import paymentRoutes from './routes/payments/index.js';
import cartRoutes from './routes/cart/cartRoutes.js';
import escrowRoutes from './routes/escrow/escrowRoutes.js';
import verificationRoutes from './routes/verification/verificationRoutes.js';
import subscriptionRoutes from './routes/subscription/subscriptionRoutes.js';
import negotiationRoutes from './routes/negotiation/negotiationRoutes.js';
import userRoutes from './routes/users/index.js';
import mediaRoutes from './routes/media/mediaRoutes.js';
import poolingRoutes from './routes/pooling/poolingRoutes.js';
import collaborationRoutes from './routes/collaboration/collaborationRoutes.js';
import customManufacturingRoutes from './routes/customManufacturing/customManufacturingRoutes.js';
import customEscrowRoutes from './routes/customEscrow/customEscrowRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import sellerRoutes from './routes/sellers/sellerRoutes.js';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Inject IO into NotificationService
notificationService.setIO(io);

const PORT = process.env.PORT || 5002;

// Middleware
app.set('trust proxy', 1); // Trust first proxy for rate limiting (fixes IPv6 issues)
app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
    logger.info('INCOMING_REQUEST: %s %s', req.method, req.url);
    next();
});

app.use('/api/auth', authRoutes);

// Socket.IO Logic
io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth.token;
        if (!token) return next(new Error('Authentication error: No token provided'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
        const user = await User.findById(decoded.id)
            .populate('customer')
            .populate('dealer')
            .populate('manufacturer');

        if (!user) return next(new Error('Authentication error: User not found'));

        socket.user = user;
        next();
    } catch (err) {
        next(new Error('Authentication error: Invalid token'));
    }
});

io.on('connection', (socket) => {
    logger.info(`🔌 New Connection: ${socket.id} (User: ${socket.user.email})`);

    // Join personal room for notifications
    socket.join(socket.user.id);
    logger.info(`👤 User joined personal room: ${socket.user.id}`);

    socket.on('join-room', async (roomId) => {
        // Verify user is participant in this chat
        try {
            const chat = await Chat.findById(roomId);
            if (!chat) return logger.error(`Room ${roomId} not found`);

            const isParticipant = chat.participants.some(p => p.userId === socket.user.id);
            if (!isParticipant) return logger.error(`User ${socket.user.id} is not a participant in chat ${roomId}`);

            socket.join(roomId);
            logger.info(`👤 User joined room: ${roomId}`);
        } catch (err) {
            logger.error('Join Room Error:', err);
        }
    });

    socket.on('chat:message', async (data) => {
        try {
            const { chatId, message, messageType = 'TEXT' } = data;
            const senderId = socket.user.id;
            const senderRole = socket.user.role;

            // 1. Verify participation and chat status
            const chat = await Chat.findById(chatId);
            if (!chat || (chat.status !== 'OPEN' && messageType !== 'SYSTEM')) return;

            const isParticipant = chat.participants.some(p => p.userId === senderId);
            if (!isParticipant && senderRole !== 'ADMIN') return;

            // 2. Persist to MongoDB
            const newMessage = new Message({
                chatId,
                message,
                messageType,
                senderId,
                senderRole
            });
            await newMessage.save();

            // 3. Update Chat's last message
            await Chat.findByIdAndUpdate(chatId, {
                lastMessage: {
                    text: message,
                    senderId,
                    createdAt: new Date()
                },
                updatedAt: new Date()
            });

            // 4. Broadcast to Room
            io.to(chatId).emit('chat:message', newMessage);
        } catch (err) {
            logger.error('Chat Error:', err);
        }
    });

    socket.on('disconnect', () => {
        logger.info(`🚫 Disconnected: ${socket.id}`);
        // CRITICAL: Clean up all listeners to prevent memory leaks
        socket.removeAllListeners('join-room');
        socket.removeAllListeners('chat:message');
    });
});

// API Routes

// Register API routes
app.use('/api/admin', adminRoutes);
app.use('/api/manufacturer', manufacturerRoutes);
app.use('/api/dealer', dealerRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/tracking', trackingRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/products', productRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/mongodb', mongodbRoutes);

app.use('/api/cms', cmsRoutes);
app.use('/api/home', homeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/orders', ordersRouter);
app.use('/api/payments', paymentRoutes);
app.use('/api/escrow', escrowRoutes);
app.use('/api/verification', verificationRoutes);
app.use('/api/subscription', subscriptionRoutes);
app.use('/api/negotiation', negotiationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/pooling', poolingRoutes);
app.use('/api/collaboration', collaborationRoutes);
app.use('/api/custom-manufacturing', customManufacturingRoutes);
app.use('/api/custom-escrow', customEscrowRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/sellers', sellerRoutes);

// Health check route
app.get('/', (req, res) => {
    res.json({
        status: 'OK',
        message: 'NovaMart API v1.0.1',
        db: 'MongoDB (Mongoose)'
    });
});

// Database Connections (Non-blocking MongoDB)
// Global Error Handler
app.use((err, req, res, next) => {
    logger.error('Unhandled Exception:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method
    });

    res.status(err.status || 500).json({
        success: false,
        error: err.code || 'INTERNAL_SERVER_ERROR',
        message: process.env.NODE_ENV === 'production'
            ? 'An unexpected error occurred. Please contact support.'
            : err.message
    });
});

// Global Error Handlers to prevent crash
process.on('uncaughtException', (err) => {
    logger.error('🔥 Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    logger.error('🔥 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('exit', (code) => {
    logger.info(`💀 Process exiting with code: ${code}`);
});

const startServer = async () => {
    try {
        if (process.env.MONGODB_URI) {
            try {
                await mongoose.connect(process.env.MONGODB_URI, {
                    serverSelectionTimeoutMS: 5000,
                });
                logger.info('✅ Connected to MongoDB (Chat & Tracking)');
            } catch (err) {
                logger.error('⚠️ MongoDB Connection Failed (Chat/Tracking features limited):', err.message);
            }
        } else {
            logger.warn('⚠️ MONGODB_URI not found in environment variables. Skipped connection.');
        }

        httpServer.on('error', (err) => {
            logger.error('❌ Server Error:', err);
            process.exit(1);
        });

        httpServer.listen(PORT, () => {
            logger.info(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error('❌ Server startup failed:', error);
        process.exit(1);
    }
};

startServer();
