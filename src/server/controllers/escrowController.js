import prisma from '../lib/prisma.js';

// Get Escrow Details
export const getEscrow = async (req, res) => {
    try {
        const { orderId } = req.params;

        const escrow = await prisma.escrow.findUnique({
            where: { orderId },
            include: {
                order: {
                    include: {
                        customer: { include: { user: true } },
                        dealer: { include: { user: true } },
                        items: true
                    }
                }
            }
        });

        if (!escrow) {
            return res.status(404).json({ success: false, error: 'Escrow not found' });
        }

        res.json({ success: true, data: escrow });

    } catch (error) {
        console.error('Get Escrow Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch escrow' });
    }
};

// Confirm Delivery (Customer) - Triggers Escrow Release
export const confirmDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        // Verify customer owns this order
        const customer = await prisma.customer.findUnique({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { escrow: true }
        });

        if (!order || order.customerId !== customer.id) {
            return res.status(403).json({ success: false, error: 'Not authorized for this order' });
        }

        if (order.status !== 'DELIVERED') {
            return res.status(400).json({
                success: false,
                error: 'Order must be in DELIVERED status to confirm'
            });
        }

        if (!order.escrow || order.escrow.status !== 'HOLD') {
            return res.status(400).json({
                success: false,
                error: 'Escrow not in HOLD status'
            });
        }

        // Release escrow
        const result = await prisma.$transaction(async (tx) => {
            // Update escrow status
            const updatedEscrow = await tx.escrow.update({
                where: { orderId },
                data: {
                    status: 'RELEASED',
                    releasedAt: new Date()
                }
            });

            // Update order status
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'SETTLED' }
            });

            return updatedEscrow;
        });

        res.json({
            success: true,
            data: result,
            message: 'Delivery confirmed. Funds released to seller.'
        });

    } catch (error) {
        console.error('Confirm Delivery Error:', error);
        res.status(500).json({ success: false, error: 'Failed to confirm delivery' });
    }
};

// Request Refund (Customer)
export const requestRefund = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        // Verify customer owns this order
        const customer = await prisma.customer.findUnique({ where: { userId } });
        if (!customer) {
            return res.status(403).json({ success: false, error: 'Not authorized' });
        }

        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: { escrow: true }
        });

        if (!order || order.customerId !== customer.id) {
            return res.status(403).json({ success: false, error: 'Not authorized for this order' });
        }

        if (!order.escrow || order.escrow.status !== 'HOLD') {
            return res.status(400).json({
                success: false,
                error: 'Cannot request refund. Escrow already processed.'
            });
        }

        // Freeze escrow pending admin review
        const result = await prisma.$transaction(async (tx) => {
            // Update escrow to FROZEN
            const updatedEscrow = await tx.escrow.update({
                where: { orderId },
                data: { status: 'FROZEN' }
            });

            // Create dispute record
            await tx.dispute.create({
                data: {
                    orderId,
                    raisedBy: customer.id,
                    reason: reason || 'Refund requested',
                    description: reason || 'Customer requested refund',
                    status: 'OPEN',
                    evidenceFiles: []
                }
            });

            // Update order status
            await tx.order.update({
                where: { id: orderId },
                data: { status: 'DISPUTED' }
            });

            return updatedEscrow;
        });

        res.json({
            success: true,
            data: result,
            message: 'Refund request submitted. Admin will review shortly.'
        });

    } catch (error) {
        console.error('Request Refund Error:', error);
        res.status(500).json({ success: false, error: 'Failed to request refund' });
    }
};

// Admin: Manual Escrow Release
export const adminReleaseEscrow = async (req, res) => {
    try {
        const { orderId, adminNotes } = req.body;
        const userId = req.user?.id;

        // Verify admin role
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const escrow = await prisma.escrow.findUnique({
            where: { orderId },
            include: { order: true }
        });

        if (!escrow) {
            return res.status(404).json({ success: false, error: 'Escrow not found' });
        }

        if (escrow.status === 'RELEASED') {
            return res.status(400).json({ success: false, error: 'Escrow already released' });
        }

        // Release escrow
        const result = await prisma.$transaction(async (tx) => {
            const updatedEscrow = await tx.escrow.update({
                where: { orderId },
                data: {
                    status: 'RELEASED',
                    releasedAt: new Date()
                }
            });

            await tx.order.update({
                where: { id: orderId },
                data: { status: 'SETTLED' }
            });

            // If there's an open dispute, close it
            const dispute = await tx.dispute.findFirst({
                where: { orderId, status: 'OPEN' }
            });

            if (dispute) {
                await tx.dispute.update({
                    where: { id: dispute.id },
                    data: {
                        status: 'RESOLVED',
                        adminNotes: adminNotes || 'Escrow manually released by admin',
                        resolutionDate: new Date()
                    }
                });
            }

            return updatedEscrow;
        });

        res.json({
            success: true,
            data: result,
            message: 'Escrow released successfully'
        });

    } catch (error) {
        console.error('Admin Release Escrow Error:', error);
        res.status(500).json({ success: false, error: 'Failed to release escrow' });
    }
};

// Admin: Process Refund
export const adminProcessRefund = async (req, res) => {
    try {
        const { orderId, adminNotes, compensationAmount } = req.body;
        const userId = req.user?.id;

        // Verify admin role
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const escrow = await prisma.escrow.findUnique({
            where: { orderId },
            include: { order: true }
        });

        if (!escrow) {
            return res.status(404).json({ success: false, error: 'Escrow not found' });
        }

        if (escrow.status === 'REFUNDED') {
            return res.status(400).json({ success: false, error: 'Escrow already refunded' });
        }

        // Process refund
        const result = await prisma.$transaction(async (tx) => {
            const updatedEscrow = await tx.escrow.update({
                where: { orderId },
                data: {
                    status: 'REFUNDED',
                    releasedAt: new Date()
                }
            });

            await tx.order.update({
                where: { id: orderId },
                data: { status: 'CANCELLED' }
            });

            // Update dispute
            const dispute = await tx.dispute.findFirst({
                where: { orderId, status: { in: ['OPEN', 'UNDER_REVIEW'] } }
            });

            if (dispute) {
                await tx.dispute.update({
                    where: { id: dispute.id },
                    data: {
                        status: 'RESOLVED',
                        adminNotes: adminNotes || 'Refund processed by admin',
                        resolutionDate: new Date(),
                        compensationAmount: compensationAmount || escrow.amount
                    }
                });
            }

            // TODO: Integrate with payment gateway for actual refund
            // For now, just mark as refunded in database

            return updatedEscrow;
        });

        res.json({
            success: true,
            data: result,
            message: 'Refund processed successfully'
        });

    } catch (error) {
        console.error('Admin Process Refund Error:', error);
        res.status(500).json({ success: false, error: 'Failed to process refund' });
    }
};

// Admin: Get All Escrows
export const adminGetAllEscrows = async (req, res) => {
    try {
        const userId = req.user?.id;

        // Verify admin role
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user || user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const { status, page = 1, limit = 20 } = req.query;

        const where = status ? { status: status } : {};

        const escrows = await prisma.escrow.findMany({
            where,
            include: {
                order: {
                    include: {
                        customer: { include: { user: true } },
                        dealer: { include: { user: true } }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip: (Number(page) - 1) * Number(limit),
            take: Number(limit)
        });

        const total = await prisma.escrow.count({ where });

        res.json({
            success: true,
            data: {
                escrows,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total,
                    pages: Math.ceil(total / Number(limit))
                }
            }
        });

    } catch (error) {
        console.error('Admin Get All Escrows Error:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch escrows' });
    }
};

// Auto-release escrow after delivery timeout (called by cron job)
export const autoReleaseEscrow = async (req, res) => {
    try {
        // Find orders delivered > 48 hours ago with escrow still on HOLD
        const cutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago

        const ordersToRelease = await prisma.order.findMany({
            where: {
                status: 'DELIVERED',
                updatedAt: { lt: cutoffDate },
                escrow: {
                    status: 'HOLD'
                }
            },
            include: { escrow: true }
        });

        const results = [];

        for (const order of ordersToRelease) {
            try {
                await prisma.$transaction(async (tx) => {
                    await tx.escrow.update({
                        where: { orderId: order.id },
                        data: {
                            status: 'RELEASED',
                            releasedAt: new Date()
                        }
                    });

                    await tx.order.update({
                        where: { id: order.id },
                        data: { status: 'SETTLED' }
                    });
                });

                results.push({ orderId: order.id, status: 'released' });
            } catch (err) {
                results.push({ orderId: order.id, status: 'failed', error: err.message });
            }
        }

        res.json({
            success: true,
            data: {
                processed: results.length,
                results
            }
        });

    } catch (error) {
        console.error('Auto Release Escrow Error:', error);
        res.status(500).json({ success: false, error: 'Failed to auto-release escrows' });
    }
};
