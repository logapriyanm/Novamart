import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true, unique: true, index: true },
    razorpayOrderId: { type: String, index: true, sparse: true }, // Allow duplicates for Batch Orders
    razorpayPaymentId: { type: String, unique: true, sparse: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'PENDING' },
    method: { type: String }
}, { timestamps: true });

export default mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
