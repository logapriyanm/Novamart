import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    role: {
        type: String,
        enum: ['ADMIN', 'MANUFACTURER', 'DEALER', 'CUSTOMER'],
        required: true
    },
    status: {
        type: String,
        enum: ['PENDING', 'ACTIVE', 'SUSPENDED', 'BLOCKED'],
        default: 'PENDING'
    },
    lastLoginAt: Date
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', UserSchema);
