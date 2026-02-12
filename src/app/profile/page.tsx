'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Loader from '@/client/components/ui/Loader';

export default function ProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/customer/profile');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader size="xl" variant="primary" />
        </div>
    );
}
