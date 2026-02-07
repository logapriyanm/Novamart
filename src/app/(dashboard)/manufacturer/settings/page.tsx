'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry,
    FaFileUpload,
    FaCheckCircle,
    FaShieldAlt,
    FaArrowLeft,
    FaSave,
    FaExclamationTriangle,
    FaIdCard,
    FaMapMarkerAlt,
    FaRegClock,
    FaSync,
    FaCamera,
    FaUserCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { CldUploadWidget } from 'next-cloudinary';
import OptimizedImage from '../../../../client/components/common/OptimizedImage';

export default function ManufacturerComplianceSettings() {
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1500);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/manufacturer" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Dashboard
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Compliance <span className="text-[#10367D]">Portal</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Entity Credentials & Identity Governance</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-8 py-3 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-3"
                    >
                        <FaSave className="w-3 h-3" />
                        {isSaving ? 'Syncing...' : 'Commit Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Profile Form */}
                <div className="xl:col-span-8 space-y-12">
                    <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-10">
                        <div className="flex items-center gap-10">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-[3.5rem] bg-[#10367D]/5 border-2 border-[#10367D]/10 flex items-center justify-center text-[#10367D] shadow-sm overflow-hidden">
                                    <FaUserCircle className="w-16 h-16" />
                                </div>
                                <div className="absolute -bottom-2 -right-2">
                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                        onSuccess={(res: any) => console.log('Manufacturer Logo Uploaded:', res.info.secure_url)}
                                    >
                                        {({ open }) => (
                                            <button
                                                onClick={() => open()}
                                                className="w-10 h-10 bg-[#10367D] text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-110 transition-all border-4 border-white"
                                            >
                                                <FaCamera className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-[#1E293B] tracking-tight">Mega-Mart Manufacturing Inc.</h2>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Industrial Entity • Registered 2024</p>
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Status: Verified</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Supply Protocol: Master</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Entity Legal Name</label>
                                <input type="text" defaultValue="Mega-Mart Manufacturing Inc." className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Verified GSTIN</label>
                                <div className="relative">
                                    <input type="text" readOnly value="27AAECM1234F1Z5" className="w-full bg-slate-100 border border-slate-200 rounded-2xl py-4 px-6 text-sm font-black text-slate-500 cursor-not-allowed" />
                                    <FaCheckCircle className="absolute right-6 top-1/2 -translate-y-1/2 text-emerald-500" />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2 text-rose-500 flex items-center gap-2 px-1">
                                <FaExclamationTriangle className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Tax identifiers are immutable after governance audit. Contact admin to update.</span>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Factory Address</label>
                                <textarea rows={3} defaultValue="Plot 22, Industrial Estate, Phase 4, MIDC, Mumbai, MH - 400001" className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-10">
                        <div>
                            <h2 className="text-2xl font-black text-[#1E293B] tracking-tight">Compliance Documents</h2>
                            <p className="text-slate-400 font-medium text-sm mt-2">Active industrial certificates & quality audits.</p>
                        </div>

                        <div className="space-y-6">
                            {[
                                { label: 'Pollution Control NOC', expiry: 'Expires: 12 Oct 2026', icon: FaIndustry, status: 'Active' },
                                { label: 'Quality Standards (ISO 9001)', expiry: 'Expires: 05 Jan 2027', icon: FaCheckCircle, status: 'Verified' },
                            ].map((doc, i) => (
                                <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#10367D]">
                                            <doc.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-[#1E293B]">{doc.label}</h4>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{doc.expiry}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <span className="text-[9px] font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{doc.status}</span>
                                        <CldUploadWidget
                                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                            onSuccess={(res: any) => console.log('Document Updated:', res.info.secure_url)}
                                        >
                                            {({ open }) => (
                                                <button
                                                    onClick={() => open()}
                                                    className="p-4 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-[#10367D] transition-colors"
                                                >
                                                    <FaSync className="w-3 h-3" />
                                                </button>
                                            )}
                                        </CldUploadWidget>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Security Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-[#1E293B] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-60 flex items-center gap-3">
                            <FaShieldAlt className="w-4 h-4 text-[#10367D]" />
                            Security Protocol
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg">
                                    <FaRegClock className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black">2FA Active</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Last Handshake: 1h ago</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg">
                                    <FaIdCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-black">Admin Oversight</p>
                                    <p className="text-[9px] font-bold text-slate-500 uppercase">Protocol Level: Master</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 bg-rose-500/5 border border-rose-500/10 rounded-[3rem] space-y-4">
                        <h4 className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                            <FaExclamationTriangle /> Critical Access
                        </h4>
                        <p className="text-[9px] font-bold text-rose-500/70 leading-relaxed uppercase tracking-widest">
                            Authorized personnel only. All profile modifications trigger a governance re-audit of the supply entity.
                        </p>
                        <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest hover:bg-rose-600 transition-all shadow-xl shadow-rose-500/10">
                            Deactivate Supply Channel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

