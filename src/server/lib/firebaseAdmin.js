/**
 * Firebase Admin SDK Initialization
 * This service handles server-side push notification delivery.
 */

// In a real production environment, you would use:
// import admin from 'firebase-admin';
// import serviceAccount from '../../config/firebase-service-account.json';
// admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const firebaseAdmin = {
    messaging: () => ({
        send: async (payload) => {
            console.log('--- [MOCK FIREBASE PUSH] ---');
            console.log('To:', payload.token);
            console.log('Payload:', JSON.stringify(payload.notification, null, 2));
            console.log('---------------------------');
            return { success: true, messageId: 'mock-fcm-' + Date.now() };
        },
        sendMulticast: async (payload) => {
            console.log('--- [MOCK FIREBASE MULTICAST] ---');
            console.log('Tokens:', payload.tokens);
            return { successCount: payload.tokens.length, failureCount: 0 };
        }
    })
};

export default firebaseAdmin;
