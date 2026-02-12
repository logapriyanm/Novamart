'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBox, FaSync, FaExclamationTriangle, FaIndustry, FaHistory
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

export default function DealerInventoryPage() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.get<any[]>('/dealer/inventory');
            setInventory(data);
        } catch (error) {
            console.error('Failed to fetch inventory:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePrice = async (id: string, newPrice: string) => {
        setIsUpdating(id);
        try {
            await apiClient.put('/dealer/inventory/price', {
                inventoryId: id,
                price: parseFloat(newPrice)
            });
            await fetchInventory();
            toast.success('Price updated successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update price');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleUpdateStock = async (id: string, newStock: string) => {
        setIsUpdating(id);
        try {
            await apiClient.put('/dealer/inventory/stock', {
                inventoryId: id,
                stock: parseInt(newStock)
            });
            await fetchInventory();
            toast.success('Stock updated successfully');
        } catch (error: any) {
            toast.error(error.message || 'Failed to update stock');
        } finally {
            setIsUpdating(null);
        }
    };

    const handleToggleListing = async (id: string, currentStatus: boolean) => {
        setIsUpdating(id);
        try {
            await apiClient.put('/dealer/inventory/toggle-listing', {
                inventoryId: id,
                isListed: !currentStatus
            });
            await fetchInventory();
            toast.success(currentStatus ? 'Product delisted' : 'Product is now LIVE');
        } catch (error: any) {
            toast.error(error.message || 'Failed to toggle status');
        } finally {
            setIsUpdating(null);
        }
    };

    return (
        <div className="space-y-6 pb-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-black text-[#1E293B] tracking-tight italic">Inventory <span className="text-[#10367D]">Control</span></h1>
                    <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest text-[10px]">Real-time regional fulfillment spine</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchInventory}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-[10px] text-[10px] font-black text-[#1E293B] hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <FaSync className={`w-3 h-3 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Asset</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Wholesale</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Retail Config</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Visibility</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="py-20 text-center">
                                        <div className="flex justify-center">
                                            <Loader size="lg" variant="primary" />
                                        </div>
                                    </td>
                                </tr>
                            ) : inventory.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-20 text-center flex flex-col items-center gap-4">
                                        <FaBox className="w-12 h-12 text-slate-100" />
                                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 italic">No assets acquired in this region</p>
                                        <Link href="/dealer/sourcing" className="text-xs font-black text-[#10367D] underline uppercase tracking-widest">Visit Sourcing Terminal</Link>
                                    </td>
                                </tr>
                            ) : (
                                inventory.map((item) => (
                                    <tr key={item.id} className="group hover:bg-slate-50/30 transition-colors">
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center text-[#10367D] group-hover:scale-105 transition-transform">
                                                    {item.product.images?.[0] ? (
                                                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover rounded-[10px]" />
                                                    ) : (
                                                        <FaBox className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-[#1E293B]">{item.product.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <FaIndustry className="w-2 h-2 text-slate-300" />
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ALLOCATED: {item.allocatedStock || 0} UNITS</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-400 italic">₹{item.dealerBasePrice || item.product.basePrice}</td>
                                        <td className="px-8 py-6">
                                            <div className="space-y-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">PRC:</span>
                                                    <span className="text-xs font-black text-[#1E293B]">₹{item.price}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-slate-400 uppercase">STK:</span>
                                                    <div className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${item.stock > 0 ? 'bg-blue-50 text-[#10367D]' : 'bg-rose-50 text-rose-600'}`}>
                                                        {item.stock} Units
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col gap-2">
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest w-fit ${item.isListed ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-50 text-slate-400 border border-slate-100'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.isListed ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></span>
                                                    {item.isListed ? 'Public Listing' : 'Draft Access'}
                                                </div>
                                                {!item.isListed && (
                                                    <button
                                                        onClick={() => handleToggleListing(item.id, false)}
                                                        className="text-[9px] font-black text-[#10367D] uppercase tracking-widest hover:underline text-left"
                                                    >
                                                        Publish to Market
                                                    </button>
                                                )}
                                                {item.isListed && (
                                                    <button
                                                        onClick={() => handleToggleListing(item.id, true)}
                                                        className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline text-left"
                                                    >
                                                        Temporarily Unlist
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <div className="flex flex-col items-end gap-2">
                                                <Link
                                                    href={`/dealer/inventory/list/${item.id}`}
                                                    className="px-4 py-2 bg-slate-900 text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2 shadow-sm"
                                                >
                                                    Configure Listing
                                                </Link>
                                                <button className="text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-[#10367D] flex items-center gap-2">
                                                    <FaHistory className="w-2.5 h-2.5" /> Log
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
