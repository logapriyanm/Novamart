import mongoose from 'mongoose';

const SessionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    token: { type: String, required: true, unique: true },
    ipAddress: { type: String },
    device: { type: String },
    expiresAt: { type: Date, required: true }
}, { timestamps: true });

export default mongoose.models.Session || mongoose.model('Session', SessionSchema);
