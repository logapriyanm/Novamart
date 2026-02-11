'use client';

import React from 'react';
import { useAuth } from '@/client/context/AuthContext';
import UnifiedChat from '@/client/components/features/chat/UnifiedChat';
import { FaRegClock } from 'react-icons/fa';

export default function ManufacturerMessagingCenter() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="flex flex-col gap-8 animate-fade-in text-[#1E293B] h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Partner <span className="text-[#10367D]">Communications</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Direct Dealer & Distributor Channels</p>
                </div>
                <div className="hidden md:flex items-center gap-4 py-3 px-6 bg-emerald-50/50 border border-emerald-100 rounded-[10px]">
                    <FaRegClock className="text-emerald-600 w-4 h-4" />
                    <span className="text-[10px] font-black uppercase text-[#1E293B]">Response Rate: <span className="text-emerald-600">98%</span></span>
                </div>
            </div>

            <UnifiedChat currentUserRole="MANUFACTURER" currentUserId={user.id} />
        </div>
    );
}
