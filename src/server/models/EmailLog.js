import mongoose from 'mongoose';

const EmailLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    emailType: {
        type: String,
        enum: [
            'WELCOME_CUSTOMER',
            'WELCOME_SELLER',
            'WELCOME_MANUFACTURER',
            'FORGOT_PASSWORD',
            'ORDER_CONFIRMATION',
            'ORDER_SHIPPED',
            'ORDER_DELIVERED',
            'PAYMENT_CONFIRMATION'
        ],
        required: true
    },
    recipientEmail: {
        type: String,
        required: true
    },
    orderId: {
        type: String, // String to support both ObjectId and custom IDs if needed
        index: true
    },
    status: {
        type: String,
        enum: ['SENT', 'FAILED', 'QUEUED'],
        default: 'SENT'
    },
    messageId: {
        type: String
    },
    metadata: {
        type: Object // Flexible field for extra data (e.g., error message, specific params)
    },
    sentAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 60 * 24 * 90 // Auto-delete logs after 90 days
    }
}, { timestamps: true });

// Compound index for duplicate prevention (e.g., one welcome email per user)
EmailLogSchema.index({ userId: 1, emailType: 1, orderId: 1 });

const EmailLog = mongoose.model('EmailLog', EmailLogSchema);

export default EmailLog;
