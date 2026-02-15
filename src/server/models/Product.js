import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    basePrice: { type: Number, required: true, min: 0.01 }, // Wholesale Base Price
    wholesalePrice: { type: Number }, // Deprecated or alias? Keeping for safety.
    tierPricing: [{
        minQuantity: { type: Number, required: true },
        pricePerUnit: { type: Number, required: true }
    }],
    sku: { type: String, required: true, unique: true, index: true },
    stockQuantity: { type: Number, default: 0, min: 0 }, // Manufacturer's Global Stock
    lowStockThreshold: { type: Number, default: 10 },
    moq: { type: Number, default: 1 },
    category: { type: String, required: true, index: true },
    subcategory: { type: String, index: true },
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
    publishedFor: {
        type: String,
        enum: ['B2B', 'B2C', 'BOTH'],
        default: 'B2B'
    },
    isApproved: { type: Boolean, default: false },
    rejectionReason: { type: String },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    showOnHome: { type: Boolean, default: true },
    taxCategory: { type: String },
    isDeleted: { type: Boolean, default: false, index: true }
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
