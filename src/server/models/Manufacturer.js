import mongoose from 'mongoose';

const ManufacturerSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    companyName: { type: String, required: true },
    registrationNo: { type: String, required: true, unique: true },
    businessType: { type: String },
    officialEmail: { type: String },
    phone: { type: String },
    factoryAddress: { type: String, required: true },
    capacity: { type: String },
    categoriesProduced: [String],
    gstNumber: { type: String, required: true, unique: true },
    certifications: [String],
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
        type: String,
        enum: ['NONE', 'PENDING', 'VERIFIED', 'REJECTED'],
        default: 'NONE'
    },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    verifiedAt: { type: Date },
    verificationNotes: { type: String },
    rejectionReason: { type: String },
    logo: { type: String },
    brandDescription: { type: String },
    marketingMaterials: [String],
    bankDetails: { type: mongoose.Schema.Types.Mixed, required: true },
    approvedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seller' }],
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default mongoose.models.Manufacturer || mongoose.model('Manufacturer', ManufacturerSchema);
