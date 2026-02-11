/**
 * Tax Rule Model
 * GST slabs for different categories.
 */
import mongoose from 'mongoose';

const taxRuleSchema = new mongoose.Schema({
    category: { type: String, required: true },
    taxSlab: { type: Number, required: true, default: 18 }, // Percentage
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('TaxRule', taxRuleSchema);
