import mongoose from 'mongoose';

const CategoryTaxonomySchema = new mongoose.Schema({
    _id: { type: String, required: true }, // e.g., 'cat_washing_machine'
    name: { type: String, required: true },
    parentId: { type: String, ref: 'CategoryTaxonomy', default: null },
    filtersAllowed: [{ type: String }], // e.g., ["brand", "price", "capacity"]
}, { timestamps: true });

export default mongoose.models.CategoryTaxonomy || mongoose.model('CategoryTaxonomy', CategoryTaxonomySchema);
