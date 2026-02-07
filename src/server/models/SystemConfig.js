import mongoose from 'mongoose';

const SystemConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true, index: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    updatedBy: String, // adminId
    updatedAt: { type: Date, default: Date.now }
}, { timestamps: false });

export default mongoose.models.SystemConfig || mongoose.model('SystemConfig', SystemConfigSchema);
