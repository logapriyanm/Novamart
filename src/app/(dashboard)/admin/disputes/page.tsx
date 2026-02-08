'use client';

import React, { useState, useEffect } from 'react';
import {
    FaGavel,
    FaArrowLeft,
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationCircle
} from 'react-icons/fa';
import Link from 'next/link';

export default function DisputeCenter() {
    // Placeholder - Ideally fetch from /admin/disputes
    const [disputes, setDisputes] = useState<any[]>([]);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Dispute <span className="text-[#10367D]">Resolution</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Arbitration & Conflict Governance</p>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm p-20 flex flex-col items-center text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-6">
                    <FaGavel className="w-10 h-10" />
                </div>
                <h3 className="text-lg font-black text-[#1E293B] uppercase tracking-widest">No Active Conflicts</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-2 max-w-md">
                    The NovaMart ecosystem is currently operating in harmony. All transactions are proceeding according to protocol.
                </p>
            </div>
        </div>
    );
}
