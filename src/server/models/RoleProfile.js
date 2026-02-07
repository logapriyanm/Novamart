import mongoose from 'mongoose';

const RoleProfileSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true, index: true },
    role: {
        type: String,
        enum: ['MANUFACTURER', 'DEALER', 'CUSTOMER'],
        required: true
    },
    batchId: String, // e.g., MFG-IND-0001
    verified: { type: Boolean, default: false },
    businessName: String,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    }
}, { timestamps: true });

export default mongoose.models.RoleProfile || mongoose.model('RoleProfile', RoleProfileSchema);
