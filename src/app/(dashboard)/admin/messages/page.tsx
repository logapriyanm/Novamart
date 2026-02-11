'use client';

import React from 'react';
import UnifiedChat from '@/client/components/features/chat/UnifiedChat';
import { useAuth } from '@/client/context/AuthContext';
import { FaShieldAlt, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function AdminMessagesPortal() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">System <span className="text-[#10367D]">Intercept</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Ecosystem-wide Communication Monitoring & Governance</p>
                    </div>
                    <div className="px-5 py-2.5 bg-amber-50 border border-amber-100 rounded-[10px] flex items-center gap-3 shadow-sm">
                        <FaShieldAlt className="text-amber-600 w-4 h-4" />
                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Admin Authorization Level • Monitoring Only</span>
                    </div>
                </div>
            </div>

            {/* Unified Chat Interface */}
            <UnifiedChat
                currentUserRole="ADMIN"
                currentUserId={user?.id || 'admin-system'}
            />
        </div>
    );
}
