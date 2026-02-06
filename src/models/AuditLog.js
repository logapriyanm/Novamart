import mongoose from 'mongoose';

const AuditLogSchema = new mongoose.Schema({
    actorId: { type: String, required: true, index: true },
    role: { type: String, required: true },
    action: { type: String, required: true },
    entity: String, // ID of the object being acted upon
    ip: String,
    details: mongoose.Schema.Types.Mixed
}, { timestamps: { createdAt: true, updatedAt: false } });

// Immutability Rule: Audit logs are NEVER editable or deletable
AuditLogSchema.index({ actorId: 1, createdAt: -1 });

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
