import { Chat, Message, Seller, Manufacturer, Order, Negotiation, SellerSubscription, Customer } from '../models/index.js';
import mongoose from 'mongoose';

const checkSubscription = async (userId, requiredTier = 'PRO') => {
    const seller = await Seller.findOne({ userId });
    if (!seller) return false;

    const activeSub = await SellerSubscription.findOne({
        sellerId: seller._id,
        status: 'ACTIVE'
    }).populate('planId').sort({ endDate: -1 });

    if (!activeSub || !activeSub.planId) return false;

    const tiers = { 'BASIC': 1, 'PRO': 2, 'ENTERPRISE': 3 };
    return tiers[activeSub.planId.name] >= tiers[requiredTier];
};

export const createChat = async (req, res) => {
    try {
        const { type, contextId, receiverId, receiverRole } = req.body;
        const senderId = req.user._id;
        const senderRole = req.user.role;

        if (senderRole === 'CUSTOMER' && receiverRole !== 'SELLER') {
            return res.status(403).json({ message: 'Customers can only chat with Sellers' });
        }

        if ((senderRole === 'SELLER' && receiverRole === 'MANUFACTURER') ||
            (senderRole === 'MANUFACTURER' && receiverRole === 'SELLER')) {

            const sellerId = senderRole === 'SELLER' ? req.user.seller?._id : (await Seller.findOne({ userId: receiverId }))?._id;
            const mfrId = senderRole === 'MANUFACTURER' ? req.user.manufacturer?._id : (await Manufacturer.findOne({ userId: receiverId }))?._id;

            if (!sellerId || !mfrId) {
                return res.status(404).json({ message: 'Seller or Manufacturer profile not found' });
            }

            const seller = await Seller.findById(sellerId);
            if (type !== 'NEGOTIATION') {
                const isApproved = seller?.approvedBy?.some(id => id.toString() === mfrId.toString());
                if (!isApproved) {
                    return res.status(403).json({
                        message: 'Official partnership required to initiate chat.',
                        code: 'PARTNERSHIP_REQUIRED'
                    });
                }
            }

            if (senderRole === 'SELLER' && type !== 'NEGOTIATION') {
                const hasAccess = await checkSubscription(senderId, 'PRO');
                if (!hasAccess) {
                    return res.status(403).json({
                        message: 'B2B Chat with Manufacturers requires a PRO or ENTERPRISE subscription.',
                        code: 'SUBSCRIPTION_REQUIRED'
                    });
                }
            }
        }

        if (type === 'ORDER') {
            const order = await Order.findById(contextId);
            if (!order) return res.status(404).json({ message: 'Order not found' });

            const customer = await Customer.findOne({ userId: senderRole === 'CUSTOMER' ? senderId : receiverId });
            const seller = await Seller.findOne({ userId: senderRole === 'SELLER' ? senderId : receiverId });

            if (order.customerId.toString() !== customer?._id.toString() || order.sellerId.toString() !== seller?._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized: Participation in order required' });
            }
        }

        if (type === 'NEGOTIATION') {
            const negotiation = await Negotiation.findById(contextId);
            if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

            const seller = await Seller.findOne({ userId: senderRole === 'SELLER' ? senderId : receiverId });
            const mfr = await Manufacturer.findOne({ userId: senderRole === 'MANUFACTURER' ? senderId : receiverId });

            if (negotiation.sellerId.toString() !== seller?._id.toString() || negotiation.manufacturerId.toString() !== mfr?._id.toString()) {
                return res.status(403).json({ message: 'Unauthorized: Participation in negotiation required' });
            }
        }

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
        const userId = req.user._id;
        const userRole = req.user.role;

        let query = { 'participants.userId': userId };

        if (userRole === 'ADMIN') {
            query = {};
        }

        const chats = await Chat.find(query).sort({ updatedAt: -1 });

        res.json({ success: true, data: chats });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        const isParticipant = chat.participants.some(p => p.userId.toString() === userId.toString());
        if (!isParticipant && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized: Participation or Admin role required' });
        }

        const messages = await Message.find({ chatId })
            .sort({ createdAt: 1 })
            .limit(100);

        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const closeChat = async (req, res) => {
    try {
        const { chatId } = req.params;
        const userId = req.user._id;
        const userRole = req.user.role;

        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: 'Chat not found' });

        const isParticipant = chat.participants.some(p => p.userId.toString() === userId.toString());
        if (!isParticipant && userRole !== 'ADMIN') {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updatedChat = await Chat.findByIdAndUpdate(chatId, {
            status: 'CLOSED',
            closedAt: new Date()
        }, { new: true });

        res.json({ success: true, data: updatedChat });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

