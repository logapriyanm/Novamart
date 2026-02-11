import mongoose from 'mongoose';

const GroupParticipantSchema = new mongoose.Schema({
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'CollaborationGroup', required: true, index: true },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    quantityCommitment: { type: Number, required: true, min: 1 },
    status: {
        type: String,
        enum: ['INVITED', 'JOINED', 'LEFT', 'REMOVED'],
        default: 'INVITED',
        index: true
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'ADVANCE_PAID', 'FULLY_PAID'],
        default: 'PENDING'
    },
    invitedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer' },
    invitedAt: { type: Date, default: Date.now },
    joinedAt: { type: Date },
    leftAt: { type: Date }
}, {
    timestamps: true
});

// Unique constraint: one dealer per group
GroupParticipantSchema.index({ groupId: 1, dealerId: 1 }, { unique: true });

// Index for efficient queries
GroupParticipantSchema.index({ dealerId: 1, status: 1 });

export default mongoose.models.GroupParticipant || mongoose.model('GroupParticipant', GroupParticipantSchema);
