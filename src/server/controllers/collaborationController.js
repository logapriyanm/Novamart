import { CollaborationGroup, GroupParticipant, Dealer, User } from '../models/index.js';
import notificationService from '../services/notificationService.js';

/**
 * Create a new collaboration group (ENTERPRISE only)
 */
export const createGroup = async (req, res) => {
    try {
        const { name, description, category, targetQuantity, requiredDeliveryDate, invitedDealerIds } = req.body;
        const creatorDealer = req.dealer;

        // Validate required fields
        if (!name || !category || !targetQuantity || !requiredDeliveryDate) {
            return res.status(400).json({
                success: false,
                error: 'MISSING_REQUIRED_FIELDS',
                message: 'Name, category, target quantity, and delivery date are required'
            });
        }

        // Validate delivery date is in future
        if (new Date(requiredDeliveryDate) <= new Date()) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_DELIVERY_DATE',
                message: 'Delivery date must be in the future'
            });
        }

        // Create collaboration group
        const group = await CollaborationGroup.create({
            name,
            description,
            creatorId: creatorDealer._id,
            category,
            targetQuantity,
            requiredDeliveryDate,
            status: 'CREATED'
        });

        // Add creator as first participant
        await GroupParticipant.create({
            groupId: group._id,
            dealerId: creatorDealer._id,
            userId: req.user._id,
            quantityCommitment: 0, // Creator can set later
            status: 'JOINED',
            joinedAt: new Date()
        });

        // Invite other dealers if provided
        if (invitedDealerIds && invitedDealerIds.length > 0) {
            for (const dealerId of invitedDealerIds) {
                const invitedDealer = await Dealer.findById(dealerId);
                if (invitedDealer && invitedDealer.currentSubscriptionTier === 'ENTERPRISE') {
                    await GroupParticipant.create({
                        groupId: group._id,
                        dealerId: invitedDealer._id,
                        userId: invitedDealer.userId,
                        quantityCommitment: 0,
                        status: 'INVITED',
                        invitedBy: creatorDealer._id
                    });

                    // Send notification
                    await notificationService.create({
                        userId: invitedDealer.userId,
                        type: 'COLLABORATION_INVITE',
                        title: 'Collaboration Group Invitation',
                        message: `You've been invited to join "${name}" collaboration group`,
                        metadata: { groupId: group._id }
                    });
                }
            }
        }

        res.status(201).json({
            success: true,
            data: group,
            message: 'Collaboration group created successfully'
        });
    } catch (error) {
        console.error('Create Group Error:', error);
        res.status(500).json({
            success: false,
            error: 'GROUP_CREATION_FAILED',
            message: 'Failed to create collaboration group'
        });
    }
};

/**
 * Get dealer's collaboration groups
 */
export const getMyGroups = async (req, res) => {
    try {
        const dealerId = req.dealer._id;

        // Find all groups where dealer is a participant
        const participants = await GroupParticipant.find({
            dealerId,
            status: { $in: ['INVITED', 'JOINED'] }
        }).select('groupId');

        const groupIds = participants.map(p => p.groupId);

        const groups = await CollaborationGroup.find({
            _id: { $in: groupIds }
        })
            .populate('creatorId', 'businessName')
            .sort({ createdAt: -1 });

        // Get participant counts for each group
        const groupsWithCounts = await Promise.all(groups.map(async (group) => {
            const participantCount = await GroupParticipant.countDocuments({
                groupId: group._id,
                status: 'JOINED'
            });

            return {
                ...group.toObject(),
                participantCount
            };
        }));

        res.json({
            success: true,
            data: groupsWithCounts
        });
    } catch (error) {
        console.error('Get My Groups Error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_GROUPS_FAILED',
            message: 'Failed to fetch collaboration groups'
        });
    }
};

/**
 * Get group details with participants
 */
export const getGroupDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const dealerId = req.dealer._id;

        const group = await CollaborationGroup.findById(id)
            .populate('creatorId', 'businessName ownerName contactEmail')
            .populate('customRequestId');

        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'GROUP_NOT_FOUND',
                message: 'Collaboration group not found'
            });
        }

        // Verify dealer is a participant
        const isParticipant = await GroupParticipant.findOne({
            groupId: id,
            dealerId,
            status: { $in: ['INVITED', 'JOINED'] }
        });

        if (!isParticipant) {
            return res.status(403).json({
                success: false,
                error: 'NOT_A_PARTICIPANT',
                message: 'You are not a participant in this group'
            });
        }

        // Get all participants
        const participants = await GroupParticipant.find({
            groupId: id,
            status: { $in: ['INVITED', 'JOINED'] }
        })
            .populate('dealerId', 'businessName ownerName')
            .populate('userId', 'email')
            .sort({ joinedAt: 1 });

        res.json({
            success: true,
            data: {
                group,
                participants,
                isCreator: group.creatorId._id.toString() === dealerId.toString()
            }
        });
    } catch (error) {
        console.error('Get Group Details Error:', error);
        res.status(500).json({
            success: false,
            error: 'FETCH_GROUP_FAILED',
            message: 'Failed to fetch group details'
        });
    }
};

/**
 * Invite dealer to group
 */
export const inviteDealer = async (req, res) => {
    try {
        const { id } = req.params;
        const { dealerId: invitedDealerId } = req.body;
        const creatorDealer = req.dealer;

        const group = await CollaborationGroup.findById(id);
        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'GROUP_NOT_FOUND',
                message: 'Collaboration group not found'
            });
        }

        // Verify user is creator or participant
        if (group.creatorId.toString() !== creatorDealer._id.toString()) {
            const isParticipant = await GroupParticipant.findOne({
                groupId: id,
                dealerId: creatorDealer._id,
                status: 'JOINED'
            });

            if (!isParticipant) {
                return res.status(403).json({
                    success: false,
                    error: 'NOT_AUTHORIZED',
                    message: 'Only group creator or participants can invite dealers'
                });
            }
        }

        // Check if group is locked
        if (group.status === 'LOCKED' || group.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: 'GROUP_LOCKED',
                message: 'Cannot invite dealers to a locked or completed group'
            });
        }

        // Verify invited dealer exists and has ENTERPRISE subscription
        const invitedDealer = await Dealer.findById(invitedDealerId);
        if (!invitedDealer) {
            return res.status(404).json({
                success: false,
                error: 'DEALER_NOT_FOUND',
                message: 'Invited dealer not found'
            });
        }

        if (invitedDealer.currentSubscriptionTier !== 'ENTERPRISE') {
            return res.status(400).json({
                success: false,
                error: 'SUBSCRIPTION_REQUIRED',
                message: 'Invited dealer must have ENTERPRISE subscription'
            });
        }

        // Check if already invited or joined
        const existing = await GroupParticipant.findOne({
            groupId: id,
            dealerId: invitedDealerId
        });

        if (existing) {
            return res.status(400).json({
                success: false,
                error: 'ALREADY_INVITED',
                message: 'Dealer is already invited or part of this group'
            });
        }

        // Create invitation
        await GroupParticipant.create({
            groupId: id,
            dealerId: invitedDealerId,
            userId: invitedDealer.userId,
            quantityCommitment: 0,
            status: 'INVITED',
            invitedBy: creatorDealer._id
        });

        // Send notification
        await notificationService.create({
            userId: invitedDealer.userId,
            type: 'COLLABORATION_INVITE',
            title: 'Collaboration Group Invitation',
            message: `You've been invited to join "${group.name}" collaboration group`,
            metadata: { groupId: id }
        });

        res.json({
            success: true,
            message: 'Dealer invited successfully'
        });
    } catch (error) {
        console.error('Invite Dealer Error:', error);
        res.status(500).json({
            success: false,
            error: 'INVITATION_FAILED',
            message: 'Failed to invite dealer'
        });
    }
};

/**
 * Join collaboration group
 */
export const joinGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const { quantityCommitment } = req.body;
        const dealerId = req.dealer._id;

        if (!quantityCommitment || quantityCommitment <= 0) {
            return res.status(400).json({
                success: false,
                error: 'INVALID_QUANTITY',
                message: 'Quantity commitment must be greater than 0'
            });
        }

        const group = await CollaborationGroup.findById(id);
        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'GROUP_NOT_FOUND',
                message: 'Collaboration group not found'
            });
        }

        if (group.status === 'LOCKED' || group.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: 'GROUP_LOCKED',
                message: 'Cannot join a locked or completed group'
            });
        }

        // Find invitation
        const participant = await GroupParticipant.findOne({
            groupId: id,
            dealerId,
            status: 'INVITED'
        });

        if (!participant) {
            return res.status(404).json({
                success: false,
                error: 'NO_INVITATION',
                message: 'You have not been invited to this group'
            });
        }

        // Update participant status
        participant.status = 'JOINED';
        participant.quantityCommitment = quantityCommitment;
        participant.joinedAt = new Date();
        await participant.save();

        // Update group current quantity
        group.currentQuantity += quantityCommitment;
        if (group.status === 'CREATED') {
            group.status = 'ACTIVE';
        }
        await group.save();

        // Notify group creator
        await notificationService.create({
            userId: (await Dealer.findById(group.creatorId)).userId,
            type: 'COLLABORATION_JOINED',
            title: 'New Group Member',
            message: `A dealer has joined "${group.name}" collaboration group`,
            metadata: { groupId: id }
        });

        res.json({
            success: true,
            message: 'Successfully joined collaboration group',
            data: { group, participant }
        });
    } catch (error) {
        console.error('Join Group Error:', error);
        res.status(500).json({
            success: false,
            error: 'JOIN_FAILED',
            message: 'Failed to join collaboration group'
        });
    }
};

/**
 * Leave collaboration group
 */
export const leaveGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const dealerId = req.dealer._id;

        const group = await CollaborationGroup.findById(id);
        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'GROUP_NOT_FOUND',
                message: 'Collaboration group not found'
            });
        }

        // Cannot leave if locked or completed
        if (group.status === 'LOCKED' || group.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: 'GROUP_LOCKED',
                message: 'Cannot leave a locked or completed group'
            });
        }

        // Cannot leave if you're the creator
        if (group.creatorId.toString() === dealerId.toString()) {
            return res.status(400).json({
                success: false,
                error: 'CREATOR_CANNOT_LEAVE',
                message: 'Group creator cannot leave. Cancel the group instead.'
            });
        }

        const participant = await GroupParticipant.findOne({
            groupId: id,
            dealerId,
            status: 'JOINED'
        });

        if (!participant) {
            return res.status(404).json({
                success: false,
                error: 'NOT_A_MEMBER',
                message: 'You are not a member of this group'
            });
        }

        // Update group quantity
        group.currentQuantity -= participant.quantityCommitment;
        await group.save();

        // Update participant status
        participant.status = 'LEFT';
        participant.leftAt = new Date();
        await participant.save();

        res.json({
            success: true,
            message: 'Successfully left collaboration group'
        });
    } catch (error) {
        console.error('Leave Group Error:', error);
        res.status(500).json({
            success: false,
            error: 'LEAVE_FAILED',
            message: 'Failed to leave collaboration group'
        });
    }
};

/**
 * Lock collaboration group (finalize and prevent changes)
 */
export const lockGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const dealerId = req.dealer._id;

        const group = await CollaborationGroup.findById(id);
        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'GROUP_NOT_FOUND',
                message: 'Collaboration group not found'
            });
        }

        // Only creator can lock
        if (group.creatorId.toString() !== dealerId.toString()) {
            return res.status(403).json({
                success: false,
                error: 'NOT_AUTHORIZED',
                message: 'Only group creator can lock the group'
            });
        }

        if (group.status === 'LOCKED' || group.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: 'ALREADY_LOCKED',
                message: 'Group is already locked or completed'
            });
        }

        // Verify minimum participants (at least 2 including creator)
        const participantCount = await GroupParticipant.countDocuments({
            groupId: id,
            status: 'JOINED'
        });

        if (participantCount < 2) {
            return res.status(400).json({
                success: false,
                error: 'INSUFFICIENT_PARTICIPANTS',
                message: 'At least 2 dealers must join before locking the group'
            });
        }

        group.status = 'LOCKED';
        await group.save();

        // Notify all participants
        const participants = await GroupParticipant.find({
            groupId: id,
            status: 'JOINED'
        }).populate('userId');

        for (const participant of participants) {
            await notificationService.create({
                userId: participant.userId._id,
                type: 'COLLABORATION_LOCKED',
                title: 'Group Locked',
                message: `"${group.name}" collaboration group has been locked and is ready for custom product request`,
                metadata: { groupId: id }
            });
        }

        res.json({
            success: true,
            message: 'Collaboration group locked successfully',
            data: group
        });
    } catch (error) {
        console.error('Lock Group Error:', error);
        res.status(500).json({
            success: false,
            error: 'LOCK_FAILED',
            message: 'Failed to lock collaboration group'
        });
    }
};

/**
 * Cancel collaboration group
 */
export const cancelGroup = async (req, res) => {
    try {
        const { id } = req.params;
        const dealerId = req.dealer._id;

        const group = await CollaborationGroup.findById(id);
        if (!group) {
            return res.status(404).json({
                success: false,
                error: 'GROUP_NOT_FOUND',
                message: 'Collaboration group not found'
            });
        }

        // Only creator can cancel
        if (group.creatorId.toString() !== dealerId.toString()) {
            return res.status(403).json({
                success: false,
                error: 'NOT_AUTHORIZED',
                message: 'Only group creator can cancel the group'
            });
        }

        // Cannot cancel if locked or completed
        if (group.status === 'LOCKED' || group.status === 'COMPLETED') {
            return res.status(400).json({
                success: false,
                error: 'CANNOT_CANCEL',
                message: 'Cannot cancel a locked or completed group'
            });
        }

        group.status = 'CANCELLED';
        await group.save();

        // Notify all participants
        const participants = await GroupParticipant.find({
            groupId: id,
            status: { $in: ['INVITED', 'JOINED'] }
        }).populate('userId');

        for (const participant of participants) {
            await notificationService.create({
                userId: participant.userId._id,
                type: 'COLLABORATION_CANCELLED',
                title: 'Group Cancelled',
                message: `"${group.name}" collaboration group has been cancelled`,
                metadata: { groupId: id }
            });
        }

        res.json({
            success: true,
            message: 'Collaboration group cancelled successfully'
        });
    } catch (error) {
        console.error('Cancel Group Error:', error);
        res.status(500).json({
            success: false,
            error: 'CANCEL_FAILED',
            message: 'Failed to cancel collaboration group'
        });
    }
};

export default {
    createGroup,
    getMyGroups,
    getGroupDetails,
    inviteDealer,
    joinGroup,
    leaveGroup,
    lockGroup,
    cancelGroup
};
