import './env.js'; // MUST BE FIRST
import express from 'express';
import { validateEnv } from './config/env.js';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import logger from './lib/logger.js';
import { authRateLimiter } from './middleware/rateLimiter.js';

// Route Imports
import authRoutes from './routes/auth/authRoutes.js';
import adminRoutes from './routes/admin/adminRoutes.js';
import manufacturerRoutes from './routes/manufacturer/manufacturerRoutes.js';
import sellerRoutes from './routes/seller/sellerRoutes.js';
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
import './subscribers/emailSubscriber.js'; // Initialize Email Subscriber
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
import analyticsRoutes from './routes/analyticsRoutes.js';


const app = express();
const httpServer = createServer(app);

// === CORS Configuration ===
const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5000',
    process.env.FRONTEND_URL,
    process.env.NEXT_PUBLIC_FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (ALLOWED_ORIGINS.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Audit-Reason'],
};

const io = new Server(httpServer, {
    cors: {
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST'],
        credentials: true,
    }
});

// Inject IO into NotificationService
notificationService.setIO(io);

const PORT = process.env.PORT || 5002;

// === Security Middleware ===
app.set('trust proxy', 1); // Trust first proxy for rate limiting (fixes IPv6 issues)
app.use(helmet());                         // HTTP security headers (X-Frame-Options, HSTS, etc.)
app.use(cors(corsOptions));                // Restricted CORS
app.use(express.json({ limit: '10mb' })); // Body parser with size limit
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Standard URL-encoded parser
app.use(mongoSanitize()); // Prevent NoSQL injection ($gt, $ne, etc.)
app.use(xss()); // Sanitize user input against XSS
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

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
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
app.use('/api/seller', sellerRoutes);
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
app.use('/api/analytics', analyticsRoutes);
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


// Log all routes
function printRoutes(stack, prefix = '') {
    stack.forEach((r) => {
        if (r.route && r.route.path) {
            // Route logic
        } else if (r.name === 'router' && r.handle.stack) {
            printRoutes(r.handle.stack, prefix + r.regexp.source.replace('\\/?(?=\\/|$)', '').replace('^\\', '').replace('\\/', '/'));
        }
    });
}
printRoutes(app._router.stack);

// Health check route
app.get('/test-route', (req, res) => res.json({ success: true, message: 'Server is updating!' }));

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
        // === Startup Security Checks ===
        if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
            logger.error('🔴 FATAL: JWT_SECRET is missing or too short (min 32 chars). Server cannot start securely.');
            process.exit(1);
        }

        if (process.env.NODE_ENV === 'production') {
            if (!process.env.RAZORPAY_KEY_ID) {
                logger.warn('⚠️ RAZORPAY_KEY_ID not set. Payments will run in mock mode.');
            }
        }

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

