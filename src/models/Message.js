import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    chatId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
        index: true
    },
    senderId: {
        type: String,
        required: true
    },
    senderRole: {
        type: String,
        enum: ['CUSTOMER', 'DEALER', 'MANUFACTURER', 'ADMIN'],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    messageType: {
        type: String,
        enum: ['TEXT', 'SYSTEM', 'FILE'],
        default: 'TEXT'
    },
    readBy: [{
        userId: String,
        readAt: Date
    }],
    attachments: [{
        url: String,
        fileType: String,
        name: String
    }]
}, { timestamps: true });

// Optimize for fetching message history
MessageSchema.index({ chatId: 1, createdAt: -1 });

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);

