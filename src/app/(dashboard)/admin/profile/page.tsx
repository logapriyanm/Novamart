'use client';

import React from 'react';
import { useAuth } from '@/client/hooks/useAuth';
import { FaUserShield, FaEnvelope, FaIdBadge } from 'react-icons/fa';

export default function AdminProfilePage() {
    const { user } = useAuth();

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight uppercase italic">Admin <span className="text-slate-600">Profile</span></h1>

            <div className="bg-white rounded-[10px] p-8 border border-slate-100 shadow-sm max-w-2xl">
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-slate-900 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-slate-200">
                        {user?.name?.charAt(0).toUpperCase() || 'A'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{user?.name || 'Administrator'}</h2>
                        <span className="bg-slate-100 text-slate-600 px-3 py-1.5 rounded-[10px] text-sm font-black flex items-center gap-1.5 w-fit mt-2 border border-slate-200">
                            <FaUserShield className="w-3.5 h-3.5" /> Super Admin
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-100 flex items-center gap-4">
                        <FaEnvelope className="text-slate-400" />
                        <div>
                            <p className="text-sm font-black text-slate-500">Email Address</p>
                            <p className="text-sm font-bold text-slate-900">{user?.email}</p>
                        </div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-100 flex items-center gap-4">
                        <FaIdBadge className="text-slate-400" />
                        <div>
                            <p className="text-sm font-black text-slate-500">User ID</p>
                            <p className="text-sm font-bold text-slate-900">{user?.id}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
