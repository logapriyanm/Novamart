'use client';

import React from 'react';
import { useAuth } from '@/client/hooks/useAuth';
import { FaUserShield, FaEnvelope, FaIdBadge } from 'react-icons/fa';

export default function AdminProfilePage() {
    const { user } = useAuth();

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Admin <span className="text-[#10367D]">Profile</span></h1>

            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-[#10367D] rounded-full flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-[#10367D]/20">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-[#1E293B]">{user?.name || 'Administrator'}</h2>
                        <span className="bg-[#10367D]/10 text-[#10367D] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 w-fit mt-2">
                            <FaUserShield /> Super Admin
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <FaEnvelope className="text-slate-400" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email Address</p>
                            <p className="text-sm font-bold text-[#1E293B]">{user?.email}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                        <FaIdBadge className="text-slate-400" />
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">User ID</p>
                            <p className="text-sm font-bold text-[#1E293B]">{user?.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
