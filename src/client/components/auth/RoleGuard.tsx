'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Role } from '../../../lib/api/contract';
import { FaSpinner } from 'react-icons/fa';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: Role[];
}

export default function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                router.push('/auth/login');
            } else if (user && !allowedRoles.includes(user.role)) {
                router.push('/unauthorized'); // Or back to their dashboard
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <FaSpinner className="w-8 h-8 text-[#10367D] animate-spin" />
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Verifying Access...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
        return null; // Don't render anything while redirecting
    }

    return <>{children}</>;
}
