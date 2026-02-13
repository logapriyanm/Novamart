import Loader from '@/client/components/ui/Loader';

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

                router.replace(`/auth/login?redirect=${encodeURIComponent(pathname)}`);
                return;
            }

            if (allowedRoles && user && !allowedRoles.includes(user.role)) {
                // Redirect to appropriate dashboard if role doesn't match

                switch (user.role) {
                    case 'ADMIN': router.replace('/admin/dashboard'); break;
                    case 'MANUFACTURER': router.replace('/manufacturer/dashboard'); break;
                    case 'SELLER': router.replace('/seller/dashboard'); break;
                    case 'CUSTOMER': router.replace('/customer/orders'); break;
                    default: router.replace('/');
                }
            }
        }
    }, [isLoading, isAuthenticated, user, allowedRoles, router, pathname]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#EBEBEB]">
                <Loader size="xl" />
            </div>
        );
    }

    // Don't render children if not authenticated or role mismatch (while redirecting)
    if (!isAuthenticated || (allowedRoles && user && !allowedRoles.includes(user.role))) {
        return null;
    }

    return <>{children}</>;
}
