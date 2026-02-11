import mongoose from 'mongoose';

const InventorySchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true, index: true },
    region: { type: String, required: true },
    stock: { type: Number, default: 0 },
    locked: { type: Number, default: 0 },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    discount: { type: Number },
    orderCount: { type: Number, default: 0 },
    allocatedStock: { type: Number },
    dealerBasePrice: { type: Number },
    dealerMoq: { type: Number },
    isAllocated: { type: Boolean, default: false },
    isListed: { type: Boolean, default: false },
    listedAt: { type: Date },
    marginPercent: { type: Number },
    maxMargin: { type: Number }
}, { timestamps: true });

InventorySchema.index({ dealerId: 1, productId: 1 }, { unique: true });

export default mongoose.models.Inventory || mongoose.model('Inventory', InventorySchema);
