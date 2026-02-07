import mongoose from 'mongoose';

const FilterMetadataSchema = new mongoose.Schema({
    categoryId: { type: String, ref: 'CategoryTaxonomy', required: true },
    brands: [{ type: String }],
    priceRange: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 }
    },
    attributes: Map // Dynamic attributes like capacity, color, etc.
}, { timestamps: true });

export default mongoose.models.FilterMetadata || mongoose.model('FilterMetadata', FilterMetadataSchema);
