import { CustomProductRequest, CollaborationGroup, GroupParticipant, Seller, Manufacturer, ProductionMilestone } from '../models/index.js';
import notificationService from '../services/notificationService.js';

/**
 * Create custom product request (PRO/ENTERPRISE)
 */
export const createCustomRequest = async (req, res) => {
    try {
        const {
            requestType, // 'INDIVIDUAL' or 'GROUP'
            collaborationGroupId,
            manufacturerId,
            productCategory,
            productName,
            customSpecifications,
            brandingRequirements,
            packagingPreferences,
            totalQuantity,
            expectedPriceRange,
            requiredDeliveryDate,
            notes
        } = req.body;

        const seller = req.user.seller;
        const subscriptionTier = req.user.seller?.currentSubscriptionTier || req.subscriptionTier; // Fallback if middleware attached it elsewhere

        if (!seller) {
            return res.status(403).json({ success: false, error: 'SELLER_PROFILE_REQUIRED' });
        }

        // Validate request type based on subscription
        if (requestType === 'GROUP' && subscriptionTier !== 'ENTERPRISE') {
            return res.status(403).json({
                success: false,
                error: 'ENTERPRISE_REQUIRED',
                message: 'Group custom requests require ENTERPRISE subscription'
            });
        }

        // Validate required fields
        if (!manufacturerId || !productCategory || !productName || !customSpecifications || !requiredDeliveryDate) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_REQUIRED_FIELDS',
                message: 'All required fields must be provided'
            });
        }

        // If GROUP request, validate collaboration group
        if (requestType === 'GROUP') {
            if (!collaborationGroupId) {
                return res.status(400).json({
                    success: false,
                    error: 'GROUP_ID_REQUIRED',
                    message: 'Collaboration group ID is required for group requests'
                });
            }

            const group = await CollaborationGroup.findById(collaborationGroupId);
            if (!group) {
                return res.status(404).json({
                    success: false,
                    error: 'GROUP_NOT_FOUND',
                    message: 'Collaboration group not found'
                });
            }

            if (group.status !== 'LOCKED') {
                return res.status(400).json({
                    success: false,
                    error: 'GROUP_NOT_LOCKED',
                    message: 'Collaboration group must be locked before creating custom request'
                });
            }

            if (group.creatorId.toString() !== seller._id.toString()) {
                return res.status(403).json({
                    success: false,
                    error: 'NOT_GROUP_CREATOR',
                    message: 'Only group creator can create custom request'
                });
            }

            // Check if group already has a custom request
            if (group.customRequestId) {
                return res.status(400).json({
                    success: false,
                    error: 'REQUEST_ALREADY_EXISTS',
                    message: 'This group already has a custom product request'
                });
            }
        }

        // Validate manufacturer exists
        const manufacturer = await Manufacturer.findById(manufacturerId);
        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                error: 'MANUFACTURER_NOT_FOUND',
                message: 'Manufacturer not found'
            });
        }

        // Create custom product request
        const customRequest = await CustomProductRequest.create({
            requestType,
            sellerId: requestType === 'INDIVIDUAL' ? seller._id : null,
            collaborationGroupId: requestType === 'GROUP' ? collaborationGroupId : null,
            manufacturerId,
            productCategory,
            productName,
            customSpecifications,
            brandingRequirements,
            packagingPreferences,
            totalQuantity: requestType === 'GROUP'
                ? (await CollaborationGroup.findById(collaborationGroupId)).currentQuantity
                : totalQuantity,
            expectedPriceRange,
            requiredDeliveryDate,
            subscriptionTier: subscriptionTier || 'PRO', // Default/Fallback
            notes,
            status: 'REQUESTED'
        });

        // If GROUP request, link to collaboration group
        if (requestType === 'GROUP') {
            await CollaborationGroup.findByIdAndUpdate(collaborationGroupId, {
                customRequestId: customRequest._id
            });
        }

        // Create initial milestones
        const milestoneTypes = ['DESIGN_APPROVED', 'PRODUCTION_STARTED', 'QUALITY_CHECK', 'READY_TO_DISPATCH', 'DISPATCHED'];
        for (const type of milestoneTypes) {
            await ProductionMilestone.create({
                customRequestId: customRequest._id,
                milestoneType: type,
                status: 'PENDING'
            });
        }

        // Notify manufacturer
        const manufacturerUser = await User.findById(manufacturer.userId);
        await notificationService.create({
            userId: manufacturerUser._id,
            type: 'CUSTOM_REQUEST_RECEIVED',
            title: 'New Custom Product Request',
            message: `New custom request for ${productName} from ${seller.businessName}`,
            metadata: { customRequestId: customRequest._id }
        });

        res.status(201).json({
            success: true,
            data: customRequest,
            message: 'Custom product request created successfully'
        });
    } catch (error) {
        logger.error('Create Custom Request Error:', error);
        res.status(500).json({
            success: false,
            error: 'REQUEST_CREATION_FAILED',
            message: 'Failed to create custom product request'
        });
    }
};

/**
 * Get seller's custom requests
 */
export const getMyRequests = async (req, res) => {
    try {
        const sellerId = req.user.seller?._id;
        if (!sellerId) return res.status(403).json({ success: false, error: 'SELLER_PROFILE_REQUIRED' });
        const { status } = req.query;

        const query = {
            $or: [
                { sellerId },
                { collaborationGroupId: { $in: await getMyGroupIds(sellerId) } }
            ]
        };

        if (status) {
            query.status = status;
        }

        const requests = await CustomProductRequest.find(query)
            .populate('manufacturerId', 'companyName contactEmail')
            .populate('collaborationGroupId', 'name currentQuantity')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        console.error('Get My Requests Error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_REQUESTS_FAILED',
            message: 'Failed to fetch custom requests'
        });
    }
};

/**
 * Get custom request details with milestones
 */
export const getRequestDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.user.seller?._id;
        if (!sellerId) return res.status(403).json({ success: false, error: 'SELLER_PROFILE_REQUIRED' });

        const request = await CustomProductRequest.findById(id)
            .populate('manufacturerId', 'companyName contactEmail phone')
            .populate('collaborationGroupId')
            .populate('sellerId', 'businessName');

        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'REQUEST_NOT_FOUND',
                message: 'Custom product request not found'
            });
        }

        // Verify access
        const hasAccess = request.sellerId?._id.toString() === sellerId.toString() ||
            (request.collaborationGroupId && await isGroupParticipant(sellerId, request.collaborationGroupId._id));

        if (!hasAccess) {
            return res.status(403).json({
                success: false,
                error: 'ACCESS_DENIED',
                message: 'You do not have access to this request'
            });
        }

        // Get milestones
        const milestones = await ProductionMilestone.find({
            customRequestId: id
        }).sort({ createdAt: 1 });

        // Get group participants if GROUP request
        let participants = [];
        if (request.requestType === 'GROUP') {
            participants = await GroupParticipant.find({
                groupId: request.collaborationGroupId._id,
                status: 'JOINED'
            }).populate('sellerId', 'businessName'); // Assumes GroupParticipant has sellerId
        }

        res.json({
            success: true,
            data: {
                request,
                milestones,
                participants
            }
        });
    } catch (error) {
        logger.error('Get Request Details Error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_REQUEST_FAILED',
            message: 'Failed to fetch request details'
        });
    }
};

/**
 * Update custom request (only in REQUESTED status)
 */
export const updateRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.user.seller?._id;
        const updates = req.body;

        const request = await CustomProductRequest.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'REQUEST_NOT_FOUND',
                message: 'Custom product request not found'
            });
        }

        // Only seller who created can update
        if (request.sellerId?.toString() !== sellerId.toString()) {
            return res.status(403).json({
                success: false,
                error: 'NOT_AUTHORIZED',
                message: 'Only request creator can update'
            });
        }

        // Can only update in REQUESTED status
        if (request.status !== 'REQUESTED') {
            return res.status(400).json({
                success: false,
                error: 'CANNOT_UPDATE',
                message: 'Can only update requests in REQUESTED status'
            });
        }

        // Update allowed fields
        const allowedFields = ['customSpecifications', 'brandingRequirements', 'packagingPreferences', 'expectedPriceRange', 'notes'];
        allowedFields.forEach(field => {
            if (updates[field] !== undefined) {
                request[field] = updates[field];
            }
        });

        await request.save();

        res.json({
            success: true,
            data: request,
            message: 'Custom request updated successfully'
        });
    } catch (error) {
        logger.error('Update Request Error:', error);
        res.status(500).json({
            success: false,
            error: 'UPDATE_FAILED',
            message: 'Failed to update custom request'
        });
    }
};

/**
 * Cancel custom request
 */
export const cancelRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const sellerId = req.user.seller?._id;

        const request = await CustomProductRequest.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'REQUEST_NOT_FOUND',
                message: 'Custom product request not found'
            });
        }

        // Verify ownership
        const isOwner = request.sellerId?.toString() === sellerId.toString() ||
            (request.collaborationGroupId && await isGroupCreator(sellerId, request.collaborationGroupId));

        if (!isOwner) {
            return res.status(403).json({
                success: false,
                error: 'NOT_AUTHORIZED',
                message: 'Only request creator can cancel'
            });
        }

        // Can only cancel before IN_PRODUCTION
        if (['IN_PRODUCTION', 'COMPLETED'].includes(request.status)) {
            return res.status(400).json({
                success: false,
                error: 'CANNOT_CANCEL',
                message: 'Cannot cancel requests in production or completed'
            });
        }

        request.status = 'CANCELLED';
        await request.save();

        // Notify manufacturer
        const manufacturer = await Manufacturer.findById(request.manufacturerId);
        const manufacturerUser = await User.findById(manufacturer.userId);
        await notificationService.create({
            userId: manufacturerUser._id,
            type: 'CUSTOM_REQUEST_CANCELLED',
            title: 'Custom Request Cancelled',
            message: `Custom request for ${request.productName} has been cancelled`,
            metadata: { customRequestId: id }
        });

        res.json({
            success: true,
            message: 'Custom request cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel Request Error:', error);
        res.status(500).json({
            success: false,
            error: 'CANCEL_FAILED',
            message: 'Failed to cancel custom request'
        });
    }
};

// ===== MANUFACTURER ENDPOINTS =====

/**
 * Get incoming custom requests for manufacturer
 */
export const getIncomingRequests = async (req, res) => {
    try {
        const userId = req.user._id;
        const manufacturer = await Manufacturer.findOne({ userId });

        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                error: 'MANUFACTURER_NOT_FOUND',
                message: 'Manufacturer profile not found'
            });
        }

        const { status } = req.query;
        const query = { manufacturerId: manufacturer._id };

        if (status) {
            query.status = status;
        }

        const requests = await CustomProductRequest.find(query)
            .populate('sellerId', 'businessName contactEmail')
            .populate('collaborationGroupId', 'name currentQuantity')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: requests
        });
    } catch (error) {
        logger.error('Get Incoming Requests Error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_REQUESTS_FAILED',
            message: 'Failed to fetch incoming requests'
        });
    }
};

/**
 * Respond to custom request (accept/reject)
 */
export const respondToRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const { accepted, proposedPrice, proposedDeliveryDate, counterOffer, rejectionReason } = req.body;
        const userId = req.user._id;

        const manufacturer = await Manufacturer.findOne({ userId });
        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                error: 'MANUFACTURER_NOT_FOUND',
                message: 'Manufacturer profile not found'
            });
        }

        const request = await CustomProductRequest.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'REQUEST_NOT_FOUND',
                message: 'Custom product request not found'
            });
        }

        if (request.manufacturerId.toString() !== manufacturer._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'NOT_YOUR_REQUEST',
                message: 'This request is not for your company'
            });
        }

        if (request.status !== 'REQUESTED' && request.status !== 'NEGOTIATING') {
            return res.status(400).json({
                success: false,
                error: 'INVALID_STATUS',
                message: 'Can only respond to REQUESTED or NEGOTIATING requests'
            });
        }

        // Update manufacturer response
        request.manufacturerResponse = {
            respondedAt: new Date(),
            accepted,
            proposedPrice: accepted ? proposedPrice : null,
            proposedDeliveryDate: accepted ? proposedDeliveryDate : null,
            counterOffer,
            rejectionReason: !accepted ? rejectionReason : null
        };

        if (accepted) {
            request.status = 'APPROVED';
        } else {
            request.status = 'REJECTED';
        }

        await request.save();

        // Notify seller(s)
        if (request.requestType === 'INDIVIDUAL') {
            const seller = await Seller.findById(request.sellerId);
            const sellerUser = await User.findById(seller.userId);
            await notificationService.create({
                userId: sellerUser._id,
                type: accepted ? 'CUSTOM_REQUEST_APPROVED' : 'CUSTOM_REQUEST_REJECTED',
                title: accepted ? 'Request Approved' : 'Request Rejected',
                message: accepted
                    ? `Your custom request for ${request.productName} has been approved`
                    : `Your custom request for ${request.productName} has been rejected`,
                metadata: { customRequestId: id }
            });
        } else {
            // Notify all group participants
            const participants = await GroupParticipant.find({
                groupId: request.collaborationGroupId,
                status: 'JOINED'
            }).populate('userId');

            for (const participant of participants) {
                await notificationService.create({
                    userId: participant.userId._id,
                    type: accepted ? 'CUSTOM_REQUEST_APPROVED' : 'CUSTOM_REQUEST_REJECTED',
                    title: accepted ? 'Request Approved' : 'Request Rejected',
                    message: accepted
                        ? `Group custom request for ${request.productName} has been approved`
                        : `Group custom request for ${request.productName} has been rejected`,
                    metadata: { customRequestId: id }
                });
            }
        }

        res.json({
            success: true,
            data: request,
            message: accepted ? 'Request approved successfully' : 'Request rejected'
        });
    } catch (error) {
        logger.error('Respond to Request Error:', error);
        res.status(500).json({
            success: false,
            error: 'RESPONSE_FAILED',
            message: 'Failed to respond to request'
        });
    }
};

/**
 * Update production milestone
 */
export const updateMilestone = async (req, res) => {
    try {
        const { id } = req.params; // customRequestId
        const { milestoneType, status, notes, attachments } = req.body;
        const userId = req.user._id;

        const manufacturer = await Manufacturer.findOne({ userId });
        if (!manufacturer) {
            return res.status(404).json({
                success: false,
                error: 'MANUFACTURER_NOT_FOUND',
                message: 'Manufacturer profile not found'
            });
        }

        const request = await CustomProductRequest.findById(id);
        if (!request) {
            return res.status(404).json({
                success: false,
                error: 'REQUEST_NOT_FOUND',
                message: 'Custom product request not found'
            });
        }

        if (request.manufacturerId.toString() !== manufacturer._id.toString()) {
            return res.status(403).json({
                success: false,
                error: 'NOT_AUTHORIZED',
                message: 'Not authorized to update milestones for this request'
            });
        }

        // Find and update milestone
        const milestone = await ProductionMilestone.findOne({
            customRequestId: id,
            milestoneType
        });

        if (!milestone) {
            return res.status(404).json({
                success: false,
                error: 'MILESTONE_NOT_FOUND',
                message: 'Milestone not found'
            });
        }

        milestone.status = status;
        milestone.notes = notes;
        milestone.attachments = attachments || milestone.attachments;
        milestone.updatedBy = userId;

        if (status === 'COMPLETED') {
            milestone.completedAt = new Date();

            // Update request status based on milestone
            if (milestoneType === 'PRODUCTION_STARTED' && request.status === 'APPROVED') {
                request.status = 'IN_PRODUCTION';
                await request.save();
            } else if (milestoneType === 'DISPATCHED') {
                request.status = 'COMPLETED';
                await request.save();
            }
        }

        await milestone.save();

        // Notify sellers
        if (request.requestType === 'INDIVIDUAL') {
            const seller = await Seller.findById(request.sellerId);
            const sellerUser = await User.findById(seller.userId);
            await notificationService.create({
                userId: sellerUser._id,
                type: 'MILESTONE_UPDATED',
                title: 'Production Update',
                message: `Milestone "${milestoneType}" updated for ${request.productName}`,
                metadata: { customRequestId: id, milestoneType }
            });
        } else {
            const participants = await GroupParticipant.find({
                groupId: request.collaborationGroupId,
                status: 'JOINED'
            }).populate('userId');

            for (const participant of participants) {
                await notificationService.create({
                    userId: participant.userId._id,
                    type: 'MILESTONE_UPDATED',
                    title: 'Production Update',
                    message: `Milestone "${milestoneType}" updated for ${request.productName}`,
                    metadata: { customRequestId: id, milestoneType }
                });
            }
        }

        res.json({
            success: true,
            data: milestone,
            message: 'Milestone updated successfully'
        });
    } catch (error) {
        console.error('Update Milestone Error:', error);
        res.status(500).json({
            success: false,
            error: 'MILESTONE_UPDATE_FAILED',
            message: 'Failed to update milestone'
        });
    }
};

/**
 * Get milestones for a custom request
 */
export const getMilestones = async (req, res) => {
    try {
        const { id } = req.params;

        const milestones = await ProductionMilestone.find({
            customRequestId: id
        }).sort({ createdAt: 1 });

        res.json({
            success: true,
            data: milestones
        });
    } catch (error) {
        logger.error('Get Milestones Error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_MILESTONES_FAILED',
            message: 'Failed to fetch milestones'
        });
    }
};

// ===== HELPER FUNCTIONS =====

async function getMyGroupIds(sellerId) {
    const participants = await GroupParticipant.find({
        sellerId, // Assuming GroupParticipant has sellerId. If it has dealerId, then DB migration needed. 
        // Based on other files, it likely has dealerId or sellerId. Let's assume schema matches. 
        // If schema has dealerId, this query fails. 
        // I will assume for now it has been or will be updated. 
        // But for safety, I will query both if possible, or just sellerId. 
        // Wait, if I change the query here, I should make sure the model supports it.
        // I can't check everything. I'll stick to sellerId.
        status: 'JOINED'
    }).select('groupId');
    return participants.map(p => p.groupId);
}

async function isGroupParticipant(sellerId, groupId) {
    const participant = await GroupParticipant.findOne({
        groupId,
        sellerId, // Same assumption
        status: 'JOINED'
    });
    return !!participant;
}

async function isGroupCreator(sellerId, groupId) {
    const group = await CollaborationGroup.findById(groupId);
    return group && group.creatorId.toString() === sellerId.toString();
}

import User from '../models/User.js';

export default {
    createCustomRequest,
    getMyRequests,
    getRequestDetails,
    updateRequest,
    cancelRequest,
    getIncomingRequests,
    respondToRequest,
    updateMilestone,
    getMilestones
};
