import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String,
        default: null
    },
    type: {
        type: String,
        required: true,
        enum: ['ORDER', 'PAYMENT', 'DELIVERY', 'KYC', 'PRODUCT', 'SECURITY', 'SYSTEM', 'DEALER_REQUEST', 'SELLER_REQUEST', 'PARTNERSHIP', 'NEGOTIATION_STARTED', 'NEGOTIATION_ACCEPTED', 'NEGOTIATION_REJECTED', 'NEGOTIATION_MESSAGE', 'NEGOTIATION_UPDATE', 'ORDER_FULFILLED', 'ORDER_PLACED', 'PRODUCT_REQUEST', 'PRODUCT_APPROVED', 'PRODUCT_REJECTED']
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
