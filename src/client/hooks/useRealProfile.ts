'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '../../lib/api/client';
import { toast } from 'sonner';

export function useRealProfile<T>(role: 'dealer' | 'manufacturer') {
    const [profile, setProfile] = useState<T | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const { showSnackbar } = useSnackbar();

    const fetchProfile = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.get<T>(`/${role}/profile`);
            setProfile(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch profile');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, [role]);

    const updateProfile = async (section: string, data: any) => {
        try {
            const result = await apiClient.put<T>(`/${role}/profile`, { section, data });
            setProfile(result);
            toast.success('Profile updated');
            return result;
        } catch (err: any) {
            toast.error('Something went wrong. Please try again.');
            throw new Error(err.message || 'Update failed');
        }
    };

    return { profile, isLoading, error, updateProfile, refetch: fetchProfile };
}
