import mongoose from 'mongoose';

const BadgeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    icon: { type: String },
    description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.models.Badge || mongoose.model('Badge', BadgeSchema);
