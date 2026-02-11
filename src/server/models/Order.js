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
    dealerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dealer', required: true, index: true },
    status: {
        type: String,
        enum: ['CREATED', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'SETTLED', 'CANCELLED', 'DISPUTED', 'OUT_FOR_DELIVERY'],
        default: 'CREATED',
        index: true
    },
    totalAmount: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    commissionAmount: { type: Number, required: true },
    shippingAddress: { type: String, required: true },
    billingAddress: { type: String },
    items: [OrderItemSchema],
    timeline: [TimelineSchema],
    shipmentTracking: {
        trackingNumber: String,
        carrier: String,
        status: String,
        estimatedDelivery: Date,
        actualDelivery: Date
    }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
