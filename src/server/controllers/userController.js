import prisma from '../lib/prisma.js';

/**
 * Update FCM Token for Push Notifications
 */
export const updateFCMToken = async (req, res) => {
    const { fcmToken } = req.body;
    const userId = req.user.id; // From auth middleware

    try {
        await prisma.user.update({
            where: { id: userId },
            data: { fcmToken }
        });

        res.json({
            success: true,
            message: 'FCM_TOKEN_UPDATED'
        });
    } catch (error) {
        console.error('FCM Token Update Error:', error);
        res.status(500).json({
            success: false,
            error: 'FAILED_TO_UPDATE_TOKEN'
        });
    }
};

export default {
    updateFCMToken
};
