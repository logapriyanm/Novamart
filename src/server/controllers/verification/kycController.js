import { KYCDocument, Manufacturer, Seller, User } from '../../models/index.js';
import logger from '../../lib/logger.js';
import emailService from '../../services/emailService.js';
import { TrustBadge } from '../../models/index.js';

// Upload KYC Documents
export const uploadKYCDocument = async (req, res) => {
    try {
        const userId = req.user._id;
        const { role } = req.user;
        const { documents } = req.body; // Array of { type, number, fileUrl }

        if (!documents || !Array.isArray(documents) || documents.length === 0) {
            return res.status(400).json({ success: false, error: 'Documents required' });
        }

        // Create KYC document record
        const kycDoc = new KYCDocument({
            userId,
            role,
            documents: documents.map(doc => ({
                type: doc.type,
                number: doc.number,
                fileUrl: doc.fileUrl,
                verified: false
            })),
            status: 'PENDING'
        });

        await kycDoc.save();

        // Update manufacturer/seller verificationStatus to PENDING
        if (role === 'MANUFACTURER') {
            await Manufacturer.findOneAndUpdate(
                { userId },
                { verificationStatus: 'PENDING' }
            );
        } else if (role === 'SELLER') {
            await Seller.findOneAndUpdate(
                { userId },
                { verificationStatus: 'PENDING' }
            );
        }

        logger.info(`KYC documents uploaded by ${role}`, { userId, documentCount: documents.length });

        res.status(201).json({
            success: true,
            data: kycDoc,
            message: 'Documents uploaded successfully. Verification in progress.'
        });
    } catch (error) {
        logger.error('KYC upload failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Get user's KYC documents
export const getMyKYCDocuments = async (req, res) => {
    try {
        const userId = req.user._id;

        const kycDocs = await KYCDocument.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, data: kycDocs });
    } catch (error) {
        logger.error('Failed to fetch KYC documents:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Admin: Get pending KYC documents
export const getPendingKYCDocuments = async (req, res) => {
    try {
        const { role } = req.query; // Filter by MANUFACTURER or SELLER

        const query = { status: 'PENDING' };
        if (role) query.role = role;

        const kycDocs = await KYCDocument.find(query)
            .populate('userId', 'email role')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: kycDocs });
    } catch (error) {
        logger.error('Failed to fetch pending KYC:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Admin: Review KYC document
export const reviewKYCDocument = async (req, res) => {
    try {
        const { id } = req.params;
        const { action, notes, rejectionReason } = req.body; // action: 'APPROVE' | 'REJECT'
        const adminId = req.user._id;

        if (!['APPROVE', 'REJECT'].includes(action)) {
            return res.status(400).json({ success: false, error: 'Invalid action' });
        }

        const kycDoc = await KYCDocument.findById(id).populate('userId');
        if (!kycDoc) {
            return res.status(404).json({ success: false, error: 'KYC document not found' });
        }

        const userId = kycDoc.userId._id;
        const role = kycDoc.role;

        if (action === 'APPROVE') {
            // Update KYC document
            kycDoc.status = 'APPROVED';
            kycDoc.verifiedBy = adminId;
            kycDoc.verifiedAt = new Date();
            kycDoc.documents.forEach(doc => doc.verified = true);
            await kycDoc.save();

            // Update Manufacturer/Seller
            const updateData = {
                isVerified: true,
                verificationStatus: 'VERIFIED',
                verifiedBy: adminId,
                verifiedAt: new Date(),
                verificationNotes: notes || ''
            };

            if (role === 'MANUFACTURER') {
                await Manufacturer.findOneAndUpdate({ userId }, updateData);

                // Create trust badge
                await TrustBadge.findOneAndUpdate(
                    { userId: userId.toString(), badge: 'VERIFIED_MANUFACTURER' },
                    {
                        userId: userId.toString(),
                        badge: 'VERIFIED_MANUFACTURER',
                        issuedBy: adminId.toString(),
                        issuedAt: new Date(),
                        revoked: false
                    },
                    { upsert: true }
                );
            } else if (role === 'SELLER') {
                await Seller.findOneAndUpdate({ userId }, updateData);

                // Create trust badge
                await TrustBadge.findOneAndUpdate(
                    { userId: userId.toString(), badge: 'VERIFIED_SELLER' },
                    {
                        userId: userId.toString(),
                        badge: 'VERIFIED_SELLER',
                        issuedBy: adminId.toString(),
                        issuedAt: new Date(),
                        revoked: false
                    },
                    { upsert: true }
                );
            }

            // Send approval email
            if (kycDoc.userId.email) {
                await emailService.sendEmail({
                    to: kycDoc.userId.email,
                    subject: 'Verification Approved - NovaMart',
                    html: `
                        <h2>Congratulations!</h2>
                        <p>Your business verification has been approved.</p>
                        <p>You now have a verified badge on your profile.</p>
                    `
                });
            }

            logger.info(`KYC approved for ${role}`, { userId, adminId });
        } else {
            // Reject
            kycDoc.status = 'REJECTED';
            kycDoc.verifiedBy = adminId;
            kycDoc.verifiedAt = new Date();
            await kycDoc.save();

            const updateData = {
                verificationStatus: 'REJECTED',
                rejectionReason: rejectionReason || 'Documents did not meet requirements'
            };

            if (role === 'MANUFACTURER') {
                await Manufacturer.findOneAndUpdate({ userId }, updateData);
            } else if (role === 'SELLER') {
                await Seller.findOneAndUpdate({ userId }, updateData);
            }

            // Send rejection email
            if (kycDoc.userId.email) {
                await emailService.sendEmail({
                    to: kycDoc.userId.email,
                    subject: 'Verification Update - NovaMart',
                    html: `
                        <h2>Verification Status Update</h2>
                        <p>We were unable to verify your documents at this time.</p>
                        <p><strong>Reason:</strong> ${rejectionReason || 'Documents did not meet requirements'}</p>
                        <p>You can resubmit your documents from your profile page.</p>
                    `
                });
            }

            logger.info(`KYC rejected for ${role}`, { userId, adminId, reason: rejectionReason });
        }

        res.json({
            success: true,
            message: `Verification ${action.toLowerCase()}d successfully`
        });
    } catch (error) {
        logger.error('KYC review failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

// Admin: Revoke verification
export const revokeVerification = async (req, res) => {
    try {
        const { userId, role } = req.body;
        const { reason } = req.body;
        const adminId = req.user._id;

        if (!userId || !role) {
            return res.status(400).json({ success: false, error: 'userId and role required' });
        }

        const updateData = {
            isVerified: false,
            verificationStatus: 'REJECTED',
            rejectionReason: reason || 'Verification revoked by admin'
        };

        if (role === 'MANUFACTURER') {
            await Manufacturer.findOneAndUpdate({ userId }, updateData);

            // Revoke badge
            await TrustBadge.findOneAndUpdate(
                { userId: userId.toString(), badge: 'VERIFIED_MANUFACTURER' },
                { revoked: true }
            );
        } else if (role === 'SELLER') {
            await Seller.findOneAndUpdate({ userId }, updateData);

            // Revoke badge
            await TrustBadge.findOneAndUpdate(
                { userId: userId.toString(), badge: 'VERIFIED_SELLER' },
                { revoked: true }
            );
        }

        logger.info(`Verification revoked for ${role}`, { userId, adminId, reason });

        res.json({
            success: true,
            message: 'Verification revoked successfully'
        });
    } catch (error) {
        logger.error('Revoke verification failed:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export default {
    uploadKYCDocument,
    getMyKYCDocuments,
    getPendingKYCDocuments,
    reviewKYCDocument,
    revokeVerification
};
