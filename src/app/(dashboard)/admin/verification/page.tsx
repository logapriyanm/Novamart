'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { FaCheck, FaTimes, FaFilePdf, FaFileImage, FaExternalLinkAlt, FaIndustry, FaStore, FaShieldAlt } from 'react-icons/fa';

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
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-black text-[#1E293B] tracking-tight UPPERCASE ITALIC">
                    Verification <span className="text-[#10367D]">Center</span>
                </h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('ALL')}
                        className={`px-4 py-2 rounded-[10px] font-bold text-sm ${filter === 'ALL'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        All ({kycDocuments.length})
                    </button>
                    <button
                        onClick={() => setFilter('MANUFACTURER')}
                        className={`px-4 py-2 rounded-[10px] font-bold text-sm flex items-center gap-2 ${filter === 'MANUFACTURER'
                            ? 'bg-blue-500 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        <FaIndustry /> Manufacturers
                    </button>
                    <button
                        onClick={() => setFilter('SELLER')}
                        className={`px-4 py-2 rounded-[10px] font-bold text-sm flex items-center gap-2 ${filter === 'SELLER'
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                            }`}
                    >
                        <FaStore /> Sellers
                    </button>
                </div>
            </div>

            {
                filteredDocs.length === 0 ? (
                    <div className="p-12 text-center bg-white rounded-[10px] border border-slate-100 text-slate-400 font-bold">
                        <FaShieldAlt className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                        <p>No pending verifications</p>
                        <p className="text-sm mt-2">All caught up! 🎉</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        {filteredDocs.map(doc => (
                            <div key={doc._id} className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-4 mb-4 border-b border-slate-50 pb-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-[10px] flex items-center justify-center text-white font-black text-lg shadow-lg">
                                        {doc.role === 'MANUFACTURER' ? <FaIndustry /> : <FaStore />}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-black text-[#1E293B]">{doc.userId.email}</h3>
                                        <p className="text-sm font-bold text-slate-400">
                                            {doc.role} • Submitted {new Date(doc.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-[10px] text-sm font-black bg-blue-50 text-blue-600`}>
                                        {doc.role}
                                    </span>
                                    <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-[10px] text-sm font-black">
                                        Pending Review
                                    </span>
                                </div>

                                <div className="space-y-3 mb-4">
                                    {doc.documents.map((document, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50 rounded-[10px] hover:bg-slate-100 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-white rounded-[10px] border border-slate-100 text-blue-600">
                                                    {document.fileUrl.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#1E293B]">{document.type}</p>
                                                    <p className="text-sm font-bold text-slate-500">Document #{document.number}</p>
                                                    <a
                                                        href={document.fileUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="text-sm font-bold text-blue-500 hover:underline flex items-center gap-1 mt-1"
                                                    >
                                                        View Document <FaExternalLinkAlt className="w-2 h-2" />
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex gap-3 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => {
                                            setSelectedDoc(doc);
                                            setReviewModalOpen(true);
                                        }}
                                        className="flex-1 py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-[10px] font-black text-sm transition-colors flex items-center justify-center gap-2"
                                    >
                                        <FaTimes /> Reject
                                    </button>
                                    <button
                                        onClick={() => handleReview(doc._id, 'APPROVE')}
                                        className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[10px] font-black text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <FaCheck /> Approve Verification
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
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-[10px] p-6 max-w-md w-full shadow-2xl">
                            <h3 className="text-xl font-black text-[#1E293B] mb-4">Reject Verification</h3>
                            <p className="text-sm text-slate-600 font-bold mb-4">
                                Please provide a reason for rejecting {selectedDoc.userId.email}'s verification:
                            </p>
                            <textarea
                                className="w-full border border-slate-200 rounded-[10px] p-3 font-bold text-sm focus:outline-none focus:border-blue-500"
                                rows={4}
                                placeholder="E.g., GST certificate is not clear, Business registration number doesn't match..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                            />
                            <div className="flex gap-3 mt-4">
                                <button
                                    onClick={() => {
                                        setReviewModalOpen(false);
                                        setRejectionReason('');
                                    }}
                                    className="flex-1 py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[10px] font-black text-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleReview(selectedDoc._id, 'REJECT')}
                                    disabled={!rejectionReason.trim()}
                                    className="flex-1 py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white rounded-[10px] font-black text-sm disabled:opacity-50 disabled:cursor-not-allowed"
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
