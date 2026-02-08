'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../../lib/api/client';
import { useSnackbar } from '../../../context/SnackbarContext';
import { FaComments, FaCheck, FaTimes, FaHandshake } from 'react-icons/fa';

export default function NegotiationList() {
    const [negotiations, setNegotiations] = useState<any[]>([]);
    const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchNegotiations();
    }, []);

    const fetchNegotiations = async () => {
        try {
            const res = await apiClient.get<any>('/negotiation');
            if (res.success) setNegotiations(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async (id: string, status: string) => {
        try {
            const res = await apiClient.put<any>(`/negotiation/${id}`, { status });
            if (res.success) {
                showSnackbar(`Negotiation ${status}`, 'success');
                fetchNegotiations();
            }
        } catch (error) {
            showSnackbar('Update failed', 'error');
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-[#1E293B] flex items-center gap-3">
                <FaHandshake className="text-[#10367D]" /> Negotiations
            </h2>

            <div className="grid grid-cols-1 gap-4">
                {negotiations.map(neg => (
                    <div key={neg.id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <img src={neg.product.image || neg.product.images?.[0]} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-100" />
                                <div>
                                    <h3 className="font-bold text-[#1E293B]">{neg.product.name}</h3>
                                    <p className="text-xs text-slate-500">
                                        Partner: <span className="font-bold">{neg.dealer?.businessName || neg.manufacturer?.companyName}</span>
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">Qty: {neg.quantity}</span>
                                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">Offer: ₹{neg.currentOffer}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${neg.status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-600' :
                                        neg.status === 'REJECTED' ? 'bg-rose-100 text-rose-600' :
                                            'bg-amber-100 text-amber-600'
                                    }`}>
                                    {neg.status}
                                </div>

                                {neg.status === 'OPEN' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdate(neg.id, 'REJECTED')}
                                            className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-100"
                                            title="Reject"
                                        >
                                            <FaTimes />
                                        </button>
                                        <button
                                            onClick={() => handleUpdate(neg.id, 'ACCEPTED')}
                                            className="p-2 bg-emerald-50 text-emerald-500 rounded-lg hover:bg-emerald-100"
                                            title="Accept"
                                        >
                                            <FaCheck />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Simple Chat Preview - In a real app complexity, this would be a full chat window */}
                        {neg.chatLog && neg.chatLog.length > 0 && (
                            <div className="mt-4 p-4 bg-slate-50 rounded-xl text-xs text-slate-600">
                                <p className="font-bold mb-2 flex items-center gap-2"><FaComments /> Latest Activity</p>
                                <div className="space-y-2">
                                    {neg.chatLog.slice(-2).map((msg: any, i: number) => (
                                        <p key={i}>
                                            <span className="font-bold text-[#10367D]">{msg.sender}:</span> {msg.message}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {negotiations.length === 0 && (
                    <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200 text-slate-400">
                        <FaHandshake className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">No Active Negotiations</p>
                        <p className="text-xs mt-1">Start a negotiation from a product page.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
