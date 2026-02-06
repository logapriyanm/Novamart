/**
 * Dispute Service
 * Logic for raising disputes and evidence collection.
 */

import prisma from '../lib/prisma.js';
import EscrowService from './escrow.js';

class DisputeService {
    /**
     * Raise a dispute for an order.
     * Supports multi-party triggers: CUSTOMER_TO_DEALER, DEALER_TO_MANUFACTURER, ADMIN_INTERNAL.
     */
    async raiseDispute(orderId, raisedByUserId, { reason, triggerType = 'CUSTOMER_TO_DEALER' }) {
        return await prisma.$transaction(async (tx) => {
            const dispute = await tx.dispute.create({
                data: {
                    orderId,
                    raisedByUserId,
                    reason,
                    status: 'OPEN',
                    metadata: { triggerType }
                }
            });

            await tx.order.update({
                where: { id: orderId },
                data: { status: 'DISPUTED' }
            });

            // Freeze Escrow Immediately for any dispute
            await EscrowService.freezeFunds(orderId);

            await tx.auditLog.create({
                data: {
                    action: 'DISPUTE_RAISED',
                    entity: 'DISPUTE',
                    entityId: dispute.id,
                    userId: raisedByUserId,
                    reason: `[${triggerType}] ${reason}`
                }
            });

            return dispute;
        });
    }

    /**
     * Add evidence to a dispute with rich metadata.
     */
    async addEvidence(disputeId, userId, { fileUrl, type, gpsCoordinates, timestamp }) {
        return await prisma.evidence.create({
            data: {
                disputeId,
                fileUrl,
                type,
                uploadedBy: userId,
                metadata: {
                    gps: gpsCoordinates,
                    deviceTimestamp: timestamp,
                    uploadAt: new Date()
                }
            }
        });
    }

    /**
     * Evaluate dispute based on automated rules.
     */
    async evaluateRules(disputeId) {
        const dispute = await prisma.dispute.findUnique({
            where: { id: disputeId },
            include: { evidence: true, order: { include: { escrow: true } } }
        });

        if (!dispute) throw new Error('Dispute not found');

        // 1. Evidence Types
        const evidenceTypes = dispute.evidence.map(e => e.type);
        const hasUnboxingVideo = evidenceTypes.includes('UNBOXING_VIDEO');
        const hasPOD = evidenceTypes.includes('POD');
        const hasInvoice = evidenceTypes.includes('INVOICE');

        // 2. SLA & Deadlines (72h Policy)
        const hoursSinceCreation = (Date.now() - new Date(dispute.createdAt).getTime()) / (1000 * 60 * 60);

        // SLA Breach: Seller failed to provide evidence within 72h
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

        // 4. Logic: Wrong Item (Unboxing Video Proof)
        if (dispute.reason.includes('WRONG_ITEM') && hasUnboxingVideo) {
            return {
                resolution: 'REFUND_PENDING_RETURN',
                reason: 'Evidence Validated: Unboxing video confirms claim. Initiating return process.'
            };
        }

        // 5. Expired Return Window Check
        const orderDeliveryDate = await prisma.orderLog.findFirst({
            where: { orderId: dispute.orderId, toState: 'DELIVERED' }
        });

        if (orderDeliveryDate) {
            const daysSinceDelivery = (Date.now() - new Date(orderDeliveryDate.timestamp).getTime()) / (1000 * 60 * 60 * 24);
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
        return await prisma.$transaction(async (tx) => {
            const dispute = await tx.dispute.findUnique({ where: { id: disputeId } });

            // 1. Update Dispute Status
            await tx.dispute.update({
                where: { id: disputeId },
                data: { status: 'RESOLVED', resolutionMetadata: { resolution, reviewerId } }
            });

            // 2. Trigger Escrow action
            if (resolution === 'REFUND') {
                await EscrowService.processRefund(dispute.orderId, null, false); // Full refund
            } else if (resolution === 'RELEASE') {
                await EscrowService.releaseFunds(dispute.orderId);
            }

            // 3. Update Order Status
            await tx.order.update({
                where: { id: dispute.orderId },
                data: { status: resolution === 'REFUND' ? 'CANCELLED' : 'DELIVERED' }
            });

            return { disputeId, resolution, status: 'SUCCESS' };
        });
    }
}

export default new DisputeService();

