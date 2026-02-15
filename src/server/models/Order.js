import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' }
});

const TimelineSchema = new mongoose.Schema({
    fromState: String,
    toState: String,
    reason: String,
    metadata: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, index: true },
    sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true, index: true },
    status: {
        type: String,
        enum: ['CREATED', 'PAYMENT_PENDING', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'DELIVERY_CONFIRMED', 'SETTLED', 'CANCELLED', 'DISPUTED', 'REFUNDED'],
        default: 'CREATED',
        index: true
    },
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    commissionAmount: { type: Number, required: true, immutable: true },
    sellerPayout: { type: Number }, // Net amount seller receives after settlement
    shippingAddress: { type: mongoose.Schema.Types.Mixed, required: true },
    billingAddress: { type: mongoose.Schema.Types.Mixed },
    items: [OrderItemSchema],
    timeline: [TimelineSchema],
    shipmentTracking: {
        trackingNumber: String,
        carrier: String,
        status: String,
        estimatedDelivery: Date,
        actualDelivery: Date
    },
    idempotencyKey: { type: String, index: true, sparse: true } // For preventing duplicate orders
}, { timestamps: true });

// Compound indexes for common queries
OrderSchema.index({ status: 1, customerId: 1 });
OrderSchema.index({ status: 1, sellerId: 1 });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
