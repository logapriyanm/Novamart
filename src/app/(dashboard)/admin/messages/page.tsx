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
                <Link href="/admin" className="flex items-center gap-2 text-sm font-black text-[#067FF9] hover:translate-x-[-4px] transition-transform w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight uppercase italic">System <span className="text-[#067FF9]">Intercept</span></h1>
                        <p className="text-slate-400 font-medium text-sm mt-1">Ecosystem-wide Communication Monitoring & Governance</p>
                    </div>
                    <div className="px-5 py-2.5 bg-amber-50 border border-amber-100 rounded-[10px] flex items-center gap-3 shadow-sm">
                        <FaShieldAlt className="text-amber-600 w-4 h-4" />
                        <span className="text-sm font-black text-amber-600">Admin Authorization Level • Monitoring Only</span>
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
