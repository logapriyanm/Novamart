'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { FaCheck, FaTimes, FaFilePdf, FaFileImage, FaExternalLinkAlt } from 'react-icons/fa';

export default function VerificationCenter() {
    const [users, setUsers] = useState<any[]>([]);
    // const { showSnackbar } = useSnackbar();

    const fetchPendingUsers = async () => {
        try {
            // We need an endpoint to get users with pending docs.
            // For now, let's assume we fetch all users and filter client-side or use a specific query.
            // Ideally: GET /admin/users?verificationStatus=PENDING
            const res = await apiClient.get<any[]>('/admin/users');
            if (res) {
                // Filter for users who have at least one PENDING document
                //Note: The /admin/users endpoint might need to include documents in the response.
                // If not, we might need to update the backend controller.
                // Let's assume for now the backend includes `documents` array.
                const pending = res.filter((u: any) => u.documents?.some((d: any) => d.status === 'PENDING'));
                setUsers(pending);
            }
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const handleVerify = async (docId: string, status: 'VERIFIED' | 'REJECTED') => {
        try {
            await apiClient.put(`/verification/${docId}/verify`, { status });
            toast.success(`Document ${status}`);
            fetchPendingUsers();
        } catch (error) {
            toast.error('Action Failed');
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Verification <span className="text-[#10367D]">Center</span></h1>

            {users.length === 0 ? (
                <div className="p-12 text-center bg-white rounded-[10px] border border-slate-100 text-slate-400 font-bold">
                    No pending verifications.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {users.map(user => (
                        <div key={user.id} className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4 border-b border-slate-50 pb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-[10px] flex items-center justify-center text-slate-500 font-black">
                                    {user.name?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="font-black text-[#1E293B]">{user.name}</h3>
                                    <p className="text-xs font-bold text-slate-400">{user.email} • {user.role}</p>
                                </div>
                                <span className="ml-auto px-3 py-1 bg-amber-50 text-amber-600 rounded-[10px] text-[10px] font-black uppercase tracking-widest">
                                    Pending Review
                                </span>
                            </div>

                            <div className="space-y-4">
                                {user.documents?.filter((d: any) => d.status === 'PENDING').map((doc: any) => (
                                    <div key={doc.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-[10px]">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white rounded-[10px] border border-slate-100 text-blue-600">
                                                {doc.url.endsWith('.pdf') ? <FaFilePdf /> : <FaFileImage />}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-[#1E293B] uppercase tracking-wide">{doc.type}</p>
                                                <a href={`http://localhost:5000${doc.url}`} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-blue-500 hover:underline flex items-center gap-1">
                                                    View Document <FaExternalLinkAlt className="w-2 h-2" />
                                                </a>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleVerify(doc.id, 'REJECTED')}
                                                className="p-2 hover:bg-rose-100 text-rose-500 rounded-[10px] transition-colors"
                                                title="Reject"
                                            >
                                                <FaTimes />
                                            </button>
                                            <button
                                                onClick={() => handleVerify(doc.id, 'VERIFIED')}
                                                className="p-2 bg-emerald-500 text-white rounded-[10px] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-colors"
                                                title="Approve"
                                            >
                                                <FaCheck />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
