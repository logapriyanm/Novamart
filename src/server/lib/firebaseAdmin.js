/**
 * Firebase Admin SDK Initialization
 * This service handles server-side push notification delivery.
 */

import logger from './logger.js';

const firebaseAdmin = {
    messaging: () => ({
        send: async (payload) => {
            logger.info('[MOCK FCM] To: %s | Title: %s', payload.token, payload.notification?.title);
            return { success: true, messageId: 'mock-fcm-' + Date.now() };
        },
        sendMulticast: async (payload) => {
            logger.info('[MOCK FCM Multicast] Tokens: %d', payload.tokens?.length);
            return { successCount: payload.tokens.length, failureCount: 0 };
        }
    })
};

export default firebaseAdmin;
