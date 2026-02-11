'use client';

import React from 'react';
import {
    FaCheck, FaCheckCircle, FaSyncAlt, FaShieldAlt,
    FaBox, FaInfoCircle, FaThLarge, FaPlus, FaEye
} from 'react-icons/fa';
import Link from 'next/link';

export default function StepSuccess() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] animate-fade-in relative">

            {/* Background Watermark */}
            <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none text-slate-400">
                <FaCheckCircle className="w-64 h-64" />
            </div>

            {/* Main Card */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-xl max-w-4xl w-full overflow-hidden relative z-10">

                {/* Header Section */}
                <div className="text-center p-12 pb-8 border-b border-slate-50">
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[10px] flex items-center justify-center mx-auto mb-6 shadow-sm">
                        <FaCheck className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-black text-[#1E293B] mb-3">Product Submitted for Approval</h1>
                    <span className="inline-block bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-[10px] mb-6">
                        Order #PRD-9823
                    </span>
                    <p className="text-sm font-medium text-slate-500 max-w-lg mx-auto leading-relaxed">
                        Your product details have been successfully sent to the NovaMart Admin team for review and quality assurance.
                    </p>
                </div>

                {/* Split Content */}
                <div className="flex flex-col md:flex-row">

                    {/* Left: Timeline */}
                    <div className="flex-1 p-10 border-r border-slate-50">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-8">Status Timeline</p>

                        <div className="space-y-8 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-100" />

                            {/* Step 1: Submitted */}
                            <div className="relative flex gap-4">
                                <div className="w-8 h-8 rounded-[10px] bg-emerald-500 text-white flex items-center justify-center shadow-md shadow-emerald-200 z-10 shrink-0">
                                    <FaCheck className="w-3 h-3" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#1E293B]">Submitted</h4>
                                    <p className="text-[10px] font-bold text-emerald-600 mt-0.5">Completed</p>
                                </div>
                            </div>

                            {/* Step 2: Admin Review */}
                            <div className="relative flex gap-4">
                                <div className="w-8 h-8 rounded-[10px] bg-[#0F6CBD] text-white flex items-center justify-center shadow-md shadow-blue-200 z-10 shrink-0">
                                    <FaSyncAlt className="w-3 h-3 animate-spin-slow" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#1E293B]">Admin Review</h4>
                                    <p className="text-[10px] font-bold text-slate-500 mt-0.5">In Progress — <span className="text-[#0F6CBD]">Est. 24h</span></p>
                                </div>
                            </div>

                            {/* Step 3: Quality Check */}
                            <div className="relative flex gap-4 opacity-50">
                                <div className="w-8 h-8 rounded-[10px] bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center z-10 shrink-0">
                                    <FaShieldAlt className="w-3 h-3" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-400">Quality Check</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pending</p>
                                </div>
                            </div>

                            {/* Step 4: Live */}
                            <div className="relative flex gap-4 opacity-50">
                                <div className="w-8 h-8 rounded-[10px] bg-white border-2 border-slate-200 text-slate-300 flex items-center justify-center z-10 shrink-0">
                                    <FaBox className="w-3 h-3" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-400">Live on Catalog</h4>
                                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">Pending</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex-1 p-10 bg-slate-50/50">
                        <div className="flex items-center gap-2 mb-4">
                            <FaInfoCircle className="w-4 h-4 text-[#0F6CBD]" />
                            <h3 className="text-sm font-black text-[#1E293B]">What happens next?</h3>
                        </div>
                        <p className="text-xs font-medium text-slate-600 leading-relaxed mb-8">
                            Our compliance team will review your product documentation and images. You <span className="font-bold text-[#1E293B]">will</span> receive an automated email notification and a dashboard alert as soon as the status changes to <span className="font-bold text-[#1E293B]">"Quality Check"</span>.
                        </p>

                        <div className="space-y-3">
                            <Link href="/manufacturer" className="w-full py-4 bg-[#0F6CBD] text-white rounded-[10px] text-xs font-black uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                                <FaThLarge className="w-3 h-3" /> Go to Dashboard
                            </Link>

                            <button onClick={() => window.location.reload()} className="w-full py-4 bg-white border border-slate-200 text-[#1E293B] rounded-[10px] text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center gap-2">
                                <FaPlus className="w-3 h-3" /> Create Another Product
                            </button>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-200/50 text-center">
                            <button className="text-[10px] font-black text-[#0F6CBD] uppercase tracking-widest hover:underline flex items-center justify-center gap-2 mx-auto">
                                <FaEye className="w-3 h-3" /> View Submission Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className="flex items-center gap-8 mt-12 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <a href="#" className="hover:text-[#0F6CBD] transition-colors">Documentation</a>
                <a href="#" className="hover:text-[#0F6CBD] transition-colors">Help Center</a>
                <a href="#" className="hover:text-[#0F6CBD] transition-colors">Contact Support</a>
            </div>

        </div>
    );
}
