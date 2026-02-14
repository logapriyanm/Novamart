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
                    <h1 className="text-3xl font-black tracking-tight italic">Partner <span className="text-[#067FF9]">Communications</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">Direct Dealer & Distributor Channels</p>
                </div>
                <div className="hidden md:flex items-center gap-4 py-3 px-6 bg-emerald-50/50 border border-emerald-100 rounded-[10px]">
                    <FaRegClock className="text-emerald-600 w-4 h-4" />
                    <span className="text-sm font-black uppercase text-slate-900">Response Rate: <span className="text-emerald-600">98%</span></span>
                </div>
            </div>

            <UnifiedChat currentUserRole="MANUFACTURER" currentUserId={user.id} />
        </div>
    );
}
