import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    region: { type: String, required: true },
    stock: { type: Number, default: 0 },
    locked: { type: Number, default: 0 },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number },
    orderCount: { type: Number, default: 0 },
    allocatedStock: { type: Number },
    sellerBasePrice: { type: Number },
    sellerMoq: { type: Number },
    isAllocated: { type: Boolean, default: false },
    isListed: { type: Boolean, default: false },
    listedAt: { type: Date },
    marginPercent: { type: Number },
    maxMargin: { type: Number },

    // Allocation Status
    allocationStatus: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'NONE'],
        default: 'APPROVED' // Default to APPROVED for backward compatibility/admin creation
    },
    requestedQuantity: { type: Number }, // Amount requested by seller

    // NEW: Allocation-based inventory tracking
    allocationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Allocation' }, // Link to allocation
    soldQuantity: { type: Number, default: 0 }, // Total sold from this allocation
    remainingQuantity: { type: Number }, // Computed: allocated - sold
    retailPrice: { type: Number }, // Seller's retail price
    negotiatedPrice: { type: Number }, // Price from allocation/negotiation
    minRetailPrice: { type: Number }, // Min allowed: negotiatedPrice * 1.05

    // Custom Details (Seller Overrides)
    customName: { type: String },
    customDescription: { type: String },
    customImages: [{ type: String }],

    // NEW: Full Product Details Overrides
    customCategory: { type: String },
    customSubCategory: { type: String },
    customMainCategory: { type: String },
    customSpecifications: { type: Map, of: String }, // Flexible key-value pairs

}, { timestamps: true });

InventorySchema.index({ sellerId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
