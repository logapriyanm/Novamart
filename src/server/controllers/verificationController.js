import { KYCDocument, User } from '../models/index.js';

export const uploadDocument = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        const { type, number } = req.body;

        let url = req.body.url;
        if (req.file) {
            url = `/uploads/${req.file.filename}`;
        }

        if (!url) {
            return res.status(400).json({ message: 'Document URL or File is required' });
        }

        let kycDoc = await KYCDocument.findOne({ userId });
        if (!kycDoc) {
            kycDoc = new KYCDocument({
                userId,
                role,
                documents: []
            });
        }

        kycDoc.documents.push({
            type,
            number: number || 'N/A',
            fileUrl: url,
            verified: false
        });

        await kycDoc.save();

        const user = await User.findById(userId);
        if (user.status === 'PENDING') {
            user.status = 'UNDER_VERIFICATION';
            await user.save();
        }

        res.status(201).json({ success: true, data: kycDoc });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Failed to upload document' });
    }
};

export const getMyDocuments = async (req, res) => {
    try {
        const userId = req.user._id;
        const kycDoc = await KYCDocument.findOne({ userId }).sort({ createdAt: -1 });
        res.json({ success: true, data: kycDoc ? kycDoc.documents : [] });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch documents' });
    }
};

export const verifyDocument = async (req, res) => {
    try {
        const { documentId, subDocId } = req.params; // Using params to identify specific doc in array
        const { status, feedback } = req.body;

        const kycDoc = await KYCDocument.findById(documentId);
        if (!kycDoc) return res.status(404).json({ message: 'KYC Record not found' });

        if (subDocId) {
            const doc = kycDoc.documents.id(subDocId);
            if (doc) {
                doc.verified = status === 'VERIFIED';
            }
        }

        kycDoc.status = status;
        // Optionally update individual doc status if needed
        await kycDoc.save();

        if (status === 'APPROVE' || status === 'APPROVED') {
            // Logic to update User status to ACTIVE if all docs verified
            // For now simple update
            await User.findByIdAndUpdate(kycDoc.userId, { status: 'ACTIVE' });
        }

        res.json({ success: true, data: kycDoc });
    } catch (error) {
        console.error('Verify Doc Error:', error);
        res.status(500).json({ message: 'Failed to verify document' });
    }
};

export const deleteDocument = async (req, res) => {
    try {
        const userId = req.user._id;
        const { documentId } = req.params;

        const kycDoc = await KYCDocument.findOne({ userId });
        if (!kycDoc) return res.status(404).json({ message: 'KYC Record not found' });

        // Filter out the document to delete
        kycDoc.documents = kycDoc.documents.filter(d => d._id.toString() !== documentId);

        // If no documents left, reset status
        if (kycDoc.documents.length === 0) {
            kycDoc.status = 'PENDING'; // Or NONE/INITIAL
        }

        await kycDoc.save();

        // Check if user status needs reset
        // If they were PENDING verification and removed docs, maybe keep PENDING or move to INACTIVE?
        // For now, if no docs, we can't verify them.
        if (kycDoc.documents.length === 0) {
            await User.findByIdAndUpdate(userId, { status: 'PENDING', isVerified: false });
        }

        res.json({ success: true, message: 'Document deleted', data: kycDoc });
    } catch (error) {
        console.error('Delete Doc Error:', error);
        res.status(500).json({ message: 'Failed to delete document' });
    }
};

