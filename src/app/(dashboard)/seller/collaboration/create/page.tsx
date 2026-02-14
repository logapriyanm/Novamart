'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { FaArrowLeft, FaPlus, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function CreateCollaborationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [dealers, setDealers] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        targetQuantity: '',
        requiredDeliveryDate: '',
        invitedDealerIds: [] as string[]
    });

    useEffect(() => {
        fetchDealers();
    }, []);

    const fetchDealers = async () => {
        try {
            const res = await apiClient.get<any>('/dealers');
            if (res.success) {
                setDealers(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch dealers');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await apiClient.post<any>('/collaboration/groups', {
                ...formData,
                targetQuantity: parseInt(formData.targetQuantity)
            });

            if (res.success) {
                toast.success('Collaboration group created successfully!');
                router.push(`/dealer/collaboration/${res.data._id}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to create group');
        } finally {
            setLoading(false);
        }
    };

    const toggleDealer = (dealerId: string) => {
        setFormData(prev => ({
            ...prev,
            invitedDealerIds: prev.invitedDealerIds.includes(dealerId)
                ? prev.invitedDealerIds.filter(id => id !== dealerId)
                : [...prev.invitedDealerIds, dealerId]
        }));
    };

    return (
        <div className="max-w-4xl mx-auto pb-20">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-600 hover:text-[#067FF9] font-bold mb-6 transition-colors"
            >
                <FaArrowLeft className="w-4 h-4" />
                Back to Groups
            </button>

            <div className="bg-white rounded-[25px] p-10 border border-slate-100 shadow-xl">
                <h1 className="text-3xl font-black text-slate-900 mb-2 italic uppercase">
                    Create <span className="text-[#067FF9]">Collaboration Group</span>
                </h1>
                <p className="text-sm font-bold text-slate-500 mb-8">
                    Pool demand with other ENTERPRISE dealers for bulk custom manufacturing
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Group Name */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                            Group Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-6 py-4 rounded-[15px] border border-slate-200 focus:border-[#067FF9] focus:ring-2 focus:ring-[#067FF9]/20 outline-none transition-all font-bold"
                            placeholder="e.g., Bulk Refrigerator Order Q2 2026"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows={4}
                            className="w-full px-6 py-4 rounded-[15px] border border-slate-200 focus:border-[#067FF9] focus:ring-2 focus:ring-[#067FF9]/20 outline-none transition-all font-bold resize-none"
                            placeholder="Describe the collaboration goal and product requirements..."
                        />
                    </div>

                    {/* Category & Quantity */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                                Product Category *
                            </label>
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-6 py-4 rounded-[15px] border border-slate-200 focus:border-[#067FF9] focus:ring-2 focus:ring-[#067FF9]/20 outline-none transition-all font-bold"
                            >
                                <option value="">Select Category</option>
                                <option value="Appliances">Appliances</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Furniture">Furniture</option>
                                <option value="Kitchen">Kitchen</option>
                                <option value="Home Decor">Home Decor</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                                Target Quantity *
                            </label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.targetQuantity}
                                onChange={(e) => setFormData({ ...formData, targetQuantity: e.target.value })}
                                className="w-full px-6 py-4 rounded-[15px] border border-slate-200 focus:border-[#067FF9] focus:ring-2 focus:ring-[#067FF9]/20 outline-none transition-all font-bold"
                                placeholder="e.g., 100"
                            />
                        </div>
                    </div>

                    {/* Delivery Date */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                            Required Delivery Date *
                        </label>
                        <input
                            type="date"
                            required
                            value={formData.requiredDeliveryDate}
                            onChange={(e) => setFormData({ ...formData, requiredDeliveryDate: e.target.value })}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-6 py-4 rounded-[15px] border border-slate-200 focus:border-[#067FF9] focus:ring-2 focus:ring-[#067FF9]/20 outline-none transition-all font-bold"
                        />
                    </div>

                    {/* Invite Dealers */}
                    <div>
                        <label className="block text-xs font-black text-slate-700 uppercase tracking-widest mb-2">
                            Invite Dealers (Optional)
                        </label>
                        <p className="text-xs text-slate-500 font-bold mb-4">
                            Select ENTERPRISE dealers to invite to this collaboration
                        </p>
                        <div className="max-h-64 overflow-y-auto space-y-2 border border-slate-200 rounded-[15px] p-4">
                            {dealers.length === 0 ? (
                                <p className="text-sm text-slate-400 font-bold text-center py-4">
                                    No dealers available
                                </p>
                            ) : (
                                dealers.map((dealer) => (
                                    <label
                                        key={dealer._id}
                                        className="flex items-center gap-3 p-3 rounded-[10px] hover:bg-slate-50 cursor-pointer transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.invitedDealerIds.includes(dealer._id)}
                                            onChange={() => toggleDealer(dealer._id)}
                                            className="w-5 h-5 rounded border-slate-300 text-[#067FF9] focus:ring-[#067FF9]"
                                        />
                                        <div className="flex-1">
                                            <p className="font-black text-slate-800 text-sm">
                                                {dealer.businessName}
                                            </p>
                                            <p className="text-xs text-slate-500 font-bold">
                                                {dealer.city}, {dealer.state}
                                            </p>
                                        </div>
                                    </label>
                                ))
                            )}
                        </div>
                        {formData.invitedDealerIds.length > 0 && (
                            <p className="text-xs text-[#067FF9] font-black mt-2">
                                {formData.invitedDealerIds.length} dealer(s) selected
                            </p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <div className="flex items-center gap-4 pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-5 bg-[#067FF9] text-white rounded-[15px] font-black uppercase tracking-wider hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Collaboration Group'}
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-8 py-5 bg-slate-100 text-slate-600 rounded-[15px] font-black uppercase tracking-wider hover:bg-slate-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
