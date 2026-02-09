'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FaArrowLeft,
    FaUserCircle,
    FaSave,
    FaShieldAlt,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaUniversity,
    FaIdCard,
    FaCheckCircle,
    FaSync,
    FaCamera
} from 'react-icons/fa';
import Link from 'next/link';
import { CldUploadWidget } from 'next-cloudinary';
import { useProfile } from '@/client/hooks/useProfile';
import { useSnackbar } from '@/client/context/SnackbarContext';

interface DealerProfile {
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
}

export default function DealerSettings() {
    const [isSaving, setIsSaving] = useState(false);
    const { showSnackbar } = useSnackbar();

    // Dealer Profile Persistence
    const { profile, saveProfile, isLoaded } = useProfile<DealerProfile>('dealer_profile', {
        name: 'Apex Retail Partners',
        email: 'support@apexretail.in',
        phone: '+91 91234 56789',
        address: 'G-44, Electronic Market, Phase 2, Bangalore, KA - 560001',
        avatar: ''
    });

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            showSnackbar('Dealer Profile Updated Successfully!', 'success');
        }, 1500);
    };

    if (!isLoaded) return null;

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/dealer" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Center
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Compliance <span className="text-[#10367D]">Portal</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Retail Credentials & Settlement Protocol</p>
                    </div>
                    <button
                        onClick={handleSave}
                        className="px-10 py-3 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-3"
                    >
                        <FaSave className="w-3 h-3" />
                        {isSaving ? 'Syncing...' : 'Commit Changes'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Core Profile */}
                <div className="xl:col-span-8 space-y-12">
                    <div className="bg-white rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-12">
                        <div className="flex items-center gap-10">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-[3.5rem] bg-[#10367D]/5 border-2 border-[#10367D]/10 flex items-center justify-center text-[#10367D] shadow-sm overflow-hidden">
                                    {profile.avatar ? (
                                        <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserCircle className="w-16 h-16" />
                                    )}
                                </div>
                                <div className="absolute -bottom-2 -right-2">
                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                                        onSuccess={(res: any) => saveProfile({ avatar: res.info.secure_url })}
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
                                <h2 className="text-3xl font-black tracking-tight">{profile.name}</h2>
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1 italic">Verified Dealer Entity • Registered 2024</p>
                                <div className="mt-4 flex items-center gap-3">
                                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Status: Active</span>
                                    <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[9px] font-black uppercase tracking-widest rounded-lg">Role: Regional Partner</span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                                <input
                                    type="text"
                                    value={profile.name}
                                    onChange={(e) => saveProfile({ name: e.target.value })}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Support Email</label>
                                <div className="relative">
                                    <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                    <input
                                        type="email"
                                        value={profile.email}
                                        onChange={(e) => saveProfile({ email: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Hotline Number</label>
                                <div className="relative">
                                    <FaPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        onChange={(e) => saveProfile({ phone: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30"
                                    />
                                </div>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Store / Warehouse Physical Hub</label>
                                <div className="relative">
                                    <FaMapMarkerAlt className="absolute left-6 top-6 text-slate-300 w-3 h-3" />
                                    <textarea
                                        rows={3}
                                        value={profile.address}
                                        onChange={(e) => saveProfile({ address: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-12">
                        <div>
                            <h2 className="text-2xl font-black tracking-tight">Settlement Handshake</h2>
                            <p className="text-slate-400 font-medium text-sm mt-2 italic">Primary destination for retail gross profit releases.</p>
                        </div>
                        <div className="p-10 bg-slate-50 rounded-[2.5rem] border border-slate-100 relative group">
                            <FaUniversity className="absolute top-10 right-10 text-slate-100 w-12 h-12" />
                            <div className="space-y-6 max-w-sm">
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Bank Account</p>
                                    <p className="text-lg font-black text-[#1E293B]">HDFC BANK • XXXX-4421</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <FaCheckCircle className="text-emerald-500 w-3 h-3" />
                                    <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Escrow Channel Active</span>
                                </div>
                                <button className="text-[9px] font-black text-[#10367D] uppercase tracking-widest hover:underline flex items-center gap-2">
                                    Update Bank Protocol <FaSync className="w-2 h-2" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verification Sidebar */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-[#1E293B] rounded-[3.5rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-60 flex items-center gap-3">
                            <FaShieldAlt className="w-4 h-4 text-blue-400" />
                            Security Protocol
                        </h3>
                        <div className="space-y-8">
                            {[
                                { l: 'GST Verified', d: '27AAEC...1Z5', i: FaIdCard, c: 'text-emerald-500' },
                                { l: 'Admin Shield', d: 'Level 2 Active', i: FaShieldAlt, c: 'text-[#10367D]' },
                            ].map((s, idx) => (
                                <div key={idx} className="flex items-center gap-6">
                                    <div className={`w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center ${s.c}`}>
                                        <s.i className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{s.l}</p>
                                        <p className="text-xs font-black italic">{s.d}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-10 bg-blue-50/50 border border-[#10367D]/10 rounded-[3rem] text-center">
                        <p className="text-[10px] font-black text-[#10367D] uppercase tracking-widest mb-4">Retail Trust Score</p>
                        <p className="text-5xl font-black italic text-[#1E293B]">4.8</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-6 leading-relaxed">
                            Maintained via high SLA fulfillment and zero fraud escalations.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

