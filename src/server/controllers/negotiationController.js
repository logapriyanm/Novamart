import prisma from '../lib/prisma.js';

export const createNegotiation = async (req, res) => {
    try {
        const dealerUserId = req.user.id;
        const { productId, quantity, initialOffer } = req.body;

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
                currentOffer: parseFloat(initialOffer),
                status: 'OPEN',
                chatLog: [{
                    sender: 'DEALER',
                    message: `Started negotiation for ${quantity} units at ${initialOffer}`,
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
                    message: `${dealer.businessName} wants to negotiate pricing for ${product.name}. Initial offer: ₹${initialOffer} for ${quantity} units.`,
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
                product: { select: { name: true, image: true, basePrice: true } },
                dealer: { select: { businessName: true } },
                manufacturer: { select: { companyName: true } }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json({ success: true, data: negotiations });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch negotiations' });
    }
};

export const updateNegotiation = async (req, res) => {
    try {
        const { negotiationId } = req.params;
        const { message, newOffer, status } = req.body; // status: ACCEPTED | REJECTED
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
            message: message || (status ? `Changed status to ${status}` : `New offer: ${newOffer}`),
            time: new Date()
        };
        const updatedLog = [...(negotiation.chatLog || []), chatEntry];

        let updateData = {
            chatLog: updatedLog
        };

        if (newOffer) updateData.currentOffer = newOffer;
        if (status) updateData.status = status;

        const updatedNegotiation = await prisma.negotiation.update({
            where: { id: negotiationId },
            data: updateData
        });

        // Send notification to the other party
        const recipientUserId = role === 'DEALER' ? negotiation.manufacturer.userId : negotiation.dealer.userId;
        const senderName = role === 'DEALER' ? negotiation.dealer.businessName : negotiation.manufacturer.companyName;

        if (status) {
            // Notify about status change (approval/rejection)
            await prisma.notification.create({
                data: {
                    userId: recipientUserId,
                    type: status === 'ACCEPTED' ? 'NEGOTIATION_ACCEPTED' : 'NEGOTIATION_REJECTED',
                    title: `Negotiation ${status}`,
                    message: status === 'ACCEPTED'
                        ? `${senderName} has accepted the negotiation terms. Stock will be allocated soon.`
                        : `${senderName} has declined the negotiation. You can start a new negotiation with different terms.`,
                    link: role === 'DEALER' ? '/dealer/negotiations' : '/manufacturer/negotiations'
                }
            });
        } else if (message || newOffer) {
            // Notify about new message/offer
            await prisma.notification.create({
                data: {
                    userId: recipientUserId,
                    type: 'NEGOTIATION_MESSAGE',
                    title: 'New Negotiation Message',
                    message: newOffer
                        ? `${senderName} sent a new offer: ₹${newOffer}`
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
        const isParticipant = (role === 'DEALER' && negotiation.dealer.id === await getUserDealerId(userId)) ||
            (role === 'MANUFACTURER' && negotiation.manufacturer.id === await getUserManufacturerId(userId));

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
