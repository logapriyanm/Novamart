import mongoose from 'mongoose';

const ProductVersionSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductMaster', required: true, index: true },
    version: { type: Number, required: true },
    specifications: {
        type: Map,
        of: String
    },
    certifications: [String],
    approvedBy: String,
    approvedAt: Date
}, { timestamps: true });

// Ensure Versioning Rule: New version = new document, NEVER overwrite
ProductVersionSchema.index({ productId: 1, version: 1 }, { unique: true });

export default mongoose.models.ProductVersion || mongoose.model('ProductVersion', ProductVersionSchema);
