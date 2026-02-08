import prisma from '../lib/prisma.js';

export const uploadDocument = async (req, res) => {
    try {
        const userId = req.user.id;
        const { type } = req.body;

        // In a real scenario, Multer would upload to Cloudinary/S3 and provide a URL.
        // For this implementation, we might receive a URL directly or mocking the upload.
        // Assuming the file middleware puts the file in req.file (if using multer)

        let url = req.body.url;
        if (req.file) {
            // Mocking file upload URL if local
            url = `/uploads/${req.file.filename}`;
        }

        if (!url) {
            return res.status(400).json({ message: 'Document URL or File is required' });
        }

        const document = await prisma.document.create({
            data: {
                userId,
                type,
                url,
                status: 'PENDING'
            }
        });

        // Auto-update User status to UNDER_VERIFICATION if this is their first doc
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (user.status === 'PENDING') {
            await prisma.user.update({
                where: { id: userId },
                data: { status: 'UNDER_VERIFICATION' }
            });
        }

        res.status(201).json({ success: true, data: document });
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Failed to upload document' });
    }
};

export const getMyDocuments = async (req, res) => {
    try {
        const userId = req.user.id;
        const documents = await prisma.document.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });
        res.json({ success: true, data: documents });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch documents' });
    }
};

export const verifyDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const { status, feedback } = req.body; // status: VERIFIED | REJECTED

        const document = await prisma.document.update({
            where: { id: documentId },
            data: {
                status,
                feedback
            }
        });

        // Check if all Documents for this user are Verified
        // If so, update User status to ACTIVE (Verified)
        // This logic depends on required documents per Role.
        // For MVP, we can just check if *any* doc is verified or all uploaded ones.

        // Let's implement a simple check: If this doc is verified, check if user has other pending docs.

        if (status === 'VERIFIED') {
            // Emitting notification to user could happen here
        }

        res.json({ success: true, data: document });
    } catch (error) {
        res.status(500).json({ message: 'Failed to verify document' });
    }
};
