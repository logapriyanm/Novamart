'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProfileRedirect() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/customer/profile');
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-[#10367D] uppercase tracking-[0.3em] animate-pulse">
            Syncing Profile Data...
        </div>
    );
}
