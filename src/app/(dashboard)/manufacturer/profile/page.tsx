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
    FaCamera,
    FaBoxOpen,
    FaUsers,
    FaCertificate,
    FaChevronRight,
    FaStore,
    FaExclamationTriangle,
    FaLock,
    FaCogs,
    FaGlobe,
    FaRocket
} from 'react-icons/fa';
import Link from 'next/link';
import { useRealProfile } from '../../../../client/hooks/useRealProfile';

export default function ManufacturerProfilePage() {
    const { profile, isLoading, error, updateProfile, refetch } = useRealProfile<any>('manufacturer');
    const [activeSection, setActiveSection] = useState('company');
    const [isSaving, setIsSaving] = useState(false);

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-[#10367D] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#10367D]">Syncing Industrial DNA...</p>
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
        { id: 'company', name: 'Company Info', icon: FaIndustry, desc: 'Legal identity and corporate registration' },
        { id: 'factory', name: 'Factory Ops', icon: FaCogs, desc: 'Production capacity and manufacturing nodes' },
        { id: 'compliance', name: 'Certifications', icon: FaCertificate, desc: 'ISO, Quality and GST compliance' },
        { id: 'bank', name: 'Legal & Fiscal', icon: FaUniversity, desc: 'Authorized signatories and refund vectors' },
        { id: 'assets', name: 'Brand Assets', icon: FaRocket, desc: 'Marketing materials and brand identity' },
        { id: 'dealers', name: 'Dealer Network', icon: FaUsers, desc: 'Governance over authorized partners' },
        { id: 'security', name: 'Security Vault', icon: FaShieldAlt, desc: 'Access controls and session protocols' }
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/manufacturer" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Command Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight italic">Entity <span className="text-[#10367D]">Registry</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Industrial Governance & Brand Identity</p>
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

                    {/* Verification Sidebar Card */}
                    <div className="bg-[#1E293B] rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-8 opacity-60 flex items-center gap-3">
                            <FaShieldAlt className="w-4 h-4 text-blue-400" />
                            Entity Governance
                        </h3>
                        <div className="space-y-6">
                            <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${profile.isVerified ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                    <FaCheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Verification Status</p>
                                    <p className="text-xs font-black italic">{profile.isVerified ? 'VERIFIED ENTITY' : 'AUDIT PENDING'}</p>
                                </div>
                            </div>
                            {!profile.isVerified && (
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                                    <FaLock className="text-amber-500 w-4 h-4" />
                                    <p className="text-[10px] font-bold text-amber-200 uppercase tracking-widest leading-relaxed">Product publishing restricted until verified</p>
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

function CompanySection({ profile, onSave, isSaving }: any) {
    const [formData, setFormData] = useState({
        companyName: profile.companyName || '',
        registrationNo: profile.registrationNo || '',
        businessType: profile.businessType || '',
        officialEmail: profile.officialEmail || '',
        phone: profile.phone || ''
    });

    return (
        <div className="space-y-10">
            <SectionHeader title="Corporate Entity" subtitle="Official registered identity and communication channels" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Legal Name</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" value={formData.companyName} onChange={e => setFormData({ ...formData, companyName: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration Index (CIN)</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" value={formData.registrationNo} onChange={e => setFormData({ ...formData, registrationNo: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Business Category</label>
                    <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none appearance-none" value={formData.businessType} onChange={e => setFormData({ ...formData, businessType: e.target.value })} >
                        <option value="">Select Category</option>
                        <option value="Private Limited">Private Limited</option>
                        <option value="Limited">Public Limited</option>
                        <option value="Partnership">Partnership</option>
                    </select>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Email</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" value={formData.officialEmail} onChange={e => setFormData({ ...formData, officialEmail: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Hotline</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                </div>
            </div>

            <button onClick={() => onSave(formData)} disabled={isSaving} className="px-10 py-5 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-105 transition-all flex items-center gap-3">
                <FaSave className="w-4 h-4" /> {isSaving ? 'Syncing...' : 'Save Corporate Profile'}
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
        <div className="space-y-10">
            <SectionHeader title="Manufacturing Node" subtitle="Production capacity and physical infrastructure data" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Manufacturing Hub</label>
                    <textarea rows={3} className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" value={formData.factoryAddress} onChange={e => setFormData({ ...formData, factoryAddress: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Monthly Throughput Capacity</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="e.g. 10,000 Units" value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: e.target.value })} />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Operational Categories</label>
                    <input className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none" placeholder="Electronics, Textiles, etc." value={formData.categoriesProduced} onChange={e => setFormData({ ...formData, categoriesProduced: e.target.value })} />
                </div>
            </div>

            <button onClick={() => onSave({ ...formData, categoriesProduced: formData.categoriesProduced.split(',').map((c: string) => c.trim()) })} disabled={isSaving} className="px-10 py-5 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-105 transition-all flex items-center gap-3">
                <FaSave className="w-4 h-4" /> {isSaving ? 'Syncing...' : 'Update Factory Intel'}
            </button>
        </div>
    );
}

function ComplianceSection({ profile, onSave, isSaving }: any) {
    return (
        <div className="space-y-10">
            <SectionHeader title="Compliance Matrix" subtitle="Regulatory identifiers and quality certifications" />

            <div className="grid grid-cols-1 gap-8">
                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-[#10367D] border border-slate-200">
                            <FaIdCard className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified GSTIN</p>
                            <p className="text-sm font-black italic">{profile.gstNumber || 'AUDIT REQUIRED'}</p>
                        </div>
                    </div>
                    {profile.isVerified && <FaCheckCircle className="text-emerald-500 w-6 h-6" />}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <CertificationCard title="ISO 9001:2015" status="ACTIVE" />
                    <CertificationCard title="MSME Registration" status="VERIFIED" />
                </div>
            </div>
        </div>
    );
}

function CertificationCard({ title, status }: any) {
    return (
        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:border-[#10367D]/20 transition-all group">
            <div className="flex items-center justify-between mb-4">
                <FaCertificate className="text-[#10367D] w-6 h-6" />
                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-widest">{status}</span>
            </div>
            <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">{title}</h4>
            <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">Validated via Gov portal</p>
        </div>
    );
}

function BankSection({ profile, onSave, isSaving }: any) {
    return (
        <div className="space-y-10">
            <SectionHeader title="Fiscal Registry" subtitle="Banking data for refund management and penalty vectors" />

            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#10367D]/5 blur-3xl rounded-full" />
                <FaUniversity className="absolute top-10 right-10 text-slate-200 w-16 h-16" />
                <div className="space-y-8 relative z-10">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Authenticated Bank Account</p>
                        <p className="text-xl font-black text-[#1E293B] italic">HDFC BANK • XXXX-8891</p>
                    </div>
                    <button className="flex items-center gap-3 text-[10px] font-black text-[#10367D] uppercase tracking-[0.2em] hover:translate-x-2 transition-transform">
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
        <div className="space-y-10">
            <SectionHeader title="Brand Arsenal" subtitle="Marketplace appearance and marketing assets" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
                <div className="md:col-span-4 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Corporate Logo</label>
                    <div className="aspect-square bg-slate-50 border-2 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center text-slate-300 gap-4 group hover:border-[#10367D]/30 transition-all cursor-pointer overflow-hidden">
                        {formData.logo ? (
                            <img src={formData.logo} className="w-full h-full object-contain p-8" />
                        ) : (
                            <>
                                <FaCamera className="w-10 h-10 group-hover:scale-110 transition-transform" />
                                <span className="text-[9px] font-black uppercase tracking-widest">Upload Master SVG/PNG</span>
                            </>
                        )}
                    </div>
                </div>
                <div className="md:col-span-8 space-y-4">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Brand Narrative</label>
                    <textarea
                        rows={8}
                        className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] py-8 px-8 text-sm font-bold focus:outline-none"
                        placeholder="Describe your brand's heritage and manufacturing philosophy..."
                        value={formData.brandDescription}
                        onChange={e => setFormData({ ...formData, brandDescription: e.target.value })}
                    />
                </div>
            </div>

            <button onClick={() => onSave(formData)} disabled={isSaving} className="px-10 py-5 bg-[#10367D] text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-900/10 hover:scale-105 transition-all flex items-center gap-3">
                <FaSave className="w-4 h-4" /> {isSaving ? 'Directing...' : 'Deploy Brand Assets'}
            </button>
        </div>
    );
}

function DealersSection({ profile }: any) {
    return (
        <div className="space-y-10">
            <SectionHeader title="Authorized Partners" subtitle="Dealers eligible to source from your catalog" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile.dealersApproved?.length > 0 ? (
                    profile.dealersApproved.map((dlr: any) => (
                        <div key={dlr.id} className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between group hover:bg-white hover:border-[#10367D]/20 transition-all">
                            <div className="flex items-center gap-5">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-[#10367D] group-hover:text-white transition-all shadow-sm">
                                    <FaStore className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">{dlr.businessName}</h4>
                                    <p className="text-[9px] font-bold text-slate-400 mt-0.5">{dlr.city}, {dlr.state}</p>
                                </div>
                            </div>
                            <FaChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#10367D]" />
                        </div>
                    ))
                ) : (
                    <div className="md:col-span-2 p-12 bg-slate-50 border border-dashed border-slate-200 rounded-[3rem] text-center space-y-4">
                        <FaUsers className="w-10 h-10 text-slate-300 mx-auto" />
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No partnerships active in registered regions</p>
                        <Link href="/manufacturer/dealers" className="text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:underline inline-block mt-4">Manage Dealer Requests →</Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function SecuritySection({ profile }: any) {
    return (
        <div className="space-y-10">
            <SectionHeader title="Governance Vault" subtitle="Industrial access protocols and session security" />

            <div className="space-y-6">
                <div className="flex items-center justify-between p-8 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm border border-emerald-100">
                            <FaShieldAlt className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Master 2FA Protocol</h4>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5 italic">Identity validated via hardware biometric token</p>
                        </div>
                    </div>
                    <div className="w-12 h-6 bg-emerald-500 rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full translate-x-6 shadow-sm" />
                    </div>
                </div>

                <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center justify-between">
                    <div>
                        <h4 className="text-sm font-black text-[#1E293B] uppercase tracking-widest">Supply Channel Access</h4>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5 italic text-rose-500">Warning: Deactivation stops all active dealer sourcing</p>
                    </div>
                    <button className="px-8 py-4 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-rose-600 transition-all">Deactivate</button>
                </div>
            </div>
        </div>
    );
}
