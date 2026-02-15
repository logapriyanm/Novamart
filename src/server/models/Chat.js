import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['PRE_PURCHASE', 'ORDER', 'NEGOTIATION', 'ESCALATION'],
        required: true
    },
    contextId: {
        type: String, // productId, orderId, or dealerProductId
        required: true,
        index: true
    },
    participants: [{
        userId: { type: String, required: true },
        role: {
            type: String,
            enum: ['CUSTOMER', 'SELLER', 'MANUFACTURER', 'ADMIN'],
            required: true
        }
    }],
    status: {
        type: String,
        enum: ['OPEN', 'RESOLVED', 'CLOSED'],
        default: 'OPEN'
    },
    lastMessage: {
        text: String,
        senderId: String,
        createdAt: Date
    },
    closedAt: Date
}, { timestamps: true });

// Ensure unique chat for specific context and participants (optional but recommended)
// ChatSchema.index({ type: 1, contextId: 1, 'participants.userId': 1 });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

