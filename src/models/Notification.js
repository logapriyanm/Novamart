import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    type: { type: String, enum: ['ORDER', 'CHAT', 'SYSTEM'], required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    link: String // Optional URL to redirect user
}, { timestamps: true });

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
