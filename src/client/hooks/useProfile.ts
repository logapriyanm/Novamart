'use client';

import { useState, useEffect } from 'react';

export function useProfile<T>(key: string, initialData: T) {
    const [profile, setProfile] = useState<T>(initialData);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load from LocalStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem(key);
        if (saved) {
            try {
                setProfile(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to parse profile data', e);
            }
        }
        setIsLoaded(true);
    }, [key]);

    const saveProfile = (newData: Partial<T>) => {
        const updated = { ...profile, ...newData };
        setProfile(updated);
        localStorage.setItem(key, JSON.stringify(updated));
        // Dispatch a custom event so other components can listen if needed
        window.dispatchEvent(new Event('profile-updated'));
    };

    return { profile, saveProfile, isLoaded };
}
