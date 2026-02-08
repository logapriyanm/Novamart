'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
    FaCamera,
    FaBriefcase,
    FaExclamationTriangle,
    FaChevronRight,
    FaStar,
    FaLock
} from 'react-icons/fa';
import Link from 'next/link';
import { useRealProfile } from '../../../../client/hooks/useRealProfile';

export default function DealerProfilePage() {
    const { profile, isLoading, error, updateProfile, refetch } = useRealProfile<any>('dealer');
    const [activeSection, setActiveSection] = useState('business');
    const [isSaving, setIsSaving] = useState(false);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#10367D] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10367D]">Ingesting Profile Intelligence...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-rose-100 text-center space-y-6 max-w-md">
                <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center mx-auto">
                    <FaExclamationTriangle className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-800">Operational Failure</h2>
                <p className="text-sm text-slate-500 font-medium">{error}</p>
                <button onClick={refetch} className="w-full py-4 bg-[#10367D] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all">Retry Handshake</button>
            </div>
        </div>
    );

    const sections = [
        { id: 'business', name: 'Business Info', icon: FaBriefcase, desc: 'Corporate identity and active ownership' },
        { id: 'compliance', name: 'Tax & Compliance', icon: FaIdCard, desc: 'GSTIN and regulatory documentation' },
        { id: 'address', name: 'Logistics Hub', icon: FaMapMarkerAlt, desc: 'Physical location and service nodes' },
        { id: 'bank', name: 'Payout Channel', icon: FaUniversity, desc: 'Secure settlement for gross margins' },
        { id: 'ratings', name: 'Trust Registry', icon: FaStar, desc: 'Marketplace reputation and SLA score' },
        { id: 'security', name: 'Security Vault', icon: FaShieldAlt, desc: 'Access controls and session protocols' }
    ];

    const getCompletion = () => {
        let score = 0;
        if (profile.businessName) score += 20;
        if (profile.gstNumber) score += 20;
        if (profile.businessAddress) score += 20;
        if (profile.bankDetails) score += 20;
        if (profile.phone && profile.contactEmail) score += 20;
        return score;
    };

    const completion = getCompletion();

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/dealer" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Center
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight italic">Entity <span className="text-[#10367D]">Profile</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Operational Governance & Identity Stack</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Completion</p>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="w-40 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completion}%` }}
                                        className={`h-full ${completion === 100 ? 'bg-emerald-500' : 'bg-[#10367D]'}`}
                                    />
                                </div>
                                <span className="text-xs font-black italic">{completion}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm overflow-hidden">
                        {sections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full p-6 rounded-[2rem] flex items-center gap-5 transition-all group ${activeSection === s.id ? 'bg-[#10367D] text-white shadow-xl shadow-blue-900/10' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${activeSection === s.id ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-white group-hover:text-[#10367D]'}`}>
                                    <s.icon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-sm font-black uppercase tracking-widest">{s.name}</h4>
                                    <p className={`text-[10px] font-bold mt-0.5 ${activeSection === s.id ? 'text-white/60' : 'text-slate-400'}`}>{s.desc}</p>
                                </div>
                                <FaChevronRight className={`ml-auto w-3 h-3 transition-transform ${activeSection === s.id ? 'translate-x-1' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Trust Sidebar Card */}
                    <div className="bg-[#1E293B] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60 flex items-center gap-3">
                            <FaShieldAlt className="w-4 h-4 text-blue-400" />
                            Verification Protocol
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.user?.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    <FaCheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</p>
                                    <p className="text-xs font-black italic">{profile.user?.status || 'PENDING'}</p>
                                </div>
                            </div>
                            {profile.payoutBlocked && (
                                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3">
                                    <FaLock className="text-rose-500 w-4 h-4" />
                                    <p className="text-[10px] font-bold text-rose-200 uppercase tracking-widest leading-relaxed">Payouts Paused: Bank verification pending</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="xl:col-span-8">
                    <div className="bg-white rounded-[3rem] p-10 lg:p-14 border border-slate-100 shadow-sm h-full min-h-[600px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeSection === 'business' && (
                                    <BusinessSection profile={profile} onSave={(data) => updateProfile('business', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'compliance' && (
                                    <ComplianceSection profile={profile} onSave={(data) => updateProfile('compliance', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'address' && (
                                    <AddressSection profile={profile} onSave={(data) => updateProfile('address', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'bank' && (
                                    <BankSection profile={profile} onSave={(data) => updateProfile('bank', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'ratings' && (
                                    <RatingsSection profile={profile} />
                                )}
                                {activeSection === 'security' && (
                                    <SecuritySection profile={profile} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-10">
            <h2 className="text-2xl font-black text-[#1E293B] italic">{title}</h2>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-1">{subtitle}</p>
        </div>
    );
}

function BusinessSection({ profile, onSave, isSaving }: any) {
    const [formData, setFormData] = useState({
        businessName: profile.businessName || '',
        ownerName: profile.ownerName || '',
        businessType: profile.businessType || '',
        contactEmail: profile.contactEmail || '',
        phone: profile.phone || ''
    });

    return (
        <div className="space-y-10">
            <SectionHeader title="Corporate Identity" subtitle="Official registered name and points of contact" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Name</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#10367D]/30"
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Owner / Director Name</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-[#10367D]/30"
                        value={formData.ownerName}
                        onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Entity Type</label>
                    <select
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none"
                        value={formData.businessType}
                        onChange={e => setFormData({ ...formData, businessType: e.target.value })}
                    >
                        <option value="">Select Type</option>
                        <option value="Proprietorship">Proprietorship</option>
                        <option value="Partnership">Partnership</option>
                        <option value="LLP">LLP</option>
                        <option value="Private Ltd">Private Limited</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                        <input
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none"
                            value={formData.contactEmail}
                            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Hotline</label>
                    <div className="relative">
                        <FaPhone className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 w-3 h-3" />
                        <input
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-14 pr-6 text-sm font-bold focus:outline-none"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={isSaving}
                className="px-10 py-5 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
            >
                <FaSave className="w-4 h-4" />
                {isSaving ? 'Syncing...' : 'Save Corporate Data'}
            </button>
        </div>
    );
}

function ComplianceSection({ profile, onSave, isSaving }: any) {
    const [formData, setFormData] = useState({
        gstNumber: profile.gstNumber || '',
        gstCertificate: profile.gstCertificate || '',
        businessRegDoc: profile.businessRegDoc || ''
    });

    return (
        <div className="space-y-10">
            <SectionHeader title="Regulatory Vault" subtitle="Tax identity and legal compliance documents" />

            <div className="space-y-8">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">GSTIN Number</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none"
                        placeholder="27AAEC...1Z5"
                        value={formData.gstNumber}
                        onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <DocUploadCard label="GST Certificate" sub="Mandatory for payouts" value={formData.gstCertificate} onUpload={(url) => setFormData({ ...formData, gstCertificate: url })} />
                    <DocUploadCard label="Business Reg Proof" sub="CIN / Incorporation" value={formData.businessRegDoc} onUpload={(url) => setFormData({ ...formData, businessRegDoc: url })} />
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={isSaving}
                className="px-10 py-5 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
            >
                <FaSave className="w-4 h-4" />
                {isSaving ? 'Syncing...' : 'Commit Compliance Stack'}
            </button>
        </div>
    );
}

function DocUploadCard({ label, sub, value, onUpload }: any) {
    return (
        <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2rem] flex flex-col justify-between h-48 group hover:bg-white hover:border-[#10367D]/20 transition-all">
            <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                <p className="text-[9px] font-bold text-[#10367D] uppercase tracking-widest mt-1">{sub}</p>
            </div>
            {value ? (
                <div className="flex items-center gap-3 text-emerald-600 font-black text-[9px] uppercase tracking-widest bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <FaCheckCircle className="w-4 h-4" /> Uploaded Successfully
                </div>
            ) : (
                <button className="w-full py-4 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase tracking-widest text-[#10367D] hover:bg-slate-50 transition-all shadow-sm">
                    Upload Document
                </button>
            )}
        </div>
    );
}

function AddressSection({ profile, onSave, isSaving }: any) {
    const [formData, setFormData] = useState({
        businessAddress: profile.businessAddress || '',
        city: profile.city || '',
        state: profile.state || '',
        pincode: profile.pincode || '',
        serviceRegions: profile.serviceRegions || []
    });

    return (
        <div className="space-y-10">
            <SectionHeader title="Logistics Hub" subtitle="Physical presence and regional fulfillment capacity" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Office / Warehouse Address</label>
                    <textarea
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none"
                        value={formData.businessAddress}
                        onChange={e => setFormData({ ...formData, businessAddress: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">City</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Pincode</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    />
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={isSaving}
                className="px-10 py-5 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
            >
                <FaSave className="w-4 h-4" />
                {isSaving ? 'Syncing...' : 'Update Logistics Node'}
            </button>
        </div>
    );
}

function BankSection({ profile, onSave, isSaving }: any) {
    const [isEditing, setIsEditing] = useState(false);
    const [bankData, setBankData] = useState(profile.bankDetails || {
        accHolder: '',
        accNumber: '',
        ifsc: '',
        bankName: ''
    });

    if (!isEditing) {
        return (
            <div className="space-y-10">
                <SectionHeader title="Settlement Channel" subtitle="Active bank account for automated profit releases" />
                <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-[#10367D]/5 blur-3xl rounded-full" />
                    <FaUniversity className="absolute top-10 right-10 text-slate-200 w-16 h-16" />
                    <div className="space-y-8 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Registered Account Holder</p>
                            <p className="text-xl font-black text-[#1E293B] italic">{bankData.accHolder || 'No Data'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Bank Node</p>
                                <p className="text-sm font-black uppercase tracking-widest">{bankData.bankName || 'Unknown Bank'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">IFSC Vector</p>
                                <p className="text-sm font-black uppercase tracking-widest">{bankData.ifsc || 'XXXX0000XXX'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-3 text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em] hover:translate-x-2 transition-transform"
                        >
                            Update Settlement Protocol <FaSync className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10">
            <SectionHeader title="Update Settlement" subtitle="Re-configure the financial handshake protocol" />
            <div className="p-8 bg-amber-50 border border-amber-100 rounded-3xl flex items-center gap-6">
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                    <FaExclamationTriangle className="w-6 h-6" />
                </div>
                <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
                    Changing information here will pause all payouts for 48-72 hours until administrative verification is complete.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Holder Name</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none" value={bankData.accHolder} onChange={e => setBankData({ ...bankData, accHolder: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Account Number</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none" value={bankData.accNumber} onChange={e => setBankData({ ...bankData, accNumber: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">IFSC Code</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none" value={bankData.ifsc} onChange={e => setBankData({ ...bankData, ifsc: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Bank Name</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none" value={bankData.bankName} onChange={e => setBankData({ ...bankData, bankName: e.target.value })} />
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => {
                        onSave(bankData);
                        setIsEditing(false);
                    }}
                    disabled={isSaving}
                    className="px-10 py-5 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-105 transition-all flex items-center gap-3 disabled:opacity-50"
                >
                    <FaSave className="w-4 h-4" />
                    {isSaving ? 'Locking...' : 'Commit New Bank Vector'}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-10 py-5 bg-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-200 transition-all">Cancel</button>
            </div>
        </div>
    );
}

function RatingsSection({ profile }: any) {
    return (
        <div className="space-y-10">
            <SectionHeader title="Trust Registry" subtitle="Marketplace reputation and historical performance data" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 bg-slate-50 rounded-[3rem] text-center space-y-4">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Aggregate Trust Score</p>
                    <p className="text-6xl font-black text-[#1E293B] italic">4.9</p>
                    <div className="flex justify-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map(i => <FaStar key={i} />)}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                    <StatMinimal label="Fulfillment SLA" value="98.4%" />
                    <StatMinimal label="Dispute Ratio" value="0.2%" />
                    <StatMinimal label="Stock Reliability" value="100%" />
                </div>
            </div>

            <div className="p-10 bg-blue-50/30 rounded-[3rem] border border-blue-100/30">
                <p className="text-[10px] font-black text-[#10367D] uppercase tracking-widest mb-4">Reputation Insight</p>
                <p className="text-xs font-bold text-slate-600 leading-relaxed italic">
                    "Your profile is within the top 5% of regional partners. This status grants you prioritized visibility in the dealer terminal and eligibility for the 'Gold Merchant' trust badge."
                </p>
            </div>
        </div>
    );
}

function StatMinimal({ label, value }: any) {
    return (
        <div className="p-6 bg-white border border-slate-100 rounded-2xl flex justify-between items-center px-8 shadow-sm">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
            <span className="text-sm font-black text-[#10367D] italic">{value}</span>
        </div>
    );
}

function SecuritySection({ profile }: any) {
    return (
        <div className="space-y-10">
            <SectionHeader title="Security Vault" subtitle="Authentication protocols and session governance" />

            <div className="space-y-6">
                <SecurityToggle label="Multi-Factor Authentication (MFA)" desc="Require biometric or device code for access" active={profile.user?.mfaEnabled} />
                <SecurityToggle label="Email Verification" desc="Identity confirmed via support@apexretail.in" active={true} />
                <SecurityToggle label="Session Lockdown" desc="Terminate all active terminal sessions" active={false} action="Execute Logout" />
            </div>

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Access Credentials</p>
                <button className="px-8 py-4 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-[#1E293B] hover:bg-slate-50 transition-all shadow-sm">
                    Change Access Password
                </button>
            </div>
        </div>
    );
}

function SecurityToggle({ label, desc, active, action }: any) {
    return (
        <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
            <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    <FaShieldAlt className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">{label}</h4>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{desc}</p>
                </div>
            </div>
            {action ? (
                <button className="px-6 py-3 bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest rounded-xl border border-rose-100 hover:bg-rose-100 transition-all">
                    {action}
                </button>
            ) : (
                <div className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
            )}
        </div>
    );
}
