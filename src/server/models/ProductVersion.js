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

ProductVersionSchema.pre('save', function (next) {
    if (!this.isNew) {
        return next(new Error('IMMUTABILITY_ERROR: Product versions cannot be modified. Create a new version instead.'));
    }
    next();
});

ProductVersionSchema.pre(['remove', 'deleteOne', 'findOneAndDelete'], function (next) {
    next(new Error('IMMUTABILITY_ERROR: Product versions cannot be deleted.'));
});

export default mongoose.models.ProductVersion || mongoose.model('ProductVersion', ProductVersionSchema);
