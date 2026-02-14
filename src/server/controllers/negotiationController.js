import { Negotiation, Seller, Manufacturer, Product, Notification, Chat, Message, SellerRequest } from '../models/index.js';
import logger from '../lib/logger.js';
import stockAllocationService from '../services/stockAllocationService.js';
import mongoose from 'mongoose';

export const createNegotiation = async (req, res) => {
    try {
        const userId = req.user._id;
        const { productId, quantity, initialOffer, proposedPrice } = req.body;
        const offerPrice = proposedPrice || initialOffer;

        const seller = await Seller.findOne({ userId });
        if (!seller) return res.status(403).json({ success: false, error: 'Only sellers can negotiate' });

        const product = await Product.findById(productId).populate('manufacturerId');
        if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

        // PHASE 2/3: Enforce Approved Partnership
        const partnership = await SellerRequest.findOne({
            sellerId: seller._id,
            manufacturerId: product.manufacturerId._id,
            status: 'APPROVED'
        });

        if (!partnership) {
            return res.status(403).json({
                success: false,
                error: 'PARTNERSHIP_REQUIRED',
                message: 'You must have an approved partnership with this manufacturer to negotiate.'
            });
        }

        const existing = await Negotiation.findOne({
            sellerId: seller._id,
            productId: productId,
            status: 'REQUESTED'
        });

        if (existing) return res.status(400).json({
            success: false,
            error: 'Open negotiation already exists',
            details: { negotiationId: existing._id }
        });

        const negotiation = await Negotiation.create({
            sellerId: seller._id,
            manufacturerId: product.manufacturerId._id,
            productId: productId,
            quantity: parseInt(quantity),
            currentOffer: parseFloat(offerPrice),
            status: 'REQUESTED',
            chatLog: [{
                sender: 'SELLER',
                message: `Started negotiation for ${quantity} units at ₹${offerPrice}`,
                time: new Date()
            }]
        });

        // NOTE: Individual negotiation is FREE - no subscription check required
        // Subscription is only required for GROUP collaboration (Phase 5)

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
                            { userId: userId, role: 'SELLER' },
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
                        messageType: 'OFFER',
                        senderId: userId,
                        senderRole: 'SELLER',
                        metadata: {
                            price: parseFloat(offerPrice),
                            quantity: parseInt(quantity),
                            timeline: 'Immediate' // Default timeline
                        }
                    });
                }

                await Notification.create({
                    userId: manufacturer.userId._id,
                    type: 'NEGOTIATION_STARTED',
                    title: 'New Price Negotiation Request',
                    message: `${seller.businessName} wants to negotiate pricing for ${product.name}. Initial offer: ₹${offerPrice} for ${quantity} units.`,
                    link: `/manufacturer/negotiations/${negotiation._id}`
                });
            }
        } catch (mongoErr) {
            logger.error('Failed to sync negotiation with MongoDB Chat:', mongoErr);
        }

        res.status(201).json({ success: true, data: negotiation });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ success: false, error: 'Failed to start negotiation' });
    }
};

export const getNegotiations = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;

        let query = {};
        if (role === 'SELLER') {
            const seller = await Seller.findOne({ userId });
            if (!seller) return res.status(404).json({ message: 'Profile not found' });
            query = { sellerId: seller._id };
        } else if (role === 'MANUFACTURER') {
            const manufacturer = await Manufacturer.findOne({ userId });
            if (!manufacturer) return res.status(404).json({ message: 'Profile not found' });
            query = { manufacturerId: manufacturer._id };
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const negotiations = await Negotiation.find(query)
            .populate('productId', 'name images basePrice')
            .populate('sellerId', 'businessName')
            .populate('manufacturerId', 'companyName')
            .sort({ updatedAt: -1 });

        res.json({ success: true, data: negotiations });
    } catch (error) {
        logger.error('Failed to fetch negotiations:', error);
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
            .populate('sellerId')
            .populate('manufacturerId');

        if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

        const isParticipant = (role === 'SELLER' && negotiation.sellerId.userId.toString() === userId.toString()) ||
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

        // Strict State Transition Validation
        if (status) {
            const currentStatus = negotiation.status;
            const validTransitions = {
                'REQUESTED': ['NEGOTIATING', 'OFFER_MADE', 'REJECTED', 'ACCEPTED'],
                'NEGOTIATING': ['OFFER_MADE', 'ACCEPTED', 'REJECTED'],
                'OFFER_MADE': ['ACCEPTED', 'NEGOTIATING', 'REJECTED'],
                'ACCEPTED': ['DEAL_CLOSED', 'REJECTED'],
                'DEAL_CLOSED': [], // Terminal state
                'REJECTED': [] // Terminal state
            };

            // Allow implicit Offer -> Negotiating transition
            // If offer is made, we can assume it's part of negotiation
            if (!validTransitions[currentStatus]?.includes(status)) {
                // Extended check: If we are simply updating terms (new offer) but explicitly sending status 'NEGOTIATING', allow it from REQUESTED/OFFER_MADE
                if (status === 'NEGOTIATING' && ['REQUESTED', 'OFFER_MADE'].includes(currentStatus)) {
                    // Allow
                } else {
                    return res.status(400).json({
                        error: 'INVALID_STATE_TRANSITION',
                        message: `Cannot move from ${currentStatus} to ${status}`
                    });
                }
            }
        }

        if (offerUpdate) updateData.currentOffer = parseFloat(offerUpdate);
        if (status) updateData.status = status;

        // Auto-transition to NEGOTIATING if offer is made on REQUESTED
        if (offerUpdate && negotiation.status === 'REQUESTED' && !status) {
            updateData.status = 'NEGOTIATING';
        }

        const updatedNegotiation = await Negotiation.findByIdAndUpdate(negotiationId, updateData, { new: true });

        // Create allocation when deal closes (Phase 4)
        if (status === 'DEAL_CLOSED' && role === 'MANUFACTURER') {
            // Double-execution prevention: check pre-update status
            if (negotiation.status === 'DEAL_CLOSED') {
                return res.status(400).json({
                    error: 'DEAL_ALREADY_CLOSED',
                    message: 'This negotiation has already been closed. Allocation was already created.'
                });
            }

            const dealSession = await mongoose.startSession();
            dealSession.startTransaction();
            try {
                const { Allocation } = await import('../models/index.js');

                // Create allocation record using new Allocation model
                const [newAllocation] = await Allocation.create([{
                    negotiationId: negotiation._id,
                    type: 'INDIVIDUAL',
                    sellerId: negotiation.sellerId._id,
                    manufacturerId: negotiation.manufacturerId._id,
                    productId: negotiation.productId,
                    allocatedQuantity: negotiation.quantity,
                    soldQuantity: 0,
                    remainingQuantity: negotiation.quantity,
                    negotiatedPrice: updatedNegotiation.currentOffer,
                    minRetailPrice: updatedNegotiation.currentOffer * 1.05, // 5% commission
                    status: 'ACTIVE'
                }], { session: dealSession });

                // Deduct from manufacturer stock
                const { Product, Inventory } = await import('../models/index.js');
                await Product.findByIdAndUpdate(negotiation.productId, {
                    $inc: { stockQuantity: -negotiation.quantity }
                }, { session: dealSession });

                // CRITICAL FIX: Upsert Inventory Record for Seller
                // Check if inventory exists for this product/seller
                const existingInventory = await Inventory.findOne({
                    sellerId: negotiation.sellerId._id,
                    productId: negotiation.productId
                }).session(dealSession);

                if (existingInventory) {
                    await Inventory.findByIdAndUpdate(existingInventory._id, {
                        $inc: {
                            stock: negotiation.quantity,
                            allocatedStock: negotiation.quantity,
                            remainingQuantity: negotiation.quantity
                        },
                        // Update price rules if new deal is better? 
                        // For now, we prefer the latest negotiated price as base
                        sellerBasePrice: updatedNegotiation.currentOffer,
                        allocationId: newAllocation._id, // Update link to latest allocation
                        isListed: true
                    }, { session: dealSession });
                } else {
                    await Inventory.create([{
                        sellerId: negotiation.sellerId._id,
                        productId: negotiation.productId,
                        region: 'Global', // Negotiation doesn't specify region usually, default or fetch from seller profile
                        stock: negotiation.quantity,
                        price: updatedNegotiation.currentOffer * 1.2, // Default retail price (20% margin)
                        originalPrice: updatedNegotiation.currentOffer,
                        isAllocated: true,
                        allocationStatus: 'APPROVED',
                        allocationId: newAllocation._id, // LINKED!
                        isListed: true,
                        listedAt: new Date(),
                        allocatedStock: negotiation.quantity,
                        sellerBasePrice: updatedNegotiation.currentOffer,
                        soldQuantity: 0,
                        remainingQuantity: negotiation.quantity
                    }], { session: dealSession });
                }

                await Negotiation.findByIdAndUpdate(negotiationId, {
                    $push: {
                        chatLog: {
                            sender: 'SYSTEM',
                            message: `Deal Closed! ${negotiation.quantity} units allocated at ₹${updatedNegotiation.currentOffer}. Inventory updated.`,
                            time: new Date()
                        }
                    }
                }, { session: dealSession });

                await dealSession.commitTransaction();
            } catch (allocError) {
                await dealSession.abortTransaction();
                logger.error("Allocation Failed:", allocError);
                return res.status(500).json({ success: false, error: 'ALLOCATION_FAILED', details: allocError.message });
            } finally {
                dealSession.endSession();
            }
        }

        const recipientUserId = role === 'SELLER'
            ? negotiation?.manufacturerId?.userId
            : negotiation?.sellerId?.userId;

        const senderName = role === 'SELLER'
            ? negotiation?.sellerId?.businessName
            : negotiation?.manufacturerId?.companyName;

        try {
            // Ensure IDs are strings for reliable lookup
            const sellerUserId = negotiation.sellerId?.userId?._id?.toString() || negotiation.sellerId?.userId?.toString();
            const mfrUserId = negotiation.manufacturerId?.userId?._id?.toString() || negotiation.manufacturerId?.userId?.toString();

            if (!sellerUserId || !mfrUserId) {
                logger.error('Missing participant User IDs in negotiation', { negotiationId });
                // Continue without chat sync if IDs broken, or throw? 
                // Better to log and continue to avoid blocking the status update itself if possible, 
                // but chat is critical.
            }

            let chat = await Chat.findOne({ type: 'NEGOTIATION', contextId: negotiationId });

            if (!chat && sellerUserId && mfrUserId) {
                chat = await Chat.create({
                    type: 'NEGOTIATION',
                    contextId: negotiationId,
                    participants: [
                        { userId: sellerUserId, role: 'SELLER' },
                        { userId: mfrUserId, role: 'MANUFACTURER' }
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

            // New: Handle Structured Offer
            if (req.body.offerDetails) {
                const { price, quantity, timeline, note } = req.body.offerDetails;
                await Message.create({
                    chatId: chat._id,
                    message: note || `Proposed ₹${price} for ${quantity} units`,
                    messageType: 'OFFER',
                    senderId: userId,
                    senderRole: role,
                    metadata: { price, quantity, timeline }
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
                link: role === 'SELLER' ? '/manufacturer/negotiations' : '/seller/negotiations'
            });

        } else if (message || newOffer) {
            await Notification.create({
                userId: recipientUserId,
                type: 'NEGOTIATION_MESSAGE',
                title: 'New Negotiation Message',
                message: offerUpdate
                    ? `${senderName} sent a new offer: ₹${offerUpdate}`
                    : `${senderName}: ${message?.substring(0, 50)}${message?.length > 50 ? '...' : ''}`,
                link: role === 'SELLER' ? '/seller/negotiations' : '/manufacturer/negotiations'
            });
        }

        // Real-time Socket Broadcast
        if (req.io) {
            const chatId = (await Chat.findOne({ type: 'NEGOTIATION', contextId: negotiationId }))?._id;
            if (chatId) {
                // Emit system message if created
                // We created Message models above but didn't capture the object to emit.
                // ideally we should capture the 'message' object from Message.create calls.
                // For now, simpler to emit a generic 'negotiation:update' event
                req.io.to(chatId.toString()).emit('negotiation:update', {
                    negotiation: updatedNegotiation,
                    trigger: status || (offerUpdate ? 'OFFER' : 'MESSAGE')
                });
            }
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
            .populate('sellerId', 'businessName city state userId')
            .populate('manufacturerId', 'companyName factoryAddress userId');

        if (!negotiation) {
            return res.status(404).json({ success: false, message: 'Negotiation not found' });
        }

        const userId = req.user._id.toString();
        const isParticipant = (role === 'SELLER' && negotiation.sellerId.userId.toString() === userId) ||
            (role === 'MANUFACTURER' && negotiation.manufacturerId.userId.toString() === userId);

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.json({ success: true, data: negotiation });
    } catch (error) {
        logger.error('Get negotiation error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch negotiation' });
    }
};

export default {
    createNegotiation,
    getNegotiations,
    updateNegotiation,
    getSingleNegotiation
};
