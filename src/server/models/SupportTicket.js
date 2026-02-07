import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['DELIVERY', 'PAYMENT', 'PRODUCT', 'OTHER'], required: true },
    subject: { type: String, required: true },
    status: { type: String, enum: ['OPEN', 'IN_PROGRESS', 'CLOSED'], default: 'OPEN' },
    priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'LOW' },
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.models.SupportTicket || mongoose.model('SupportTicket', SupportTicketSchema);
