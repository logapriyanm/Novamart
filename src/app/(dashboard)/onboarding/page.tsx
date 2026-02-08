'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../client/hooks/useAuth';
import DocumentUpload from '../../../client/components/features/verification/DocumentUpload';
import { apiClient } from '../../../lib/api/client';
import { FaShieldAlt, FaLock } from 'react-icons/fa';

export default function OnboardingPage() {
    const { user } = useAuth();
    const [documents, setDocuments] = useState<any[]>([]);

    const fetchDocuments = async () => {
        try {
            const res = await apiClient.get<any>('/verification/my-documents');
            if (res.success) {
                setDocuments(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch docs', error);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    const getDocStatus = (type: string) => {
        const doc = documents.find(d => d.type === type);
        return doc ? doc.status : null;
    };

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-12">
                    <div className="w-16 h-16 bg-[#10367D] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-[#10367D]/20 transform rotate-3">
                        <FaShieldAlt className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-black text-[#1E293B] tracking-tight mb-4">
                        Verify your <span className="text-[#10367D]">Identity</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-xl mx-auto">
                        To ensure a safe and trusted marketplace, we require all Manufacturers and Dealers to verify their business details.
                    </p>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 lg:p-12 shadow-xl shadow-slate-200/50 border border-slate-100">
                    <div className="flex items-center gap-2 mb-8 p-4 bg-blue-50 text-blue-700 rounded-xl border border-blue-100">
                        <FaLock className="w-4 h-4" />
                        <span className="text-xs font-bold">Your documents are encrypted and stored securely. Only admins can view them.</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <DocumentUpload
                            type="GST"
                            label="GST Certificate"
                            description="Upload your GST registration certificate (PDF/Image)."
                            existingStatus={getDocStatus('GST')}
                            onUploadSuccess={fetchDocuments}
                        />
                        <DocumentUpload
                            type="PAN"
                            label="PAN Card"
                            description="Company or Proprietor PAN card."
                            existingStatus={getDocStatus('PAN')}
                            onUploadSuccess={fetchDocuments}
                        />
                        <DocumentUpload
                            type="CHEQUE"
                            label="Cancelled Cheque"
                            description="For bank account verification."
                            existingStatus={getDocStatus('CHEQUE')}
                            onUploadSuccess={fetchDocuments}
                        />
                        <DocumentUpload
                            type="ADDRESS_PROOF"
                            label="Address Proof"
                            description="Electricity bill or Rent agreement."
                            existingStatus={getDocStatus('ADDRESS_PROOF')}
                            onUploadSuccess={fetchDocuments}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
