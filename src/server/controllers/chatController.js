import { Chat, Message } from '../models/index.js';
import prisma from '../lib/prisma.js';

const checkSubscription = async (userId, requiredTier = 'PRO') => {
    const dealer = await prisma.dealer.findUnique({
        where: { userId },
        include: {
            subscriptions: {
                where: { status: 'ACTIVE' },
                include: { plan: true },
                orderBy: { endDate: 'desc' },
                take: 1
            }
        }
    });

    if (!dealer) return false;
    const activeSub = dealer.subscriptions[0];
    if (!activeSub) return false;

    // Rank 1: BASIC, Rank 2: PRO, Rank 3: ENTERPRISE
    const tiers = { 'BASIC': 1, 'PRO': 2, 'ENTERPRISE': 3 };
    return tiers[activeSub.plan.name] >= tiers[requiredTier];
};

export const createChat = async (req, res) => {
    try {
        const { type, contextId, receiverId, receiverRole } = req.body;
        const senderId = req.user.id;
        const senderRole = req.user.role;

        // 1. Validate Roles (Strict Governance)
        if (senderRole === 'CUSTOMER' && receiverRole !== 'DEALER') {
            return res.status(403).json({ message: 'Customers can only chat with Dealers' });
        }

        // 2. Subscription Gating (B2B/Manufacturer Only)
        if (senderRole === 'DEALER' && receiverRole === 'MANUFACTURER') {
            // Only gate Dealer-Manufacturer chats, not Customer-Dealer
            const hasAccess = await checkSubscription(senderId, 'PRO');
            if (!hasAccess) {
                return res.status(403).json({
                    message: 'B2B Chat with Manufacturers requires a PRO or ENTERPRISE subscription.',
                    code: 'SUBSCRIPTION_REQUIRED'
                });
            }
        }

        // 2. Order Gating (Crucial)
        if (type === 'ORDER' && senderRole === 'CUSTOMER') {
            const order = await prisma.order.findUnique({
                where: { id: contextId },
                include: { items: true }
            });

            if (!order) {
                return res.status(404).json({ message: 'Order not found' });
            }

            if (order.customerId !== req.user.customer.id) {
                return res.status(403).json({ message: 'Unauthorized: You can only chat about your own orders' });
            }

            // Optional: Check if dealer involves in this order
            // (Order is one-to-one Dealer-Customer in this schema, so verify dealerId)
            // receiverId is userId, order.dealerId is dealer profile id.
            // Need to map receiverId (User) to Dealer or vice versa.
            // For now, assuming receiverId passed from frontend is the Dealer User ID.
            // Let's verify via Dealer model.
            const dealer = await prisma.dealer.findUnique({
                where: { userId: receiverId }
            });

            if (!dealer || dealer.id !== order.dealerId) {
                return res.status(403).json({ message: 'Unauthorized: Seller does not belong to this order' });
            }
        }

        // 2. Check for existing open chat of same type and context
        let chat = await Chat.findOne({
            type,
            contextId,
            'participants.userId': { $all: [senderId, receiverId] },
            status: 'OPEN'
        });

        if (!chat) {
            chat = new Chat({
                type,
                contextId,
                participants: [
                    { userId: senderId, role: senderRole },
                    { userId: receiverId, role: receiverRole }
                ]
            });
            await chat.save();
        }

        res.status(201).json({ success: true, data: chat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getChatList = async (req, res) => {
    try {
        const userId = req.user.id;
        const chats = await Chat.find({
            'participants.userId': userId
        }).sort({ updatedAt: -1 });

        res.json({ success: true, data: chats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        const isParticipant = chat.participants.some(p => p.userId === userId);
        if (!isParticipant) return res.status(403).json({ message: 'Unauthorized' });

        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 })
            .limit(50);

        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const closeChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user.id;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        const isParticipant = chat.participants.some(p => p.userId === userId);
        if (!isParticipant) return res.status(403).json({ message: 'Unauthorized' });

        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            status: 'CLOSED',
            closedAt: new Date()
        }, { new: true });

        res.json({ success: true, data: updatedChat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

