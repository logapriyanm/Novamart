import mongoose from 'mongoose';

const AdminActionSchema = new mongoose.Schema({
    adminId: { type: String, required: true, index: true },
    action: { type: String, required: true }, // e.g., APPROVED_PRODUCT, FREEZE_USER
    entity: { type: String, required: true }, // entity ID
    details: mongoose.Schema.Types.Mixed
}, { timestamps: { createdAt: true, updatedAt: false } });

AdminActionSchema.index({ adminId: 1, action: 1 });

export default mongoose.models.AdminAction || mongoose.model('AdminAction', AdminActionSchema);
