import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { apiClient } from '../api/client';

const firebaseConfig = {
    // These will be populated from env variables in production
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);

export const requestNotificationPermission = async () => {
    try {
        if (!('Notification' in window)) {
            console.log('This browser does not support notifications.');
            return;
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            const messaging = getMessaging(app);

            // Get FCM Token
            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY
            });

            if (token) {
                console.log('FCM Token Generated:', token);
                // Update token on backend for this user
                await apiClient.put('/users/fcm-token', { fcmToken: token });
            } else {
                console.log('No registration token available. Request permission to generate one.');
            }
        } else {
            console.log('Unable to get permission to notify.');
        }
    } catch (error) {
        console.error('An error occurred while retrieving token:', error);
    }
};

export const onMessageListener = () =>
    new Promise((resolve) => {
        const messaging = getMessaging(app);
        onMessage(messaging, (payload) => {
            resolve(payload);
        });
    });
