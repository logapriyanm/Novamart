'use client';

import React, { useState } from 'react';
import { FaCloudUploadAlt, FaCheckCircle, FaTimesCircle, FaSpinner, FaFileAlt, FaClock } from 'react-icons/fa';
import { apiClient } from '../../../../lib/api/client';
import { toast } from 'sonner';

interface DocumentUploadProps {
    type: string;
    label: string;
    description?: string;
    onUploadSuccess?: () => void;
    existingStatus?: 'PENDING' | 'VERIFIED' | 'REJECTED' | null;
}

export default function DocumentUpload({ type, label, description, onUploadSuccess, existingStatus }: DocumentUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    // const { showSnackbar } = useSnackbar();
    const [status, setStatus] = useState(existingStatus);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('document', file);
        formData.append('type', type);

        try {
            // Note: Content-Type header is usually auto-set by browser with FormData, 
            // but apiClient might need specific handling or just use fetch for this one.
            // Using standard fetch here to ensure FormData is handled correctly if apiClient is rigid.
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/verification/upload', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                setStatus('PENDING');
                toast.success(`${label} uploaded successfully`);
                if (onUploadSuccess) onUploadSuccess();
                setFile(null);
            } else {
                toast.error(data.message || 'Upload failed');
            }
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload document');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-black text-slate-800 text-sm uppercase tracking-wide">{label}</h3>
                    {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
                </div>
                {status && (
                    <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${status === 'VERIFIED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        status === 'REJECTED' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {status === 'VERIFIED' ? <FaCheckCircle /> :
                            status === 'REJECTED' ? <FaTimesCircle /> : <FaClock className="w-3 h-3" />}
                        {status}
                    </div>
                )}
            </div>

            {!status || status === 'REJECTED' ? (
                <div className="space-y-4">
                    <div className={`border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center transition-colors ${file ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
                        }`}>
                        {file ? (
                            <div className="text-center">
                                <FaFileAlt className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                                <p className="text-xs font-bold text-slate-700 truncate max-w-[200px]">{file.name}</p>
                                <button onClick={() => setFile(null)} className="text-[10px] text-rose-500 font-black uppercase tracking-widest mt-2 hover:underline">Remove</button>
                            </div>
                        ) : (
                            <label className="cursor-pointer text-center w-full block">
                                <FaCloudUploadAlt className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                                <span className="text-xs font-bold text-blue-600">Click to Browse</span>
                                <input type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                            </label>
                        )}
                    </div>

                    <button
                        onClick={handleUpload}
                        disabled={!file || isUploading}
                        className="w-full py-3 bg-[#10367D] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0d2b63] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                    >
                        {isUploading ? <><FaSpinner className="animate-spin" /> Uploading...</> : 'Upload Document'}
                    </button>
                </div>
            ) : status === 'PENDING' ? (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-100 text-center">
                    <FaSpinner className="w-6 h-6 text-amber-500 animate-spin mx-auto mb-2" />
                    <p className="text-xs font-bold text-amber-700">Verification in Progress</p>
                    <p className="text-[10px] text-amber-600/80 mt-1">Our team is reviewing your document.</p>
                </div>
            ) : (
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 text-center">
                    <FaCheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="text-xs font-bold text-emerald-700">Document Verified</p>
                </div>
            )}
        </div>
    );
}


