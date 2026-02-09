import { getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { apiClient } from '../api/client';

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const getFirebaseMessaging = () => {
    if (typeof window === 'undefined') return null;

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    try {
        return getMessaging(app);
    } catch (error) {
        console.warn('Firebase Messaging failed to initialize', error);
        return null; // Fallback for environments where messaging isn't supported
    }
};

export const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        console.log('Notifications not supported in this environment.');
        return;
    }

    try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            const messaging = getFirebaseMessaging();
            if (!messaging) return;

            // Explicitly register Service Worker for FCM
            // We use 'register' to ensure it's installed, then 'ready' to ensure it's active
            try {
                await navigator.serviceWorker.register('/firebase-messaging-sw.js');
            } catch (err) {
                console.error('Service Worker registration failed:', err);
                return;
            }

            // Wait for the Service Worker to be ready (ACTIVE status)
            // This prevents "Subscription failed - no active Service Worker" errors
            const registration = await navigator.serviceWorker.ready;
            console.log('Service Worker is ready and active:', registration.scope);

            const token = await getToken(messaging, {
                vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
                serviceWorkerRegistration: registration
            });

            if (token) {
                console.log('FCM Token Generated:', token);
                await apiClient.put('/users/fcm-token', { fcmToken: token });
            } else {
                console.log('No registration token available.');
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
        const messaging = getFirebaseMessaging();
        if (messaging) {
            onMessage(messaging, (payload) => {
                resolve(payload);
            });
        }
    });
