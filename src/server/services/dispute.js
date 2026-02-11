/**
 * Dispute Service
 * Logic for raising disputes and evidence collection.
 */

import { Dispute, Order, Escrow, Evidence, AuditLog } from '../models/index.js';
import systemEvents, { EVENTS } from '../lib/systemEvents.js';
import escrowService from './escrow.js';
import mongoose from 'mongoose';

class DisputeService {
    /**
     * Raise a dispute for an order.
     * Supports multi-party triggers: CUSTOMER_TO_DEALER, DEALER_TO_MANUFACTURER, ADMIN_INTERNAL.
     */
    async raiseDispute(orderId, raisedByUserId, { reason, triggerType = 'CUSTOMER_TO_DEALER' }) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const [dispute] = await Dispute.create([{
                orderId,
                raisedByUserId,
                reason,
                status: 'OPEN',
                metadata: { triggerType }
            }], { session });

            await Order.findByIdAndUpdate(orderId, { status: 'DISPUTED' }, { session });

            // Freeze Escrow Immediately
            await escrowService.freezeFunds(orderId);

            await session.commitTransaction();

            AuditLog.create({
                action: 'DISPUTE_RAISED',
                entityType: 'DISPUTE',
                entityId: dispute._id,
                userId: raisedByUserId,
                metadata: { reason: `[${triggerType}] ${reason}` }
            }).catch(err => console.error('Background Audit Log Failed:', err));

            systemEvents.emit('DISPUTE.RAISED', {
                disputeId: dispute._id,
                orderId,
                raisedByUserId,
                reason: `[${triggerType}] ${reason}`
            });

            return dispute;
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }

    /**
     * Add evidence to a dispute with rich metadata.
     */
    async addEvidence(disputeId, userId, { fileUrl, type, gpsCoordinates, timestamp }) {
        return await Evidence.create({
            disputeId,
            fileUrl,
            type,
            uploadedBy: userId,
            metadata: {
                gps: gpsCoordinates,
                deviceTimestamp: timestamp,
                uploadAt: new Date()
            }
        });
    }

    /**
     * Evaluate dispute based on automated rules.
     */
    async evaluateRules(disputeId) {
        const dispute = await Dispute.findById(disputeId)
            .populate('orderId');

        const evidence = await Evidence.find({ disputeId });

        if (!dispute) throw new Error('Dispute not found');

        // 1. Evidence Types
        const evidenceTypes = evidence.map(e => e.type);
        const hasUnboxingVideo = evidenceTypes.includes('UNBOXING_VIDEO');
        const hasPOD = evidenceTypes.includes('POD');
        const hasInvoice = evidenceTypes.includes('INVOICE');

        // 2. SLA & Deadlines (72h Policy)
        const hoursSinceCreation = (Date.now() - new Date(dispute.createdAt).getTime()) / (1000 * 60 * 60);

        if (hoursSinceCreation > 72 && !hasPOD && !hasInvoice) {
            return {
                resolution: 'AUTO_REFUND_CUSTOMER',
                reason: 'SLA Breach: Seller failed to respond within 72h window.'
            };
        }

        // 3. Logic: Missing POD
        if (dispute.reason.includes('NOT_RECEIVED') && !hasPOD && hoursSinceCreation > 48) {
            return {
                resolution: 'FAVOR_CUSTOMER',
                reason: 'Auto-resolved: No Proof of Delivery (POD) uploaded within 48h deadline.'
            };
        }

        // 4. Logic: Wrong Item
        if (dispute.reason.includes('WRONG_ITEM') && hasUnboxingVideo) {
            return {
                resolution: 'REFUND_PENDING_RETURN',
                reason: 'Evidence Validated: Unboxing video confirms claim. Initiating return process.'
            };
        }

        // 5. Expired Return Window Check
        const order = dispute.orderId;
        const deliveryLog = order.timeline.find(t => t.toState === 'DELIVERED');

        if (deliveryLog) {
            const daysSinceDelivery = (Date.now() - new Date(deliveryLog.createdAt).getTime()) / (1000 * 60 * 60 * 24);
            if (daysSinceDelivery > 14) {
                return {
                    resolution: 'REJECT_DISPUTE',
                    reason: 'Policy Violation: Dispute raised after T+14 return window expired.'
                };
            }
        }

        return { resolution: 'PENDING_ADMIN_REVIEW', reason: 'Requires manual verification of evidence.' };
    }

    /**
     * Final Resolution Execution (Triggers Escrow)
     */
    async resolveDispute(disputeId, resolution, reviewerId) {
        const session = await mongoose.startSession();
        session.startTransaction();
        try {
            const dispute = await Dispute.findById(disputeId).session(session);

            await Dispute.findByIdAndUpdate(disputeId, {
                status: 'RESOLVED',
                resolutionMetadata: { resolution, reviewerId }
            }, { session });

            if (resolution === 'REFUND') {
                await escrowService.processRefund(dispute.orderId, null, false);
            } else if (resolution === 'RELEASE') {
                await escrowService.releaseFunds(dispute.orderId);
            }

            await Order.findByIdAndUpdate(dispute.orderId, {
                status: resolution === 'REFUND' ? 'CANCELLED' : 'DELIVERED'
            }, { session });

            await session.commitTransaction();

            systemEvents.emit('DISPUTE.RESOLVED', {
                disputeId,
                orderId: dispute.orderId,
                resolution,
                reviewerId
            });

            return { disputeId, resolution, status: 'SUCCESS' };
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            session.endSession();
        }
    }
}

export default new DisputeService();
