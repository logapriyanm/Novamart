'use client';

import React from 'react';
import { useAuth } from '@/client/context/AuthContext';
import UnifiedChat from '@/client/components/features/chat/UnifiedChat';
import { FaRegClock } from 'react-icons/fa';

export default function ManufacturerMessagingCenter() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="flex flex-col gap-8 animate-fade-in text-slate-900 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold italic uppercase tracking-tight text-slate-900">Partner Communications</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Direct Seller & Distributor Channels</p>
                </div>
            </div>

            <UnifiedChat currentUserRole="MANUFACTURER" currentUserId={user.id} />
        </div>
    );
}
