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
import { useRealProfile } from '@/client/hooks/useRealProfile';
import { useAuth } from '@/client/hooks/useAuth';
import { mediaService } from '@/lib/api/services/media.service';

export default function SellerProfilePage() {
    const { user } = useAuth();
    const { profile, isLoading, error, updateProfile, refetch } = useRealProfile<any>('seller');
    const [activeSection, setActiveSection] = useState('account');
    const [isSaving, setIsSaving] = useState(false);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-600">Ingesting Profile Intelligence...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
            <div className="bg-white p-8 rounded-[10px] shadow-lg border border-red-100 text-center space-y-6 max-w-md">
                <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <FaExclamationTriangle className="w-6 h-6" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">Operational Failure</h2>
                <p className="text-sm text-slate-600 font-medium">{error}</p>
                <button onClick={refetch} className="w-full py-3 bg-slate-900 text-white rounded-[10px] text-xs font-bold uppercase tracking-wide hover:bg-slate-800 transition-all">Retry Handshake</button>
            </div>
        </div>
    );

    const sections = [
        { id: 'account', name: 'Account Info', icon: FaUserCircle, desc: 'Identity avatar and personal details' },
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
        <div className="space-y-8 animate-fade-in pb-12 text-slate-800 font-sans">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/seller" className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-wider hover:text-slate-900 transition-colors w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Center
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Entity <span className="text-slate-500">Profile</span></h1>
                        <p className="text-slate-500 font-semibold text-xs mt-1">Operational Governance & Identity Stack</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Profile Completion</p>
                            <div className="flex items-center gap-3 mt-1">
                                <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${completion}%` }}
                                        className={`h-full ${completion === 100 ? 'bg-emerald-500' : 'bg-slate-900'}`}
                                    />
                                </div>
                                <span className="text-xs font-bold">{completion}%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Navigation Sidebar */}
                <div className="xl:col-span-4 space-y-6">
                    <div className="bg-white rounded-[10px] p-2 border border-slate-200 shadow-sm overflow-hidden">
                        {sections.map((s) => (
                            <button
                                key={s.id}
                                onClick={() => setActiveSection(s.id)}
                                className={`w-full p-4 rounded-[8px] flex items-center gap-4 transition-all group ${activeSection === s.id ? 'bg-slate-900 text-white shadow-md' : 'hover:bg-slate-50'}`}
                            >
                                <div className={`w-10 h-10 rounded-[6px] flex items-center justify-center transition-colors ${activeSection === s.id ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900'}`}>
                                    <s.icon className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                    <h4 className="text-sm font-bold uppercase tracking-wide">{s.name}</h4>
                                    <p className={`text-[10px] font-medium mt-0.5 ${activeSection === s.id ? 'text-white/70' : 'text-slate-400'}`}>{s.desc}</p>
                                </div>
                                <FaChevronRight className={`ml-auto w-3 h-3 transition-transform ${activeSection === s.id ? 'translate-x-1' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Trust Sidebar Card */}
                    <div className="bg-slate-900 rounded-[10px] p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/50 blur-2xl rounded-full" />
                        <h3 className="text-[10px] font-bold uppercase tracking-wider mb-6 opacity-70 flex items-center gap-2">
                            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
                            Verification Protocol
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${profile.user?.status === 'ACTIVE' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                    <FaCheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Global Status</p>
                                    <p className="text-xs font-bold">{profile.user?.status || 'PENDING'}</p>
                                </div>
                            </div>
                            {profile.payoutBlocked && (
                                <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-[8px] flex items-center gap-3">
                                    <FaLock className="text-rose-500 w-3.5 h-3.5" />
                                    <p className="text-[10px] font-medium text-rose-200 uppercase tracking-wide leading-relaxed">Payouts Paused: Bank verification pending</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                <div className="xl:col-span-8">
                    <div className="bg-white rounded-[10px] p-8 border border-slate-200 shadow-sm h-full min-h-[600px]">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeSection}
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeSection === 'account' && (
                                    <AccountSection profile={profile} user={user} onSave={(data) => updateProfile('account', data)} isSaving={isSaving} />
                                )}
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

function AccountSection({ profile, user, onSave, isSaving }: any) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        avatar: user?.avatar || ''
    });
    const [uploading, setUploading] = useState(false);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const urls = await mediaService.uploadImages([file]);
            if (urls && urls.length > 0) {
                setFormData({ ...formData, avatar: urls[0] });
                await onSave({ avatar: urls[0] });
            }
        } catch (error) {
            console.error('Avatar upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-8">
            <SectionHeader title="Account Profile" subtitle="Manage your personal identity and platform status" />

            <div className="flex flex-col md:flex-row gap-10 items-center md:items-start">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-100 shadow-xl bg-slate-50 flex items-center justify-center">
                        {formData.avatar ? (
                            <img src={formData.avatar} className="w-full h-full object-cover" alt="Profile" />
                        ) : (
                            <FaUserCircle className="w-20 h-20 text-slate-200" />
                        )}
                    </div>
                    <label className="absolute bottom-0 right-0 w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg border-2 border-white">
                        <FaCamera className="w-4 h-4" />
                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                    </label>
                    {uploading && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
                            <FaSync className="w-6 h-6 animate-spin text-slate-900" />
                        </div>
                    )}
                </div>

                <div className="flex-1 space-y-6 w-full">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1">Full Name</label>
                        <div className="flex items-center gap-2">
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-bold focus:outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            {profile.user?.status === 'ACTIVE' && (
                                <div className="shrink-0 group relative">
                                    <img src="/verify.png" className="w-6 h-6 object-contain" alt="Verified" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        Verified Seller
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wide ml-1">Email Address</label>
                        <input
                            className="w-full bg-slate-100 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium text-slate-500 cursor-not-allowed"
                            value={formData.email}
                            readOnly
                        />
                    </div>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={isSaving}
                        className="px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                        <FaSave className="w-3.5 h-3.5" />
                        {isSaving ? 'Syncing...' : 'Update Account Profile'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-800">{title}</h2>
            <p className="text-slate-500 font-medium uppercase tracking-wide text-[10px] mt-1">{subtitle}</p>
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
        <div className="space-y-8">
            <SectionHeader title="Corporate Identity" subtitle="Official registered name and points of contact" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Business Name</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                        value={formData.businessName}
                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Owner / Director Name</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                        value={formData.ownerName}
                        onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Business Entity Type</label>
                    <select
                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors appearance-none"
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
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Contact Email</label>
                    <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                            value={formData.contactEmail}
                            onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                        />
                    </div>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Business Hotline</label>
                    <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3.5 h-3.5" />
                        <input
                            className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 pl-10 pr-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={isSaving}
                className="px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                <FaSave className="w-3.5 h-3.5" />
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
        <div className="space-y-8">
            <SectionHeader title="Regulatory Vault" subtitle="Tax identity and legal compliance documents" />

            <div className="space-y-6">
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">GSTIN Number</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-bold focus:outline-none focus:border-slate-400 transition-colors"
                        placeholder="27AAEC...1Z5"
                        value={formData.gstNumber}
                        onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DocUploadCard label="GST Certificate" sub="Mandatory for payouts" value={formData.gstCertificate} onUpload={(url) => setFormData({ ...formData, gstCertificate: url })} />
                    <DocUploadCard label="Business Reg Proof" sub="CIN / Incorporation" value={formData.businessRegDoc} onUpload={(url) => setFormData({ ...formData, businessRegDoc: url })} />
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={isSaving}
                className="px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                <FaSave className="w-3.5 h-3.5" />
                {isSaving ? 'Syncing...' : 'Commit Compliance Stack'}
            </button>
        </div>
    );
}

function DocUploadCard({ label, sub, value, onUpload }: any) {
    return (
        <div className="p-6 bg-slate-50 border border-slate-200 rounded-[10px] flex flex-col justify-between h-40 group hover:bg-white hover:border-slate-300 transition-all">
            <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</p>
                <p className="text-[10px] font-bold text-slate-700 uppercase tracking-wide mt-1">{sub}</p>
            </div>
            {value ? (
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-[10px] uppercase tracking-wide bg-emerald-50 p-2.5 rounded-[8px] border border-emerald-100">
                    <FaCheckCircle className="w-3.5 h-3.5" /> Uploaded Successfully
                </div>
            ) : (
                <button className="w-full py-2.5 bg-white border border-slate-200 rounded-[8px] text-[10px] font-bold uppercase tracking-wide text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
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
        <div className="space-y-8">
            <SectionHeader title="Logistics Hub" subtitle="Physical presence and regional fulfillment capacity" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Office / Warehouse Address</label>
                    <textarea
                        rows={3}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                        value={formData.businessAddress}
                        onChange={e => setFormData({ ...formData, businessAddress: e.target.value })}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">City</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Pincode</label>
                    <input
                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors"
                        value={formData.pincode}
                        onChange={e => setFormData({ ...formData, pincode: e.target.value })}
                    />
                </div>
            </div>

            <button
                onClick={() => onSave(formData)}
                disabled={isSaving}
                className="px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
                <FaSave className="w-3.5 h-3.5" />
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
            <div className="space-y-8">
                <SectionHeader title="Settlement Channel" subtitle="Active bank account for automated profit releases" />
                <div className="p-8 bg-slate-50 rounded-[10px] border border-slate-200 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-slate-200/20 blur-3xl rounded-full" />
                    <FaUniversity className="absolute top-6 right-6 text-slate-200 w-12 h-12" />
                    <div className="space-y-6 relative z-10">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Registered Account Holder</p>
                            <p className="text-lg font-bold text-slate-900">{bankData.accHolder || 'No Data'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Bank Node</p>
                                <p className="text-sm font-bold uppercase tracking-wide">{bankData.bankName || 'Unknown Bank'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">IFSC Vector</p>
                                <p className="text-sm font-bold uppercase tracking-wide">{bankData.ifsc || 'XXXX0000XXX'}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wide hover:translate-x-1 transition-transform"
                        >
                            Update Settlement Protocol <FaSync className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <SectionHeader title="Update Settlement" subtitle="Re-configure the financial handshake protocol" />
            <div className="p-6 bg-amber-50 border border-amber-100 rounded-[10px] flex items-center gap-4">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shrink-0">
                    <FaExclamationTriangle className="w-5 h-5" />
                </div>
                <p className="text-xs font-medium text-amber-800 uppercase tracking-wide leading-relaxed">
                    Changing information here will pause all payouts for 48-72 hours until administrative verification is complete.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Account Holder Name</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-bold focus:outline-none" value={bankData.accHolder} onChange={e => setBankData({ ...bankData, accHolder: e.target.value })} />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Account Number</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-bold focus:outline-none" value={bankData.accNumber} onChange={e => setBankData({ ...bankData, accNumber: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">IFSC Code</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-bold focus:outline-none" value={bankData.ifsc} onChange={e => setBankData({ ...bankData, ifsc: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide ml-1">Bank Name</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-bold focus:outline-none" value={bankData.bankName} onChange={e => setBankData({ ...bankData, bankName: e.target.value })} />
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={() => {
                        onSave(bankData);
                        setIsEditing(false);
                    }}
                    disabled={isSaving}
                    className="px-6 py-3 bg-slate-900 text-white text-xs font-bold uppercase tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    <FaSave className="w-3.5 h-3.5" />
                    {isSaving ? 'Locking...' : 'Commit New Bank Vector'}
                </button>
                <button onClick={() => setIsEditing(false)} className="px-6 py-3 bg-slate-100 text-slate-500 text-xs font-bold uppercase tracking-wide rounded-[10px] hover:bg-slate-200 transition-all">Cancel</button>
            </div>
        </div>
    );
}

function RatingsSection({ profile }: any) {
    return (
        <div className="space-y-8">
            <SectionHeader title="Trust Registry" subtitle="Marketplace reputation and historical performance data" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-8 bg-slate-50 rounded-[10px] text-center space-y-4">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Aggregate Trust Score</p>
                    <p className="text-5xl font-bold text-slate-900">4.9</p>
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

            <div className="p-6 bg-blue-50/50 rounded-[10px] border border-blue-100">
                <p className="text-xs font-bold text-blue-800 uppercase tracking-wide mb-2">Reputation Insight</p>
                <p className="text-sm font-medium text-slate-700 leading-relaxed">
                    "Your profile is within the top 5% of regional partners. This status grants you prioritized visibility in the seller terminal and eligibility for the 'Gold Merchant' trust badge."
                </p>
            </div>
        </div>
    );
}

function StatMinimal({ label, value }: any) {
    return (
        <div className="p-4 bg-white border border-slate-200 rounded-[10px] flex justify-between items-center px-6 shadow-sm">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</span>
            <span className="text-sm font-bold text-slate-900">{value}</span>
        </div>
    );
}

function SecuritySection({ profile }: any) {
    return (
        <div className="space-y-8">
            <SectionHeader title="Security Vault" subtitle="Authentication protocols and session governance" />

            <div className="space-y-6">
                <SecurityToggle label="Multi-Factor Authentication (MFA)" desc="Require biometric or device code for access" active={profile.user?.mfaEnabled} />
                <SecurityToggle label="Email Verification" desc="Identity confirmed via support@apexretail.in" active={true} />
                <SecurityToggle label="Session Lockdown" desc="Terminate all active terminal sessions" active={false} action="Execute Logout" />
            </div>

            <div className="bg-slate-50 p-6 rounded-[10px] border border-slate-200">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Access Credentials</p>
                <button className="px-6 py-3 bg-white border border-slate-200 rounded-[10px] text-xs font-bold uppercase tracking-wide text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                    Change Access Password
                </button>
            </div>
        </div>
    );
}

function SecurityToggle({ label, desc, active, action }: any) {
    return (
        <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-[10px] shadow-sm">
            <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${active ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'}`}>
                    <FaShieldAlt className="w-4 h-4" />
                </div>
                <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{label}</h4>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{desc}</p>
                </div>
            </div>
            {action ? (
                <button className="px-4 py-2 bg-rose-50 text-rose-600 text-[9px] font-bold uppercase tracking-wide rounded-[6px] border border-rose-100 hover:bg-rose-100 transition-all">
                    {action}
                </button>
            ) : (
                <div className={`w-10 h-5 rounded-full p-1 transition-colors ${active ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                    <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${active ? 'translate-x-5' : 'translate-x-0'}`} />
                </div>
            )}
        </div>
    );
}
