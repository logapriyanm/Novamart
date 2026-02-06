import mongoose from 'mongoose';

const ProductMasterSchema = new mongoose.Schema({
    manufacturerId: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    status: {
        type: String,
        enum: ['DRAFT', 'SUBMITTED', 'APPROVED', 'DISABLED'],
        default: 'DRAFT'
    }
}, { timestamps: true });

export default mongoose.models.ProductMaster || mongoose.model('ProductMaster', ProductMasterSchema);
