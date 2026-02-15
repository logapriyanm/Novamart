import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    color: { type: String },
    size: { type: String }
});

const CartSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true, unique: true, index: true },
    items: [CartItemSchema]
}, { timestamps: true });

export default mongoose.models.Cart || mongoose.model('Cart', CartSchema);
