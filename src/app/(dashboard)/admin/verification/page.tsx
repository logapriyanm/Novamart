'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { FaCheck, FaTimes, FaFilePdf, FaFileImage, FaExternalLinkAlt, FaIndustry, FaStore, FaShieldAlt, FaClock } from 'react-icons/fa';

interface KYCDocument {
    _id: string;
    userId: {
        _id: string;
        email: string;
        role: string;
    };
    role: string;
    documents: Array<{
        _id: string;
        type: string;
        number: string;
        fileUrl: string;
        verified: boolean;
    }>;
    status: string;
    createdAt: string;
}

export default function VerificationCenter() {
    const [kycDocuments, setKycDocuments] = useState<KYCDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'MANUFACTURER' | 'SELLER'>('ALL');
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<KYCDocument | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const fetchPendingDocuments = async () => {
        try {
            setLoading(true);
            const params = filter !== 'ALL' ? `?role=${filter}` : '';
            const res = await apiClient.get<KYCDocument[]>(`/verification/pending${params}`);
            setKycDocuments(res || []);
        } catch (error) {
            console.error('Failed to fetch KYC documents', error);
            toast.error('Failed to load verification queue');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPendingDocuments();
    }, [filter]);

    const handleReview = async (docId: string, action: 'APPROVE' | 'REJECT', notes?: string) => {
        try {
            await apiClient.patch(`/verification/${docId}/review`, {
                action,
                notes,
                rejectionReason: action === 'REJECT' ? rejectionReason : undefined
            });

            toast.success(`Verification ${action.toLowerCase()}d successfully`);
            setReviewModalOpen(false);
            setSelectedDoc(null);
            setRejectionReason('');
            fetchPendingDocuments();
        } catch (error: any) {
            toast.error(error?.message || 'Action failed');
        }
    };

    const filteredDocs = kycDocuments;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-slate-400 font-bold">Loading verification queue...</div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header Phase */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight uppercase italic">Identity <span className="text-[#067FF9]">Assurance</span></h1>
                    <p className="text-slate-400 font-medium text-sm mt-1">KYC Protocols & Document Verification</p>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg">
                    {['ALL', 'MANUFACTURER', 'SELLER'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setFilter(tab as any)}
                            className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${filter === tab
                                ? 'bg-white text-blue-600 shadow-sm'
                                : 'text-slate-500 hover:text-slate-700'
                                }`}
                        >
                            {tab === 'ALL' ? 'All' : tab === 'MANUFACTURER' ? 'Manufacturers' : 'Sellers'}
                            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${filter === tab ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                {tab === 'ALL'
                                    ? kycDocuments.length
                                    : kycDocuments.filter(d => d.role === tab).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {
                filteredDocs.length === 0 ? (
                    <div className="flex items-center justify-center h-[400px] border-2 border-dashed border-slate-200 rounded-[20px] bg-slate-50/50">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                                <FaShieldAlt className="w-8 h-8" />
                            </div>
                            <h3 className="text-slate-900 font-bold mb-1">Queue Processing</h3>
                            <p className="text-slate-400 text-sm">New verifications will appear here as they are submitted.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredDocs.map(doc => (
                            <div key={doc._id} className="bg-white p-6 rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col">
                                {/* Card Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 text-xl">
                                        {doc.role === 'MANUFACTURER' ? <FaIndustry /> : <FaStore />}
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.role === 'MANUFACTURER' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                                        }`}>
                                        {doc.role}
                                    </span>
                                </div>

                                {/* Identity Info */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-[#1E293B] text-lg truncate" title={doc.userId.email}>
                                        {doc.userId.email}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <FaClock className="text-amber-500 w-3 h-3" />
                                        <span className="text-xs font-black text-amber-500 uppercase tracking-wide">Pending Review</span>
                                    </div>
                                </div>

                                {/* Document Details Box */}
                                <div className="bg-slate-50 rounded-[12px] p-4 mb-4 space-y-3">
                                    {doc.documents.slice(0, 2).map((document, idx) => ( // Show max 2 for space
                                        <div key={idx} className="space-y-3 border-b border-slate-100 last:border-0 last:pb-0 pb-3 last:mb-0">
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-medium">Document Type</span>
                                                <span className="text-slate-700 font-bold text-right">{document.type}</span>
                                            </div>
                                            <div className="flex justify-between items-center text-sm">
                                                <span className="text-slate-400 font-medium">Document ID</span>
                                                <span className="text-slate-700 font-bold font-mono text-right truncate max-w-[120px]" title={document.number}>#{document.number}</span>
                                            </div>
                                            <a
                                                href={document.fileUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="text-sm font-bold text-[#067FF9] hover:underline flex items-center gap-1"
                                            >
                                                View Document <FaExternalLinkAlt className="w-3 h-3" />
                                            </a>
                                        </div>
                                    ))}
                                    {doc.documents.length > 2 && (
                                        <div className="text-center pt-2">
                                            <span className="text-xs font-bold text-slate-400">+{doc.documents.length - 2} more documents</span>
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="mt-auto grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => handleReview(doc._id, 'APPROVE')}
                                        className="py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[8px] font-bold text-sm transition-all text-center"
                                    >
                                        Approve
                                    </button>
                                    <button
                                        onClick={() => {
                                            setSelectedDoc(doc);
                                            setReviewModalOpen(true);
                                        }}
                                        className="py-2.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-[8px] font-bold text-sm transition-all text-center"
                                    >
                                        Reject
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            {/* Rejection Modal */}
            {
                reviewModalOpen && selectedDoc && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-[20px] p-8 max-w-md w-full shadow-2xl animate-scale-in">
                            <h3 className="text-xl font-bold text-[#1E293B] mb-2">Reject Verification</h3>
                            <p className="text-sm text-slate-500 font-medium mb-6">
                                Please provide a reason for rejecting <span className="font-bold text-slate-900">{selectedDoc.userId.email}</span>.
                            </p>
                            <textarea
                                className="w-full border border-slate-200 rounded-[12px] p-4 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 min-h-[120px] resize-none"
                                placeholder="E.g., Document legibility issue, Mismatch in GST details..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setReviewModalOpen(false);
                                        setRejectionReason('');
                                    }}
                                    className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-[10px] font-bold text-sm transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReview(selectedDoc._id, 'REJECT')}
                                    disabled={!rejectionReason.trim()}
                                    className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-[10px] font-bold text-sm shadow-lg shadow-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    Confirm Reject
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
}
