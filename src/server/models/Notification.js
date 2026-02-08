import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        required: true,
        enum: ['ORDER', 'PAYMENT', 'DELIVERY', 'KYC', 'PRODUCT', 'SECURITY', 'SYSTEM']
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    metadata: {
        type: Object,
        default: {}
    },
    readAt: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
