'use client';

import { useAuth as useAuthInternal } from '../context/AuthContext';

export const useAuth = () => {
    return useAuthInternal();
};
