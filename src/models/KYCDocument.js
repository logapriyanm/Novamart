import mongoose from 'mongoose';

const KYCDocumentSchema = new mongoose.Schema({
    userId: { type: String, required: true, index: true },
    role: { type: String, required: true },
    documents: [{
        type: { type: String, required: true }, // e.g., GST, PAN, IEC
        number: { type: String, required: true },
        fileUrl: { type: String, required: true },
        verified: { type: Boolean, default: false }
    }],
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED'],
        default: 'PENDING'
    },
    verifiedBy: String, // adminId
    verifiedAt: Date
}, { timestamps: true });

// Schema index to handle historical docs (append-only logic)
KYCDocumentSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.models.KYCDocument || mongoose.model('KYCDocument', KYCDocumentSchema);
