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

AuditLogSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next(new Error('IMMUTABILITY_ERROR: Audit logs cannot be modified.'));
    }
    next();
});

AuditLogSchema.pre(['remove', 'deleteOne', 'findOneAndDelete'], function (next) {
    next(new Error('IMMUTABILITY_ERROR: Audit logs cannot be deleted.'));
});

export default mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
