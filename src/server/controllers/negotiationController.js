import prisma from '../lib/prisma.js';
import logger from '../lib/logger.js';
import stockAllocationService from '../services/stockAllocationService.js';

export const createNegotiation = async (req, res) => {
    try {
        const dealerUserId = req.user.id;
        const { productId, quantity, initialOffer, proposedPrice } = req.body;
        const offerPrice = proposedPrice || initialOffer; // Support both names

        // Get Dealer Profile
        const dealer = await prisma.dealer.findUnique({ where: { userId: dealerUserId } });
        if (!dealer) return res.status(403).json({ message: 'Only dealers can negotiate' });

        // Get Product & Manufacturer
        const product = await prisma.product.findUnique({
            where: { id: productId },
            include: { manufacturer: true }
        });
        if (!product) return res.status(404).json({ message: 'Product not found' });

        // Check if negotiation already exists
        const existing = await prisma.negotiation.findFirst({
            where: {
                dealerId: dealer.id,
                productId: productId,
                status: 'OPEN'
            }
        });

        if (existing) return res.status(400).json({ message: 'Open negotiation already exists', negotiationId: existing.id });

        const negotiation = await prisma.negotiation.create({
            data: {
                dealerId: dealer.id,
                manufacturerId: product.manufacturerId,
                productId: productId,
                quantity: parseInt(quantity),
                currentOffer: parseFloat(offerPrice),
                status: 'OPEN',
                chatLog: [{
                    sender: 'DEALER',
                    message: `Started negotiation for ${quantity} units at ₹${offerPrice}`,
                    time: new Date()
                }]
            }
        });

        // Notify manufacturer of new negotiation
        const manufacturer = await prisma.manufacturer.findUnique({
            where: { id: product.manufacturerId },
            include: { user: true }
        });

        if (manufacturer?.user) {
            await prisma.notification.create({
                data: {
                    userId: manufacturer.user.id,
                    type: 'NEGOTIATION_STARTED',
                    title: 'New Price Negotiation Request',
                    message: `${dealer.businessName} wants to negotiate pricing for ${product.name}. Initial offer: ₹${offerPrice} for ${quantity} units.`,
                    link: `/manufacturer/negotiations`
                }
            });
        }

        res.status(201).json({ success: true, data: negotiation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to start negotiation' });
    }
};

export const getNegotiations = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role; // MANUFACTURER or DEALER
        console.log(`[Negotiation] Fetching for User: ${userId}, Role: ${role}`);

        let query = {};
        if (role === 'DEALER') {
            const dealer = await prisma.dealer.findUnique({ where: { userId } });
            if (!dealer) return res.status(404).json({ message: 'Profile not found' });
            query = { dealerId: dealer.id };
        } else if (role === 'MANUFACTURER') {
            const manufacturer = await prisma.manufacturer.findUnique({ where: { userId } });
            if (!manufacturer) return res.status(404).json({ message: 'Profile not found' });
            query = { manufacturerId: manufacturer.id };
        } else {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const negotiations = await prisma.negotiation.findMany({
            where: query,
            include: {
                product: { select: { name: true, images: true, basePrice: true } },
                dealer: { select: { businessName: true } },
                manufacturer: { select: { companyName: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json({ success: true, data: negotiations });
    } catch (error) {
        console.error('Failed to fetch negotiations:', error);
        res.status(500).json({ message: 'Failed to fetch negotiations', error: error.message });
    }
};

export const updateNegotiation = async (req, res) => {
    try {
        const { negotiationId } = req.params;
        const { message, newOffer, counterPrice, status } = req.body; // status: ACCEPTED | REJECTED
        const offerUpdate = counterPrice || newOffer;
        const userId = req.user.id;
        const role = req.user.role;

        const negotiation = await prisma.negotiation.findUnique({
            where: { id: negotiationId },
            include: { dealer: true, manufacturer: true }
        });
        if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

        // Ownership Verification
        const isParticipant = (role === 'DEALER' && negotiation.dealer.userId === userId) ||
            (role === 'MANUFACTURER' && negotiation.manufacturer.userId === userId);

        if (!isParticipant) {
            return res.status(403).json({ error: 'FORBIDDEN', message: 'You are not a participant in this negotiation' });
        }

        // Append to chat log
        const chatEntry = {
            sender: role,
            message: message || (status ? `Changed status to ${status}` : `New offer: ₹${offerUpdate}`),
            time: new Date()
        };
        const updatedLog = [...(negotiation.chatLog || []), chatEntry];

        let updateData = {
            chatLog: updatedLog
        };

        if (offerUpdate) updateData.currentOffer = parseFloat(offerUpdate);
        if (status) updateData.status = status;

        const updatedNegotiation = await prisma.negotiation.update({
            where: { id: negotiationId },
            data: updateData
        });

        // Trigger Stock Allocation if Manufacturer fulfills the order
        if (status === 'ORDER_FULFILLED' && role === 'MANUFACTURER') {
            try {
                await stockAllocationService.allocateStock(negotiation.manufacturerId, {
                    productId: negotiation.productId,
                    dealerId: negotiation.dealerId,
                    region: 'NATIONAL', // Default/Fallback to match SourcingTerminal
                    quantity: negotiation.quantity,
                    dealerBasePrice: negotiation.currentOffer,
                    dealerMoq: 1, // Default
                    maxMargin: 20 // Default
                });

                // Add system message
                await prisma.negotiation.update({
                    where: { id: negotiationId },
                    data: {
                        chatLog: [...updatedNegotiation.chatLog, {
                            sender: 'SYSTEM',
                            message: `Order Processed. ${negotiation.quantity} units allocated at ₹${negotiation.currentOffer}.`,
                            time: new Date()
                        }]
                    }
                });
            } catch (allocError) {
                console.error("Allocation Failed:", allocError);
                // Revert status if allocation fails? Or just notify?
                // For now, let's just log it. In prod, we should revert or flag error.
            }
        }

        // Send notification to the other party
        const recipientUserId = role === 'DEALER' ? negotiation.manufacturer.userId : negotiation.dealer.userId;
        const senderName = role === 'DEALER' ? negotiation.dealer.businessName : negotiation.manufacturer.companyName;

        if (status) {
            // Mapping status to notification types
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

            // Notify about status change
            await prisma.notification.create({
                data: {
                    userId: recipientUserId,
                    type: notificationType,
                    title: notificationTitle,
                    message: notificationMessage,
                    link: role === 'DEALER' ? '/manufacturer/negotiations' : '/dealer/negotiations'
                }
            });
        } else if (message || newOffer) {
            // Notify about new message/offer
            await prisma.notification.create({
                data: {
                    userId: recipientUserId,
                    type: 'NEGOTIATION_MESSAGE',
                    title: 'New Negotiation Message',
                    message: offerUpdate
                        ? `${senderName} sent a new offer: ₹${offerUpdate}`
                        : `${senderName}: ${message?.substring(0, 50)}${message?.length > 50 ? '...' : ''}`,
                    link: role === 'DEALER' ? '/dealer/negotiations' : '/manufacturer/negotiations'
                }
            });
        }

        res.json({ success: true, data: updatedNegotiation });
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};

export const getSingleNegotiation = async (req, res) => {
    try {
        const { negotiationId } = req.params;
        const userId = req.user.id;
        const role = req.user.role;

        const negotiation = await prisma.negotiation.findUnique({
            where: { id: negotiationId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        images: true,
                        basePrice: true,
                        moq: true,
                        category: true
                    }
                },
                dealer: {
                    select: {
                        id: true,
                        businessName: true,
                        city: true,
                        state: true
                    }
                },
                manufacturer: {
                    select: {
                        id: true,
                        companyName: true,
                        factoryAddress: true
                    }
                }
            }
        });

        if (!negotiation) {
            return res.status(404).json({ success: false, message: 'Negotiation not found' });
        }

        // Verify access - only participants can view
        const currentDealerId = req.user.dealer?.id;
        const currentMfrId = req.user.manufacturer?.id;
        const isParticipant = (role === 'DEALER' && negotiation.dealerId === currentDealerId) ||
            (role === 'MANUFACTURER' && negotiation.manufacturerId === currentMfrId);

        if (!isParticipant) {
            return res.status(403).json({ success: false, message: 'Access denied' });
        }

        res.json({ success: true, data: negotiation });
    } catch (error) {
        console.error('Get negotiation error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch negotiation' });
    }
};

// Helper functions
async function getUserDealerId(userId) {
    const dealer = await prisma.dealer.findUnique({ where: { userId } });
    return dealer?.id;
}

async function getUserManufacturerId(userId) {
    const manufacturer = await prisma.manufacturer.findUnique({ where: { userId } });
    return manufacturer?.id;
}
