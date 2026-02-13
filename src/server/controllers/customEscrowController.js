import { CustomOrderEscrow, CustomProductRequest, GroupParticipant, Seller, Manufacturer } from '../models/index.js';
import logger from '../lib/logger.js';
import notificationService from '../services/notificationService.js';

/**
 * Create escrow for approved custom request
 */
export const createEscrow = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { advancePercentage } = req.body;

        const request = await CustomProductRequest.findById(requestId)
            .populate('collaborationGroupId');

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'REQUEST_NOT_FOUND',
                message: 'Custom product request not found'
            });
        }

        if (request.status !== 'APPROVED') {
            return res.status(400).json({
                success: false,
                error: 'REQUEST_NOT_APPROVED',
                message: 'Escrow can only be created for approved requests'
            });
        }

        // Check if escrow already exists
        const existingEscrow = await CustomOrderEscrow.findOne({ customRequestId: requestId });
        if (existingEscrow) {
            return res.status(400).json({
                success: false,
                error: 'ESCROW_EXISTS',
                message: 'Escrow already exists for this request'
            });
        }

        // Get final price from manufacturer response
        const totalAmount = request.manufacturerResponse.proposedPrice * request.totalQuantity;
        const advance = advancePercentage || 30; // Default 30%
        const advanceAmount = (totalAmount * advance) / 100;
        const balanceAmount = totalAmount - advanceAmount;

        // Calculate payment splits for group orders
        let participantPayments = [];
        if (request.requestType === 'GROUP') {
            const participants = await GroupParticipant.find({
                groupId: request.collaborationGroupId._id,
                status: 'JOINED'
            }).populate('dealerId userId');

            const totalQuantity = request.totalQuantity;

            for (const participant of participants) {
                const sharePercentage = participant.quantityCommitment / totalQuantity;
                const shareAmount = totalAmount * sharePercentage;
                const advanceShare = advanceAmount * sharePercentage;
                const balanceShare = balanceAmount * sharePercentage;

                participantPayments.push({
                    dealerId: participant.dealerId._id,
                    userId: participant.userId._id,
                    shareAmount,
                    advanceShare,
                    balanceShare,
                    advancePaid: false,
                    balancePaid: false
                });
            }
        } else {
            // Individual order
            const seller = await Seller.findById(request.dealerId);
            participantPayments.push({
                dealerId: seller._id,
                userId: seller.userId,
                shareAmount: totalAmount,
                advanceShare: advanceAmount,
                balanceShare: balanceAmount,
                advancePaid: false,
                balancePaid: false
            });
        }

        // Create escrow
        const escrow = await CustomOrderEscrow.create({
            customRequestId: requestId,
            manufacturerId: request.manufacturerId,
            totalAmount,
            advancePercentage: advance,
            advanceAmount,
            balanceAmount,
            participantPayments,
            status: 'ADVANCE_PENDING'
        });

        // Notify all participants
        for (const payment of participantPayments) {
            await notificationService.create({
                userId: payment.userId,
                type: 'ESCROW_CREATED',
                title: 'Payment Required',
                message: `Advance payment of ₹${payment.advanceShare.toFixed(2)} required for custom order`,
                metadata: { customRequestId: requestId, escrowId: escrow._id }
            });
        }

        res.status(201).json({
            success: true,
            data: escrow,
            message: 'Escrow created successfully'
        });
    } catch (error) {
        logger.error('Create Escrow Error:', error);
        res.status(500).json({
            success: false,
            error: 'ESCROW_CREATION_FAILED',
            message: 'Failed to create escrow'
        });
    }
};

/**
 * Pay advance amount
 */
export const payAdvance = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { transactionId } = req.body;
        const userId = req.user._id;

        const escrow = await CustomOrderEscrow.findOne({ customRequestId: requestId });
        if (!escrow) {
            return res.status(404).json({
                success: false,
                error: 'ESCROW_NOT_FOUND',
                message: 'Escrow not found for this request'
            });
        }

        // Find participant payment
        const participantPayment = escrow.participantPayments.find(
            p => p.userId.toString() === userId.toString()
        );

        if (!participantPayment) {
            return res.status(404).json({
                success: false,
                error: 'PARTICIPANT_NOT_FOUND',
                message: 'You are not a participant in this order'
            });
        }

        if (participantPayment.advancePaid) {
            return res.status(400).json({
                success: false,
                error: 'ALREADY_PAID',
                message: 'Advance payment already completed'
            });
        }

        // Mark as paid
        participantPayment.advancePaid = true;
        participantPayment.advancePaidAt = new Date();
        participantPayment.paymentTransactionIds.push(transactionId);

        // Update escrow totals
        escrow.advancePaid += participantPayment.advanceShare;

        // Check if all participants paid advance
        const allPaidAdvance = escrow.participantPayments.every(p => p.advancePaid);
        if (allPaidAdvance) {
            escrow.status = 'ADVANCE_PAID';

            // Notify manufacturer to start production
            const manufacturer = await Manufacturer.findById(escrow.manufacturerId);
            const manufacturerUser = await User.findById(manufacturer.userId);
            await notificationService.create({
                userId: manufacturerUser._id,
                type: 'ADVANCE_RECEIVED',
                title: 'Advance Payment Received',
                message: 'All advance payments received. You can start production.',
                metadata: { customRequestId: requestId }
            });
        }

        await escrow.save();

        res.json({
            success: true,
            data: escrow,
            message: 'Advance payment recorded successfully'
        });
    } catch (error) {
        logger.error('Pay Advance Error:', error);
        res.status(500).json({
            success: false,
            error: 'PAYMENT_FAILED',
            message: 'Failed to record advance payment'
        });
    }
};

/**
 * Pay balance amount
 */
export const payBalance = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { transactionId } = req.body;
        const userId = req.user._id;

        const escrow = await CustomOrderEscrow.findOne({ customRequestId: requestId });
        if (!escrow) {
            return res.status(404).json({
                success: false,
                error: 'ESCROW_NOT_FOUND',
                message: 'Escrow not found for this request'
            });
        }

        // Check if advance is paid
        if (escrow.status !== 'ADVANCE_PAID' && escrow.status !== 'BALANCE_PENDING') {
            return res.status(400).json({
                success: false,
                error: 'ADVANCE_NOT_PAID',
                message: 'Advance payment must be completed first'
            });
        }

        // Find participant payment
        const participantPayment = escrow.participantPayments.find(
            p => p.userId.toString() === userId.toString()
        );

        if (!participantPayment) {
            return res.status(404).json({
                success: false,
                error: 'PARTICIPANT_NOT_FOUND',
                message: 'You are not a participant in this order'
            });
        }

        if (!participantPayment.advancePaid) {
            return res.status(400).json({
                success: false,
                error: 'ADVANCE_NOT_PAID',
                message: 'You must pay advance first'
            });
        }

        if (participantPayment.balancePaid) {
            return res.status(400).json({
                success: false,
                error: 'ALREADY_PAID',
                message: 'Balance payment already completed'
            });
        }

        // Mark as paid
        participantPayment.balancePaid = true;
        participantPayment.balancePaidAt = new Date();
        participantPayment.paymentTransactionIds.push(transactionId);

        // Update escrow totals
        escrow.balancePaid += participantPayment.balanceShare;

        // Check if all participants paid balance
        const allPaidBalance = escrow.participantPayments.every(p => p.balancePaid);
        if (allPaidBalance) {
            escrow.status = 'BALANCE_PAID';
        } else if (escrow.status === 'ADVANCE_PAID') {
            escrow.status = 'BALANCE_PENDING';
        }

        await escrow.save();

        res.json({
            success: true,
            data: escrow,
            message: 'Balance payment recorded successfully'
        });
    } catch (error) {
        logger.error('Pay Balance Error:', error);
        res.status(500).json({
            success: false,
            error: 'PAYMENT_FAILED',
            message: 'Failed to record balance payment'
        });
    }
};

/**
 * Release payment to manufacturer
 */
export const releaseToManufacturer = async (req, res) => {
    try {
        const { requestId } = req.params;

        const escrow = await CustomOrderEscrow.findOne({ customRequestId: requestId });
        if (!escrow) {
            return res.status(404).json({
                success: false,
                error: 'ESCROW_NOT_FOUND',
                message: 'Escrow not found for this request'
            });
        }

        // Check if all payments are complete
        if (escrow.status !== 'BALANCE_PAID') {
            return res.status(400).json({
                success: false,
                error: 'PAYMENTS_INCOMPLETE',
                message: 'All payments must be completed before release'
            });
        }

        // Verify product is dispatched
        const request = await CustomProductRequest.findById(requestId);
        if (request.status !== 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: 'NOT_DISPATCHED',
                message: 'Product must be dispatched before releasing payment'
            });
        }

        // Release payment
        escrow.releasedToManufacturer = true;
        escrow.releasedAt = new Date();
        escrow.releasedAmount = escrow.totalAmount;
        escrow.status = 'RELEASED';
        await escrow.save();

        // Notify manufacturer
        const manufacturer = await Manufacturer.findById(escrow.manufacturerId);
        const manufacturerUser = await User.findById(manufacturer.userId);
        await notificationService.create({
            userId: manufacturerUser._id,
            type: 'PAYMENT_RELEASED',
            title: 'Payment Released',
            message: `₹${escrow.totalAmount.toFixed(2)} has been released to your account`,
            metadata: { customRequestId: requestId, amount: escrow.totalAmount }
        });

        // Mark collaboration group as completed if applicable
        if (request.requestType === 'GROUP') {
            await CollaborationGroup.findByIdAndUpdate(request.collaborationGroupId, {
                status: 'COMPLETED'
            });
        }

        res.json({
            success: true,
            data: escrow,
            message: 'Payment released to manufacturer successfully'
        });
    } catch (error) {
        logger.error('Release Payment Error:', error);
        res.status(500).json({
            success: false,
            error: 'RELEASE_FAILED',
            message: 'Failed to release payment'
        });
    }
};

/**
 * Get escrow status
 */
export const getEscrowStatus = async (req, res) => {
    try {
        const { requestId } = req.params;
        const userId = req.user._id;

        const escrow = await CustomOrderEscrow.findOne({ customRequestId: requestId })
            .populate('manufacturerId', 'companyName')
            .populate('customRequestId', 'productName status');

        if (!escrow) {
            return res.status(404).json({
                success: false,
                error: 'ESCROW_NOT_FOUND',
                message: 'Escrow not found for this request'
            });
        }

        // Find user's payment info
        const userPayment = escrow.participantPayments.find(
            p => p.userId.toString() === userId.toString()
        );

        res.json({
            success: true,
            data: {
                escrow,
                userPayment: userPayment || null
            }
        });
    } catch (error) {
        logger.error('Get Escrow Status Error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_ESCROW_FAILED',
            message: 'Failed to fetch escrow status'
        });
    }
};

// Missing imports
import User from '../models/User.js';
import CollaborationGroup from '../models/CollaborationGroup.js';

export default {
    createEscrow,
    payAdvance,
    payBalance,
    releaseToManufacturer,
    getEscrowStatus
};
