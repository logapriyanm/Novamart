'use client';

import React from 'react';
import { FaShieldAlt as ShieldAlert, FaSignOutAlt as LogOut, FaHome as Home } from 'react-icons/fa';
import Link from 'next/link';

export default function SuspendedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#EBEBEB]">
            <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-2xl shadow-[#067FF9]/20 border border-rose-500/20 text-center animate-fade-in">
                <div className="w-20 h-20 bg-rose-500 rounded-[10px] flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-rose-500/30">
                    <ShieldAlert className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Account Suspended</h1>
                <p className="text-[#1E293B]/60 text-sm font-medium mb-8 leading-relaxed">
                    Your access to NovaMart has been restricted due to a policy violation or governance audit. Please contact our support team to appeal this decision.
                </p>

                <div className="grid grid-cols-1 gap-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-[#067FF9] text-white text-sm font-bold rounded-[10px] hover:bg-[#1E5F86] transition-all active:scale-95 shadow-lg shadow-[#067FF9]/20"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <button
                        onClick={() => {/* handle logout */ }}
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-[#067FF9]/10 text-[#067FF9] text-sm font-bold rounded-[10px] hover:bg-[#067FF9]/5 transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Log Out
                    </button>
                </div>

                <div className="mt-8 pt-6 border-t border-[#067FF9]/10">
                    <p className="text-sm text-[#067FF9]/40 font-bold uppercase tracking-widest">
                        Ref ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
                    </p>
                </div>
            </div>
        </div>
    );
}

