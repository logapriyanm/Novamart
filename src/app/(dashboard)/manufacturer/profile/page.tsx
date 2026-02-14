'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaIndustry,
    FaArrowLeft,
    FaSave,
    FaShieldAlt,
    FaCheckCircle,
    FaUniversity,
    FaIdCard,
    FaMapMarkerAlt,
    FaSync,
    FaUsers,
    FaCertificate,
    FaChevronRight,
    FaStore,
    FaExclamationTriangle,
    FaLock,
    FaCogs,
    FaGlobe,
    FaRocket,
    FaUserCircle,
    FaCamera,
    FaUpload,
    FaClock
} from 'react-icons/fa';
import Link from 'next/link';
import { useRealProfile } from '@/client/hooks/useRealProfile';
import { useAuth } from '@/client/hooks/useAuth';
import { mediaService } from '@/lib/api/services/media.service';
import KYCUploadModal from '@/client/components/verification/KYCUploadModal';

export default function ManufacturerProfilePage() {
    const { user } = useAuth();
    const { profile, isLoading, error, updateProfile, refetch } = useRealProfile<any>('manufacturer');
    const [activeSection, setActiveSection] = useState('account');
    const [isSaving, setIsSaving] = useState(false);
    const [kycModalOpen, setKycModalOpen] = useState(false);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <div className="w-10 h-10 border-2 border-slate-900 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs font-semibold tracking-wider text-slate-600">Syncing Industrial DNA...</p>
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
                <button onClick={refetch} className="w-full py-3 bg-slate-900 text-white rounded-[10px] text-xs font-bold tracking-wide hover:bg-slate-800 transition-all">Retry Handshake</button>
            </div>
        </div>
    );

    const sections = [
        { id: 'account', name: 'Account Profile', icon: FaUserCircle, desc: 'Identity avatar and personal details' },
        { id: 'company', name: 'Company Info', icon: FaIndustry, desc: 'Legal identity and corporate registration' },
        { id: 'factory', name: 'Factory Ops', icon: FaCogs, desc: 'Production capacity and manufacturing nodes' },
        { id: 'compliance', name: 'Certifications', icon: FaCertificate, desc: 'ISO, Quality and GST compliance' },
        { id: 'bank', name: 'Legal & Fiscal', icon: FaUniversity, desc: 'Authorized signatories and refund vectors' },
        { id: 'assets', name: 'Brand Assets', icon: FaRocket, desc: 'Marketing materials and brand identity' },
        { id: 'dealers', name: 'Dealer Network', icon: FaUsers, desc: 'Governance over authorized partners' },
        { id: 'security', name: 'Security Vault', icon: FaShieldAlt, desc: 'Access controls and session protocols' }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-slate-800 font-sans">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/manufacturer" className="flex items-center gap-2 text-xs font-bold text-slate-600 tracking-wider hover:text-slate-900 transition-colors w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Entity <span className="text-slate-500">Registry</span></h1>
                        <p className="text-slate-500 font-semibold text-xs mt-1">Industrial Governance & Brand Identity</p>
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
                                    <h4 className="text-sm font-bold tracking-wide">{s.name}</h4>
                                    <p className={`text-sm font-medium mt-0.5 ${activeSection === s.id ? 'text-white/70' : 'text-slate-400'}`}>{s.desc}</p>
                                </div>
                                <FaChevronRight className={`ml-auto w-3 h-3 transition-transform ${activeSection === s.id ? 'translate-x-1' : 'opacity-0'}`} />
                            </button>
                        ))}
                    </div>

                    {/* Verification Sidebar Card */}
                    <div className="bg-slate-900 rounded-[10px] p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/50 blur-2xl rounded-full" />
                        <h3 className="text-sm font-bold tracking-wider mb-6 opacity-70 flex items-center gap-2">
                            <FaShieldAlt className="w-3.5 h-3.5 text-emerald-400" />
                            Entity Governance
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${profile.isVerified
                                    ? 'bg-emerald-500/20 text-emerald-400'
                                    : profile.verificationStatus === 'PENDING'
                                        ? 'bg-amber-500/20 text-amber-400'
                                        : profile.verificationStatus === 'REJECTED'
                                            ? 'bg-rose-500/20 text-rose-400'
                                            : 'bg-slate-500/20 text-slate-400'
                                    }`}>
                                    <FaCheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-400 tracking-wider">Verification Status</p>
                                    <p className="text-xs font-bold">
                                        {profile.isVerified
                                            ? 'VERIFIED ENTITY'
                                            : profile.verificationStatus === 'PENDING'
                                                ? 'UNDER REVIEW'
                                                : profile.verificationStatus === 'REJECTED'
                                                    ? 'REJECTED'
                                                    : 'NOT SUBMITTED'}
                                    </p>
                                </div>
                            </div>

                            {/* Show upload button for unverified manufacturers */}
                            {!profile.isVerified && profile.verificationStatus === 'NONE' && (
                                <>
                                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-[8px] flex items-center gap-3">
                                        <FaLock className="text-amber-500 w-3.5 h-3.5" />
                                        <p className="text-sm font-medium text-amber-200 tracking-wide leading-relaxed">Product publishing restricted until verified</p>
                                    </div>
                                    <button
                                        onClick={() => setKycModalOpen(true)}
                                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] font-black text-xs tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
                                    >
                                        <FaUpload className="w-3.5 h-3.5" />
                                        Submit for Verification
                                    </button>
                                </>
                            )}

                            {/* Show status for pending */}
                            {profile.verificationStatus === 'PENDING' && (
                                <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-[8px] text-center">
                                    <FaClock className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                                    <p className="text-sm font-bold text-blue-200 tracking-wide">Documents Under Admin Review</p>
                                    <p className="text-xs text-blue-300 mt-1">Expected response: 24-48 hours</p>
                                </div>
                            )}

                            {/* Show resubmit for rejected */}
                            {profile.verificationStatus === 'REJECTED' && (
                                <>
                                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-[8px]">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaExclamationTriangle className="text-rose-400 w-3.5 h-3.5" />
                                            <p className="text-sm font-bold text-rose-200 tracking-wide">Verification Rejected</p>
                                        </div>
                                        {profile.rejectionReason && (
                                            <p className="text-xs text-rose-300 leading-relaxed">{profile.rejectionReason}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setKycModalOpen(true)}
                                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] font-bold text-sm tracking-wide transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaSync className="w-3 h-3" />
                                        Resubmit Documents
                                    </button>
                                </>
                            )}

                            {/* Show verified badge */}
                            {profile.isVerified && (
                                <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-[8px] flex items-center gap-3">
                                    <FaCheckCircle className="text-emerald-400 w-5 h-5" />
                                    <div>
                                        <p className="text-sm font-bold text-emerald-200 tracking-wide">Fully Verified Entity</p>
                                        {profile.verifiedAt && (
                                            <p className="text-xs text-emerald-300 mt-0.5">Verified on {new Date(profile.verifiedAt).toLocaleDateString()}</p>
                                        )}
                                    </div>
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
                                {activeSection === 'company' && (
                                    <CompanySection profile={profile} onSave={(data) => updateProfile('company', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'factory' && (
                                    <FactorySection profile={profile} onSave={(data) => updateProfile('factory', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'compliance' && (
                                    <ComplianceSection profile={profile} onSave={(data) => updateProfile('compliance', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'bank' && (
                                    <BankSection profile={profile} onSave={(data) => updateProfile('bank', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'assets' && (
                                    <BrandAssetsSection profile={profile} onSave={(data) => updateProfile('assets', data)} isSaving={isSaving} />
                                )}
                                {activeSection === 'dealers' && (
                                    <DealersSection profile={profile} />
                                )}
                                {activeSection === 'security' && (
                                    <SecuritySection profile={profile} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* KYC Upload Modal */}
            <KYCUploadModal
                isOpen={kycModalOpen}
                onClose={() => setKycModalOpen(false)}
                role="MANUFACTURER"
            />
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
                // Proactively update full profile if saving directly
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
            <SectionHeader title="Account Identity" subtitle="Manage your personal profile and verification status" />

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
                        <label className="text-xs font-semibold text-slate-400 tracking-wide ml-1">Full Identity Name</label>
                        <div className="flex items-center gap-2">
                            <input
                                className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-bold focus:outline-none"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                            {profile.isVerified && (
                                <div className="shrink-0 group relative">
                                    <img src="/verify.png" className="w-6 h-6 object-contain" alt="Verified" />
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-xs font-black tracking-widest rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                        Verified Manufacturer
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-400 tracking-wide ml-1">Registered Email Access</label>
                        <input
                            className="w-full bg-slate-100 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium text-slate-500 cursor-not-allowed"
                            value={formData.email}
                            readOnly
                        />
                    </div>
                    <button
                        onClick={() => onSave(formData)}
                        disabled={isSaving}
                        className="px-6 py-3 bg-slate-900 text-white text-xs font-bold tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2"
                    >
                        <FaSave className="w-3.5 h-3.5" />
                        {isSaving ? 'Directing...' : 'Update Account DNA'}
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
            <p className="text-slate-500 font-medium tracking-wide text-sm mt-1">{subtitle}</p>
        </div>
    );
}

function CompanySection({ profile, onSave, isSaving }: any) {
    const [formData, setFormData] = useState({
        companyName: profile.companyName || '',
        registrationNo: profile.registrationNo || '',
        businessType: profile.businessType || '',
        officialEmail: profile.officialEmail || '',
        phone: profile.phone || ''
    });

    return (
        <div className="space-y-8">
            <SectionHeader title="Corporate Entity" subtitle="Official registered identity and communication channels" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">Company Legal Name</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">Registration Index (CIN)</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors" value={formData.registrationNo} onChange={e => setFormData({ ...formData, registrationNo: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">Business Category</label>
                    <select className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors appearance-none" value={formData.businessType} onChange={e => setFormData({ ...formData, businessType: e.target.value })} >
                        <option value="">Select Category</option>
                        <option value="Private Limited">Private Limited</option>
                        <option value="Limited">Public Limited</option>
                        <option value="Partnership">Partnership</option>
                    </select>
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">Official Email</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors" value={formData.officialEmail} onChange={e => setFormData({ ...formData, officialEmail: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">Corporate Hotline</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400 transition-colors" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
            </div>

            <button onClick={() => onSave(formData)} disabled={isSaving} className="px-6 py-3 bg-slate-900 text-white text-xs font-bold tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                <FaSave className="w-3.5 h-3.5" /> {isSaving ? 'Syncing...' : 'Save Corporate Profile'}
            </button>
        </div>
    );
}

function FactorySection({ profile, onSave, isSaving }: any) {
    const [formData, setFormData] = useState({
        factoryAddress: profile.factoryAddress || '',
        capacity: profile.capacity || '',
        categoriesProduced: profile.categoriesProduced?.join(', ') || ''
    });

    return (
        <div className="space-y-8">
            <SectionHeader title="Manufacturing Node" subtitle="Production capacity and physical infrastructure data" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2 space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">Primary Manufacturing Hub</label>
                    <textarea rows={3} className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400" value={formData.factoryAddress} onChange={e => setFormData({ ...formData, factoryAddress: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">Monthly Throughput Capacity</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400" placeholder="e.g. 10,000 Units" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-500 tracking-wide ml-1">Operational Categories</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-3 px-4 text-sm font-medium focus:outline-none focus:border-slate-400" placeholder="Electronics, Textiles, etc." value={formData.categoriesProduced} onChange={e => setFormData({ ...formData, categoriesProduced: e.target.value })} />
                </div>
            </div>

            <button onClick={() => onSave({ ...formData, categoriesProduced: formData.categoriesProduced.split(',').map((c: string) => c.trim()) })} disabled={isSaving} className="px-6 py-3 bg-slate-900 text-white text-xs font-bold tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                <FaSave className="w-3.5 h-3.5" /> {isSaving ? 'Syncing...' : 'Update Factory Intel'}
            </button>
        </div>
    );
}

function ComplianceSection({ profile, onSave, isSaving }: any) {
    return (
        <div className="space-y-8">
            <SectionHeader title="Compliance Matrix" subtitle="Regulatory identifiers and quality certifications" />

            <div className="grid grid-cols-1 gap-6">
                <div className="p-6 bg-slate-50 border border-slate-200 rounded-[10px] flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center text-slate-600 border border-slate-200">
                            <FaIdCard className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-400 tracking-wide">Verified GSTIN</p>
                            <p className="text-sm font-bold text-slate-900">{profile.gstNumber || 'AUDIT REQUIRED'}</p>
                        </div>
                    </div>
                    {profile.isVerified && <FaCheckCircle className="text-emerald-500 w-5 h-5" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CertificationCard title="ISO 9001:2015" status="ACTIVE" />
                    <CertificationCard title="MSME Registration" status="VERIFIED" />
                </div>
            </div>
        </div>
    );
}

function CertificationCard({ title, status }: any) {
    return (
        <div className="p-6 bg-white border border-slate-200 rounded-[10px] shadow-sm hover:border-slate-300 transition-all group">
            <div className="flex items-center justify-between mb-3">
                <FaCertificate className="text-slate-600 w-5 h-5" />
                <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-[4px] tracking-wide">{status}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 tracking-wide">{title}</h4>
            <p className="text-sm font-medium text-slate-400 mt-1 tracking-wide">Validated via Gov portal</p>
        </div>
    );
}

function BankSection({ profile, onSave, isSaving }: any) {
    return (
        <div className="space-y-8">
            <SectionHeader title="Fiscal Registry" subtitle="Banking data for refund management and penalty vectors" />

            <div className="p-8 bg-slate-50 rounded-[10px] border border-slate-200 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-slate-200/20 blur-3xl rounded-full" />
                <FaUniversity className="absolute top-6 right-6 text-slate-200 w-12 h-12" />
                <div className="space-y-6 relative z-10">
                    <div>
                        <p className="text-xs font-semibold text-slate-400 tracking-wide mb-1">Authenticated Bank Account</p>
                        <p className="text-lg font-bold text-slate-900">HDFC BANK • XXXX-8891</p>
                    </div>
                    <button className="flex items-center gap-2 text-xs font-bold text-slate-700 tracking-wide hover:translate-x-1 transition-transform">
                        Rotate Settlement Access <FaSync className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function BrandAssetsSection({ profile, onSave, isSaving }: any) {
    const [formData, setFormData] = useState({
        logo: profile.logo || '',
        brandDescription: profile.brandDescription || ''
    });

    return (
        <div className="space-y-8">
            <SectionHeader title="Brand Arsenal" subtitle="Marketplace appearance and marketing assets" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4 space-y-2">
                    <label className="text-xs font-semibold text-slate-400 tracking-wide">Corporate Logo</label>
                    <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[10px] flex flex-col items-center justify-center text-slate-400 gap-3 group hover:border-slate-300 transition-all cursor-pointer overflow-hidden">
                        {formData.logo ? (
                            <img src={formData.logo} className="w-full h-full object-contain p-4" />
                        ) : (
                            <>
                                <FaCamera className="w-8 h-8 group-hover:scale-110 transition-transform" />
                                <span className="text-sm font-bold tracking-wide">Upload Master SVG/PNG</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="md:col-span-8 space-y-2">
                    <label className="text-xs font-semibold text-slate-400 tracking-wide">Brand Narrative</label>
                    <textarea
                        rows={8}
                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] py-4 px-6 text-sm font-medium focus:outline-none focus:border-slate-400"
                        placeholder="Describe your brand's heritage and manufacturing philosophy..."
                        value={formData.brandDescription}
                        onChange={e => setFormData({ ...formData, brandDescription: e.target.value })}
                    />
                </div>
            </div>

            <button onClick={() => onSave(formData)} disabled={isSaving} className="px-6 py-3 bg-slate-900 text-white text-xs font-bold tracking-wide rounded-[10px] shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                <FaSave className="w-3.5 h-3.5" /> {isSaving ? 'Directing...' : 'Deploy Brand Assets'}
            </button>
        </div>
    );
}

function DealersSection({ profile }: any) {
    return (
        <div className="space-y-8">
            <SectionHeader title="Authorized Partners" subtitle="Dealers eligible to source from your catalog" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.dealersApproved?.length > 0 ? (
                    profile.dealersApproved.map((dlr: any) => (
                        <div key={dlr.id} className="p-6 bg-slate-50 border border-slate-200 rounded-[10px] flex items-center justify-between group hover:bg-white hover:border-slate-300 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-[8px] flex items-center justify-center text-slate-500 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm border border-slate-100">
                                    <FaStore className="w-4 h-4" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800 tracking-wide">{dlr.businessName}</h4>
                                    <p className="text-sm font-medium text-slate-400 mt-0.5">{dlr.city}, {dlr.state}</p>
                                </div>
                            </div>
                            <FaChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-900" />
                        </div>
                    ))
                ) : (
                    <div className="md:col-span-2 p-12 bg-slate-50 border border-dashed border-slate-200 rounded-[10px] text-center space-y-4">
                        <FaUsers className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-semibold text-slate-400 tracking-wide">No partnerships active in registered regions</p>
                        <Link href="/manufacturer/dealers" className="text-xs font-bold text-slate-900 tracking-wide hover:underline inline-block mt-4">Manage Dealer Requests →</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function SecuritySection({ profile }: any) {
    return (
        <div className="space-y-8">
            <SectionHeader title="Governance Vault" subtitle="Industrial access protocols and session security" />

            <div className="space-y-6">
                <div className="flex items-center justify-between p-6 bg-white border border-slate-200 rounded-[10px] shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-[8px] flex items-center justify-center shadow-sm border border-emerald-100">
                            <FaShieldAlt className="w-4 h-4" />
                        </div>
                        <div>
                            <h4 className="text-sm font-bold text-slate-900 tracking-wide">Master 2FA Protocol</h4>
                            <p className="text-sm font-medium text-slate-400 mt-0.5">Identity validated via hardware biometric token</p>
                        </div>
                    </div>
                    <div className="w-10 h-5 bg-emerald-500 rounded-full p-1">
                        <div className="w-3 h-3 bg-white rounded-full translate-x-5 shadow-sm" />
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border border-slate-200 rounded-[10px] flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 tracking-wide">Supply Channel Access</h4>
                        <p className="text-sm font-medium text-slate-400 mt-0.5 text-rose-500">Warning: Deactivation stops all active dealer sourcing</p>
                    </div>
                    <button className="px-6 py-2.5 bg-rose-500 text-white text-xs font-bold tracking-wide rounded-[8px] hover:bg-rose-600 transition-all">Deactivate</button>
                </div>
            </div>
        </div>
    );
}
