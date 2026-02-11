import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true }, // Using Number for Decimal
    wholesalePrice: { type: Number },
    moq: { type: Number, default: 1 },
    category: { type: String, required: true, index: true },
    colors: [String],
    sizes: [String],
    images: [String],
    video: { type: String },
    specifications: { type: mongoose.Schema.Types.Mixed }, // For JSON fields
    status: {
        type: String,
        enum: ['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'DISABLED'],
        default: 'DRAFT',
        index: true
    },
    isApproved: { type: Boolean, default: false },
    rejectionReason: { type: String },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: true },
    taxCategory: { type: String }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, status: 1 });

// Virtual for Inventory
ProductSchema.virtual('inventory', {
    ref: 'Inventory',
    localField: '_id',
    foreignField: 'productId'
});

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
