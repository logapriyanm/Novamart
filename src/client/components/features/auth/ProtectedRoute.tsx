'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Role } from '../../../../lib/api/contract';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated) {
                // Redirect to login if not authenticated
                console.log(`🔒 Access denied to ${pathname}. Redirecting to login.`);
                router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
                return;
            }

            if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                // Redirect to appropriate dashboard if role doesn't match
                console.log(`🚫 Role mismatch for ${pathname}. User: ${user.role}, Allowed: ${allowedRoles.join(', ')}`);
                switch (user.role) {
                    case 'ADMIN': router.replace('/admin/dashboard'); break;
                    case 'MANUFACTURER': router.replace('/manufacturer/dashboard'); break;
                    case 'DEALER': router.replace('/dealer/dashboard'); break;
                    case 'CUSTOMER': router.replace('/customer/orders'); break;
                    default: router.replace('/');
                }
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#EBEBEB]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#10367D] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[#10367D] font-bold text-sm uppercase tracking-widest animate-pulse">Verifying Access</p>
                </div>
            </div>
        );
    }

    // Don't render children if not authenticated or role mismatch (while redirecting)
    if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}
