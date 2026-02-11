import { Escrow, Order, Customer, Dispute, User, AuditLog } from '../models/index.js';
import escrowService from '../services/escrow.js';
import disputeService from '../services/dispute.js';
import mongoose from 'mongoose';

// Get Escrow Details
export const getEscrow = async (req, res) => {
    try {
        const { orderId } = req.params;

        const escrow = await Escrow.findOne({ orderId })
            .populate({
                path: 'orderId',
                populate: [
                    { path: 'customerId', populate: { path: 'userId', select: 'name email companyName' } },
                    { path: 'dealerId', populate: { path: 'userId', select: 'name email companyName' } },
                    { path: 'items.productId' }
                ]
            });

        if (!escrow) {
            return res.status(404).json({ success: false, error: 'Escrow not found' });
        }

        res.json({ success: true, data: escrow });

    } catch (error) {
        logger.error('Get Escrow Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch escrow' });
    }
};

// Confirm Delivery (Customer) - Triggers Escrow Release
export const confirmDelivery = async (req, res) => {
    try {
        const { orderId } = req.body;
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        // Verify customer owns this order
        const customer = await Customer.findOne({ userId });
        if (!customer) {
            return res.status(403).json({ success: false, error: 'Customer profile required' });
        }

        const order = await Order.findById(orderId).populate('escrow');

        if (!order || order.customerId.toString() !== customer._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized for this order' });
        }

        if (order.status !== 'DELIVERED') {
            return res.status(400).json({
                success: false,
                error: 'Order must be in DELIVERED status to confirm'
            });
        }

        const escrow = await Escrow.findOne({ orderId });
        if (!escrow || escrow.status !== 'HOLD') {
            return res.status(400).json({
                success: false,
                error: 'Escrow not in HOLD status'
            });
        }

        // Release escrow - bypassing T+7 since customer confirmed manually
        // We'll use a direct transaction here as EscrowService.releaseFunds has SLA checks
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const updatedEscrow = await Escrow.findByIdAndUpdate(escrow._id, {
                status: 'RELEASED',
                releasedAt: new Date()
            }, { session, new: true });

            await Order.findByIdAndUpdate(orderId, { status: 'SETTLED' }, { session });

            await session.commitTransaction();

            res.json({
                success: true,
                data: updatedEscrow,
                message: 'Delivery confirmed. Funds released to seller.'
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        logger.error('Confirm Delivery Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to confirm delivery' });
    }
};

// Request Refund (Customer)
export const requestRefund = async (req, res) => {
    try {
        const { orderId, reason } = req.body;
        const userId = req.user._id;

        if (!userId) {
            return res.status(401).json({ success: false, error: 'Unauthorized' });
        }

        // Verify customer owns this order
        const customer = await Customer.findOne({ userId });
        if (!customer) {
            return res.status(403).json({ success: false, error: 'Customer profile required' });
        }

        const order = await Order.findById(orderId).populate('escrow');

        if (!order || order.customerId.toString() !== customer._id.toString()) {
            return res.status(403).json({ success: false, error: 'Not authorized for this order' });
        }

        const escrow = await Escrow.findOne({ orderId });
        if (!escrow || escrow.status !== 'HOLD') {
            return res.status(400).json({
                success: false,
                error: 'Cannot request refund. Escrow already processed.'
            });
        }

        // Use DisputeService to raise dispute + freeze escrow
        const dispute = await disputeService.raiseDispute(orderId, userId, {
            reason: reason || 'Refund requested',
            triggerType: 'CUSTOMER_TO_DEALER'
        });

        res.json({
            success: true,
            data: dispute,
            message: 'Refund request submitted. Admin will review shortly.'
        });

    } catch (error) {
        logger.error('Request Refund Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to request refund' });
    }
};

// Admin: Manual Escrow Release
export const adminReleaseEscrow = async (req, res) => {
    try {
        const { orderId, adminNotes } = req.body;
        const userId = req.user._id;

        // Verify admin role
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const escrow = await Escrow.findOne({ orderId });
        if (!escrow) {
            return res.status(404).json({ success: false, error: 'Escrow not found' });
        }

        if (escrow.status === 'RELEASED') {
            return res.status(400).json({ success: false, error: 'Escrow already released' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const updatedEscrow = await Escrow.findByIdAndUpdate(escrow._id, {
                status: 'RELEASED',
                releasedAt: new Date()
            }, { session, new: true });

            await Order.findByIdAndUpdate(orderId, { status: 'SETTLED' }, { session });

            // If there's an open dispute, resolve it
            const dispute = await Dispute.findOne({ orderId, status: 'OPEN' }).session(session);
            if (dispute) {
                await Dispute.findByIdAndUpdate(dispute._id, {
                    status: 'RESOLVED',
                    resolutionMetadata: {
                        resolution: 'RELEASE',
                        reviewerId: userId,
                        adminNotes: adminNotes || 'Escrow manually released by admin'
                    }
                }, { session });
            }

            await session.commitTransaction();

            res.json({
                success: true,
                data: updatedEscrow,
                message: 'Escrow released successfully'
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        logger.error('Admin Release Escrow Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to release escrow' });
    }
};

// Admin: Process Refund
export const adminProcessRefund = async (req, res) => {
    try {
        const { orderId, adminNotes, compensationAmount } = req.body;
        const userId = req.user._id;

        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const escrow = await Escrow.findOne({ orderId });
        if (!escrow) {
            return res.status(404).json({ success: false, error: 'Escrow not found' });
        }

        if (escrow.status === 'REFUNDED') {
            return res.status(400).json({ success: false, error: 'Escrow already refunded' });
        }

        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const updatedEscrow = await Escrow.findByIdAndUpdate(escrow._id, {
                status: 'REFUNDED',
                refundedAt: new Date()
            }, { session, new: true });

            await Order.findByIdAndUpdate(orderId, { status: 'CANCELLED' }, { session });

            const dispute = await Dispute.findOne({
                orderId,
                status: { $in: ['OPEN', 'UNDER_REVIEW', 'EVIDENCE_COLLECTION'] }
            }).session(session);

            if (dispute) {
                await Dispute.findByIdAndUpdate(dispute._id, {
                    status: 'RESOLVED',
                    resolutionMetadata: {
                        resolution: 'REFUND',
                        reviewerId: userId,
                        adminNotes: adminNotes || 'Refund processed by admin',
                        compensationAmount: compensationAmount || escrow.amount
                    }
                }, { session });
            }

            // TODO: Integrate with payment gateway for actual refund
            // For now, just mark as refunded in database

            await session.commitTransaction();

            res.json({
                success: true,
                data: updatedEscrow,
                message: 'Refund processed successfully'
            });
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }

    } catch (error) {
        console.error('Admin Process Refund Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to process refund' });
    }
};

// Admin: Get All Escrows
export const adminGetAllEscrows = async (req, res) => {
    try {
        if (req.user.role !== 'ADMIN') {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        const { status, page = 1, limit = 20 } = req.query;
        const query = status ? { status } : {};

        const escrows = await Escrow.find(query)
            .populate({
                path: 'orderId',
                populate: [
                    { path: 'customerId', populate: { path: 'userId', select: 'name email' } },
                    { path: 'dealerId', populate: { path: 'userId', select: 'name email' } }
                ]
            })
            .sort({ createdAt: -1 })
            .skip((Number(page) - 1) * Number(limit))
            .limit(Number(limit))
            .lean();

        const total = await Escrow.countDocuments(query);

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
        res.status(500).json({ success: false, error: error.message || 'Failed to fetch escrows' });
    }
};

// Auto-release escrow after delivery timeout (called by cron job)
export const autoReleaseEscrow = async (req, res) => {
    try {
        // Find orders delivered > 48 hours ago with escrow still on HOLD
        const cutoffDate = new Date(Date.now() - 48 * 60 * 60 * 1000); // 48 hours ago

        const ordersToRelease = await Order.find({
            status: 'DELIVERED',
            updatedAt: { $lt: cutoffDate }
        }).populate('escrow');

        const results = [];

        for (const order of ordersToRelease) {
            if (order.escrow && order.escrow.status === 'HOLD') {
                try {
                    const session = await mongoose.startSession();
                    session.startTransaction();
                    try {
                        await Escrow.findByIdAndUpdate(order.escrow._id, {
                            status: 'RELEASED',
                            releasedAt: new Date()
                        }, { session });

                        await Order.findByIdAndUpdate(order._id, { status: 'SETTLED' }, { session });

                        await session.commitTransaction();
                        results.push({ orderId: order._id, status: 'released' });
                    } catch (err) {
                        await session.abortTransaction();
                        results.push({ orderId: order._id, status: 'failed', error: err.message });
                    } finally {
                        session.endSession();
                    }
                } catch (err) {
                    results.push({ orderId: order._id, status: 'failed', error: err.message });
                }
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
        logger.error('Auto Release Escrow Error:', error);
        res.status(500).json({ success: false, error: error.message || 'Failed to auto-release escrows' });
    }
};

export default {
    getEscrow,
    confirmDelivery,
    requestRefund,
    adminReleaseEscrow,
    adminProcessRefund,
    adminGetAllEscrows,
    autoReleaseEscrow
};
