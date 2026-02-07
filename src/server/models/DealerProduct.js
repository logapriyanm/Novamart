import mongoose from 'mongoose';

const DealerProductSchema = new mongoose.Schema({
    dealerId: { type: String, required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductMaster', required: true, index: true },
    retailPrice: { type: Number, required: true },
    stock: { type: Number, required: true, min: 0 },
    deliveryOptions: [String],
    warranty: String,
    status: {
        type: String,
        enum: ['ACTIVE', 'PAUSED'],
        default: 'ACTIVE'
    }
}, { timestamps: true });

export default mongoose.models.DealerProduct || mongoose.model('DealerProduct', DealerProductSchema);
