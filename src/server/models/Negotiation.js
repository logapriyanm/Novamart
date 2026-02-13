import mongoose from 'mongoose';

const NegotiationSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    manufacturerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Manufacturer', required: true, index: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true, index: true },
    status: {
        type: String,
        enum: ['OPEN', 'ACCEPTED', 'REJECTED', 'ORDER_REQUESTED', 'ORDER_FULFILLED'],
        default: 'OPEN',
        index: true
    },
    currentOffer: { type: Number, required: true },
    quantity: { type: Number, required: true },
    chatLog: { type: mongoose.Schema.Types.Mixed } // Keeping for legacy or audit, though Chat model is primary
}, { timestamps: true });

export default mongoose.models.Negotiation || mongoose.model('Negotiation', NegotiationSchema);
