'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUpload, FaFilePdf, FaFileImage, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import { mediaService } from '@/lib/api/services/media.service';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface Document {
    type: string;
    number: string;
    fileUrl: string;
}

interface KYCUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    role: 'MANUFACTURER' | 'SELLER';
}

export default function KYCUploadModal({ isOpen, onClose, role }: KYCUploadModalProps) {
    const [documents, setDocuments] = useState<Document[]>([]);
    const [currentDoc, setCurrentDoc] = useState({ type: '', number: '' });
    const [uploading, setUploading] = useState(false);
    const [fileUploading, setFileUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const documentTypes = role === 'MANUFACTURER'
        ? ['GST Certificate', 'Business Registration', 'Address Proof', 'Bank Statement', 'Product Certificates']
        : ['GST Certificate', 'Business ID', 'Address Proof', 'Bank Statement'];

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Only PDF, JPG, and PNG files are allowed');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB');
            return;
        }

        setSelectedFile(file);
    };

    const uploadCurrentDocument = async () => {
        if (!currentDoc.type || !currentDoc.number || !selectedFile) {
            toast.error('Please fill all fields and select a file');
            return;
        }

        setFileUploading(true);
        try {
            // Upload file to media service
            const urls = await mediaService.uploadImages([selectedFile]);
            if (urls && urls.length > 0) {
                const newDoc: Document = {
                    type: currentDoc.type,
                    number: currentDoc.number,
                    fileUrl: urls[0]
                };

                setDocuments([...documents, newDoc]);
                setCurrentDoc({ type: '', number: '' });
                setSelectedFile(null);
                toast.success('Document added successfully');
            }
        } catch (error) {
            toast.error('Failed to upload document');
            console.error(error);
        } finally {
            setFileUploading(false);
        }
    };

    const removeDocument = (index: number) => {
        setDocuments(documents.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (documents.length === 0) {
            toast.error('Please add at least one document');
            return;
        }

        setUploading(true);
        try {
            await apiClient.post('/verification/upload', { documents });
            toast.success('Documents submitted for verification!');
            onClose();
            setDocuments([]);
            // Refresh page to show updated status
            window.location.reload();
        } catch (error: any) {
            toast.error(error?.message || 'Failed to submit documents');
        } finally {
            setUploading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-[10px] max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-black text-[#1E293B]">Get Verified</h2>
                            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-wide">
                                Submit documents for verification
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                        >
                            <FaTimes className="text-slate-600" />
                        </button>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Upload Section */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wide">
                                Add Document
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                        Document Type
                                    </label>
                                    <select
                                        value={currentDoc.type}
                                        onChange={(e) => setCurrentDoc({ ...currentDoc, type: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500"
                                    >
                                        <option value="">Select Type</option>
                                        {documentTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                        Document Number
                                    </label>
                                    <input
                                        type="text"
                                        value={currentDoc.number}
                                        onChange={(e) => setCurrentDoc({ ...currentDoc, number: e.target.value })}
                                        placeholder="e.g., GST12345"
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-3 text-sm font-bold focus:outline-none focus:border-blue-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                    Upload File (PDF, JPG, PNG - Max 5MB)
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={handleFileSelect}
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex items-center justify-center gap-3 w-full bg-slate-50 border-2 border-dashed border-slate-300 rounded-[10px] px-4 py-6 cursor-pointer hover:bg-slate-100 hover:border-slate-400 transition-all"
                                    >
                                        <FaUpload className="text-slate-400 w-5 h-5" />
                                        <span className="text-sm font-bold text-slate-600">
                                            {selectedFile ? selectedFile.name : 'Click to select file'}
                                        </span>
                                    </label>
                                </div>
                            </div>

                            <button
                                onClick={uploadCurrentDocument}
                                disabled={fileUploading || !currentDoc.type || !currentDoc.number || !selectedFile}
                                className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-[10px] font-black text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                            >
                                {fileUploading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <FaUpload /> Add Document
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Uploaded Documents List */}
                        {documents.length > 0 && (
                            <div className="space-y-4">
                                <h3 className="text-sm font-black text-[#1E293B] uppercase tracking-wide flex items-center gap-2">
                                    <FaCheckCircle className="text-emerald-500" />
                                    Documents Ready ({documents.length})
                                </h3>

                                <div className="space-y-3">
                                    {documents.map((doc, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-4 bg-emerald-50 border border-emerald-200 rounded-[10px]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center text-emerald-600 border border-emerald-200">
                                                    {doc.fileUrl.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-[#1E293B]">{doc.type}</p>
                                                    <p className="text-xs font-bold text-slate-500">#{doc.number}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeDocument(index)}
                                                className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-500 flex items-center justify-center transition-colors"
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Info Box */}
                        <div className="p-4 bg-blue-50 border border-blue-200 rounded-[10px] flex items-start gap-3">
                            <FaExclamationTriangle className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />
                            <div className="text-xs font-bold text-blue-800 space-y-1">
                                <p>Documents will be reviewed by our admin team within 24-48 hours.</p>
                                <p>Ensure all documents are clear and legible for faster approval.</p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex gap-3 pt-4 border-t border-slate-200">
                            <button
                                onClick={onClose}
                                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-[10px] font-black text-sm uppercase tracking-wide transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={uploading || documents.length === 0}
                                className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[10px] font-black text-sm uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
                            >
                                {uploading ? 'Submitting...' : `Submit ${documents.length} Document${documents.length === 1 ? '' : 's'}`}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
