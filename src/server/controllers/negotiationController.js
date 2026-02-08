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

        const negotiation = await prisma.negotiation.findUnique({ where: { id: negotiationId } });
        if (!negotiation) return res.status(404).json({ message: 'Negotiation not found' });

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

        res.json({ success: true, data: updatedNegotiation });
    } catch (error) {
        res.status(500).json({ message: 'Update failed' });
    }
};
