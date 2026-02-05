'use client';

import React from 'react';
import { Clock, Mail, CheckCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function VerificationPendingPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#CCDDEA]">
            <div className="max-w-md w-full bg-white rounded-[2rem] p-8 shadow-2xl shadow-[#2772A0]/20 border border-amber-500/20 text-center animate-fade-in">
                <div className="w-20 h-20 bg-amber-500 rounded-2xl flex items-center justify-center text-white mx-auto mb-6 shadow-lg shadow-amber-500/30">
                    <Clock className="w-10 h-10" />
                </div>

                <h1 className="text-3xl font-bold text-[#1E293B] mb-2">Verification Pending</h1>
                <p className="text-[#1E293B]/60 text-sm font-medium mb-8 leading-relaxed">
                    We are currently auditing your business documents and GST certificate. This typically takes (24-48h). We'll notify you via email once approved.
                </p>

                <div className="space-y-4 mb-8">
                    {[
                        { label: 'Register Account', done: true },
                        { label: 'Document Submission', done: true },
                        { label: 'Governance Audit', done: false },
                    ].map((step, i) => (
                        <div key={i} className="flex items-center gap-3 bg-[#2772A0]/5 p-3 rounded-xl border border-[#2772A0]/5">
                            {step.done ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500" />
                            ) : (
                                <div className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                            )}
                            <span className={`text-sm font-bold ${step.done ? 'text-[#1E293B]/40 strike' : 'text-[#1E293B]'}`}>
                                {step.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-3">
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-[#2772A0] text-[#CCDDEA] text-sm font-bold rounded-2xl hover:bg-[#1E5F86] transition-all active:scale-95 shadow-lg shadow-[#2772A0]/20"
                    >
                        <Home className="w-4 h-4" />
                        Back to Home
                    </Link>
                    <button
                        className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-[#2772A0]/10 text-[#2772A0] text-sm font-bold rounded-2xl hover:bg-[#2772A0]/5 transition-all"
                    >
                        <Mail className="w-4 h-4" />
                        Contact Governance Team
                    </button>
                </div>
            </div>
        </div>
    );
}
