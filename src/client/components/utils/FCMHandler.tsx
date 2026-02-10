'use client';

import { useEffect } from 'react';
import { requestNotificationPermission } from '@/lib/firebase/fcm-setup';

export default function FCMHandler() {
    useEffect(() => {
        // Only run on client-side
        if (typeof window !== 'undefined') {
            const initFCM = async () => {
                if ('Notification' in window && Notification.permission === 'granted') {
                    await requestNotificationPermission();
                }
            };

            // Delay initialization slightly to ensure browser is ready
            const timer = setTimeout(initFCM, 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    return null; // This component doesn't render anything
}
