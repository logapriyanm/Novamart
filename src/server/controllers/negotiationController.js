import { Negotiation, Dealer, Manufacturer, Product, Notification, Chat, Message } from '../models/index.js';
import logger from '../lib/logger.js';
import stockAllocationService from '../services/stockAllocationService.js';
import mongoose from 'mongoose';

export const createNegotiation = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity, initialOffer, proposedPrice } = req.body;
        const offerPrice = proposedPrice || initialOffer;

        const dealer = await Dealer.findOne({ userId });
        if (!dealer) return res.status(403).json({ success: false, error: 'Only dealers can negotiate' });

        const product = await Product.findById(productId).populate('manufacturerId');
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

        const existing = await Negotiation.findOne({
            dealerId: dealer._id,
            productId: productId,
            status: 'OPEN'
        });

        if (existing) return res.status(400).json({
            success: false,
            error: 'Open negotiation already exists',
            details: { negotiationId: existing._id }
        });

        const negotiation = await Negotiation.create({
            dealerId: dealer._id,
            manufacturerId: product.manufacturerId._id,
            productId: productId,
            quantity: parseInt(quantity),
            currentOffer: parseFloat(offerPrice),
            status: 'OPEN',
            chatLog: [{
                sender: 'DEALER',
                message: `Started negotiation for ${quantity} units at ₹${offerPrice}`,
                time: new Date()
            }]
        });

        try {
            const manufacturer = await Manufacturer.findById(product.manufacturerId._id).populate('userId');

            if (manufacturer?.userId) {
                let chat = await Chat.findOne({
                    type: 'NEGOTIATION',
                    contextId: negotiation._id.toString()
                });

                if (!chat) {
                    chat = await Chat.create({
                        type: 'NEGOTIATION',
                        contextId: negotiation._id.toString(),
                        participants: [
                            { userId: userId, role: 'DEALER' },
                            { userId: manufacturer.userId._id, role: 'MANUFACTURER' }
                        ],
                        lastMessage: {
                            text: `Started negotiation for ${quantity} units at ₹${offerPrice}`,
                            senderId: userId,
                            createdAt: new Date()
                        }
                    });

                    await Message.create({
                        chatId: chat._id,
                        message: `Started negotiation for ${quantity} units at ₹${offerPrice}`,
                        messageType: 'SYSTEM',
                        senderId: userId,
                        senderRole: 'DEALER'
                    });
                }

                await Notification.create({
                    userId: manufacturer.userId._id,
                    type: 'NEGOTIATION_STARTED',
                    title: 'New Price Negotiation Request',
                    message: `${dealer.businessName} wants to negotiate pricing for ${product.name}. Initial offer: ₹${offerPrice} for ${quantity} units.`,
                    link: `/manufacturer/negotiations/${negotiation._id}`
                });
            }
        } catch (mongoErr) {
            logger.error('Failed to sync negotiation with MongoDB Chat:', mongoErr);
        }

        res.status(201).json({ success: true, data: negotiation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Failed to start negotiation' });
    }
};

export const getNegotiations = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        let query = {};
        if (role === 'DEALER') {
            const dealer = await Dealer.findOne({ userId });
            if (!dealer) return res.status(404).json({ message: 'Profile not found' });
            query = { dealerId: dealer._id };
        } else if (role === 'MANUFACTURER') {
            const manufacturer = await Manufacturer.findOne({ userId });
            if (!manufacturer) return res.status(404).json({ message: 'Profile not found' });
            query = { manufacturerId: manufacturer._id };
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const negotiations = await Negotiation.find(query)
            .populate('productId', 'name images basePrice')
            .populate('dealerId', 'businessName')
            .populate('manufacturerId', 'companyName')
            .sort({ updatedAt: -1 });

        res.json({ success: true, data: negotiations });
    } catch (error) {
        console.error('Failed to fetch negotiations:', error);
        res.status(500).json({ message: 'Failed to fetch negotiations', error: error.message });
    }
};

export const updateNegotiation = async (req, res) => {
    try {
        const { negotiationId } = req.params;
        const { message, newOffer, counterPrice, status } = req.body;
        const offerUpdate = counterPrice || newOffer;
        const userId = req.user._id;
        const role = req.user.role;

        const negotiation = await Negotiation.findById(negotiationId)
            .populate('dealerId')
            .populate('manufacturerId');

        if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

        const isParticipant = (role === 'DEALER' && negotiation.dealerId.userId.toString() === userId.toString()) ||
            (role === 'MANUFACTURER' && negotiation.manufacturerId.userId.toString() === userId.toString());

        if (!isParticipant) {
            return res.status(403).json({ error: 'FORBIDDEN', message: 'You are not a participant in this negotiation' });
        }

        const chatEntry = {
            sender: role,
            message: message || (status ? `Changed status to ${status}` : `New offer: ₹${offerUpdate}`),
            time: new Date()
        };

        const updateData = {
            $push: { chatLog: chatEntry }
        };

        if (offerUpdate) updateData.currentOffer = parseFloat(offerUpdate);
        if (status) updateData.status = status;

        const updatedNegotiation = await Negotiation.findByIdAndUpdate(negotiationId, updateData, { new: true });

        if (status === 'ORDER_FULFILLED' && role === 'MANUFACTURER') {
            try {
                await stockAllocationService.allocateStock(negotiation.manufacturerId._id, {
                    productId: negotiation.productId,
                    dealerId: negotiation.dealerId._id,
                    region: 'NATIONAL',
                    quantity: negotiation.quantity,
                    dealerBasePrice: updatedNegotiation.currentOffer,
                    dealerMoq: 1,
                    maxMargin: 20
                });

                await Negotiation.findByIdAndUpdate(negotiationId, {
                    $push: {
                        chatLog: {
                            sender: 'SYSTEM',
                            message: `Order Processed. ${negotiation.quantity} units allocated at ₹${updatedNegotiation.currentOffer}.`,
                            time: new Date()
                        }
                    }
                });
            } catch (allocError) {
                logger.error("Allocation Failed:", allocError);
            }
        }

        const recipientUserId = role === 'DEALER' ? negotiation.manufacturerId.userId : negotiation.dealerId.userId;
        const senderName = role === 'DEALER' ? negotiation.dealerId.businessName : negotiation.manufacturerId.companyName;

        try {
            let chat = await Chat.findOne({ type: 'NEGOTIATION', contextId: negotiationId });

            if (!chat) {
                chat = await Chat.create({
                    type: 'NEGOTIATION',
                    contextId: negotiationId,
                    participants: [
                        { userId: negotiation.dealerId.userId, role: 'DEALER' },
                        { userId: negotiation.manufacturerId.userId, role: 'MANUFACTURER' }
                    ]
                });
            }

            let systemMsgText = '';
            if (status) {
                systemMsgText = `${senderName} changed status to ${status.replace('_', ' ')}`;
            } else if (offerUpdate) {
                systemMsgText = `${senderName} sent a new offer: ₹${offerUpdate}`;
            }

            if (systemMsgText) {
                await Message.create({
                    chatId: chat._id,
                    message: systemMsgText,
                    messageType: 'SYSTEM',
                    senderId: userId,
                    senderRole: role
                });
            }

            if (message) {
                await Message.create({
                    chatId: chat._id,
                    message: message,
                    messageType: 'TEXT',
                    senderId: userId,
                    senderRole: role
                });
            }

            await Chat.findByIdAndUpdate(chat._id, {
                lastMessage: {
                    text: message || systemMsgText,
                    senderId: userId,
                    createdAt: new Date()
                },
                updatedAt: new Date()
            });

        } catch (mongoErr) {
            logger.error('Failed to sync negotiation update with MongoDB Chat:', mongoErr);
        }

        if (status) {
            let notificationType = 'NEGOTIATION_UPDATE';
            let notificationTitle = `Negotiation ${status.replace('_', ' ')}`;
            let notificationMessage = '';

            switch (status) {
                case 'ACCEPTED':
                    notificationType = 'NEGOTIATION_ACCEPTED';
                    notificationMessage = `${senderName} has accepted the negotiation terms. Stock will be allocated soon.`;
                    break;
                case 'REJECTED':
                    notificationType = 'NEGOTIATION_REJECTED';
                    notificationMessage = `${senderName} has declined the negotiation.`;
                    break;
                case 'ORDER_REQUESTED':
                    notificationType = 'ORDER_PLACED';
                    notificationTitle = 'New Purchase Order Raised';
                    notificationMessage = `${senderName} has raised a purchase order for ${negotiation.quantity} units.`;
                    break;
                case 'ORDER_FULFILLED':
                    notificationType = 'ORDER_FULFILLED';
                    notificationTitle = 'Order Confirmed & Stock Allocated';
                    notificationMessage = `${senderName} has fulfilled the order. Inventory has been allocated.`;
                    break;
            }

            await Notification.create({
                userId: recipientUserId,
                type: notificationType,
                title: notificationTitle,
                message: notificationMessage,
                link: role === 'DEALER' ? '/manufacturer/negotiations' : '/dealer/negotiations'
            });
        } else if (message || newOffer) {
            await Notification.create({
                userId: recipientUserId,
                type: 'NEGOTIATION_MESSAGE',
                title: 'New Negotiation Message',
                message: offerUpdate
                    ? `${senderName} sent a new offer: ₹${offerUpdate}`
                    : `${senderName}: ${message?.substring(0, 50)}${message?.length > 50 ? '...' : ''}`,
                link: role === 'DEALER' ? '/dealer/negotiations' : '/manufacturer/negotiations'
            });
        }

        res.json({ success: true, data: updatedNegotiation });
    } catch (error) {
        logger.error('Negotiation Update Error:', error);
        res.status(500).json({ message: 'Update failed' });
    }
};

export const getSingleNegotiation = async (req, res) => {
    try {
        const { negotiationId } = req.params;
        const role = req.user.role;

        const negotiation = await Negotiation.findById(negotiationId)
            .populate('productId', 'name images basePrice moq category')
            .populate('dealerId', 'businessName city state userId')
            .populate('manufacturerId', 'companyName factoryAddress userId');

        if (!negotiation) {
            return res.status(404).json({ success: false, message: 'Negotiation not found' });
        }

        const userId = req.user._id.toString();
        const isParticipant = (role === 'DEALER' && negotiation.dealerId.userId.toString() === userId) ||
            (role === 'MANUFACTURER' && negotiation.manufacturerId.userId.toString() === userId);

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.json({ success: true, data: negotiation });
    } catch (error) {
        console.error('Get negotiation error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch negotiation' });
    }
};

export default {
    createNegotiation,
    getNegotiations,
    updateNegotiation,
    getSingleNegotiation
};
