/**
 * Margin Rule Model
 * Platform-wide constraints on retail markups by category.
 */
import mongoose from 'mongoose';

const marginRuleSchema = new mongoose.Schema({
    category: { type: String, required: true },
    maxCap: { type: Number, required: true }, // Percentage (e.g. 25 for 25%)
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('MarginRule', marginRuleSchema);
