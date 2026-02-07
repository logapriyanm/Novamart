import mongoose from 'mongoose';

const SearchIndexSchema = new mongoose.Schema({
    entity: { type: String, enum: ['PRODUCT'], required: true },
    entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
    searchText: { type: String, required: true },
    keywords: [{ type: String }],
}, { timestamps: true });

SearchIndexSchema.index({ searchText: 'text', keywords: 'text' });

export default mongoose.models.SearchIndex || mongoose.model('SearchIndex', SearchIndexSchema);
