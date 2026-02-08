'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBox, FaSync, FaExclamationTriangle, FaIndustry, FaHistory
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '../../../../lib/api/client';
import { useSnackbar } from '../../../../client/context/SnackbarContext';

export default function DealerInventoryPage() {
    const [inventory, setInventory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState<string | null>(null);
    const { showSnackbar } = useSnackbar();

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
            showSnackbar('Price updated successfully', 'success');
        } catch (error: any) {
            showSnackbar(error.message || 'Failed to update price', 'error');
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
            showSnackbar('Stock updated successfully', 'success');
        } catch (error: any) {
            showSnackbar(error.message || 'Failed to update stock', 'error');
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
                    <Link
                        href="/dealer/sourcing"
                        className="flex items-center gap-2 px-6 py-2.5 bg-[#10367D] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#10367D]/90 transition-all shadow-lg shadow-[#10367D]/20"
                    >
                        <FaBox className="w-3 h-3" />
                        Source New Assets
                    </Link>
                    <button
                        onClick={fetchInventory}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-100 rounded-xl text-[10px] font-black text-[#1E293B] hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <FaSync className={`w-3 h-3 text-slate-400 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Asset</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Price</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Retail Price (Edit)</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock Level (Edit)</th>
                                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Fulfillment</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan={5} className="p-8"><div className="h-8 bg-slate-50 rounded-lg w-full"></div></td>
                                    </tr>
                                ))
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
                                                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#10367D] group-hover:scale-105 transition-transform">
                                                    {item.product.images?.[0] ? (
                                                        <img src={item.product.images[0]} alt="" className="w-full h-full object-cover rounded-xl" />
                                                    ) : (
                                                        <FaBox className="w-5 h-5" />
                                                    )}
                                                </div>
                                                <div>
                                                    <h4 className="text-sm font-black text-[#1E293B]">{item.product.name}</h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <FaIndustry className="w-2 h-2 text-slate-300" />
                                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CAT: {item.product.category}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-xs font-bold text-slate-400">₹{item.product.basePrice}</td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-2 group/input">
                                                <span className="text-xs font-black text-[#1E293B]">₹</span>
                                                <input
                                                    type="number"
                                                    defaultValue={item.price}
                                                    onBlur={(e) => handleUpdatePrice(item.id, e.target.value)}
                                                    className="w-28 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-black focus:outline-none focus:border-[#10367D]/30 transition-all group-hover/input:bg-white"
                                                    disabled={isUpdating === item.id}
                                                />
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-3">
                                                <input
                                                    type="number"
                                                    defaultValue={item.stock}
                                                    onBlur={(e) => handleUpdateStock(item.id, e.target.value)}
                                                    className="w-20 bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 text-xs font-black focus:outline-none focus:border-[#10367D]/30 transition-all"
                                                    disabled={isUpdating === item.id}
                                                />
                                                <div className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${item.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${item.stock > 10 ? 'bg-emerald-500' : 'bg-rose-500 animate-pulse'}`}></span>
                                                    {item.stock} Units
                                                </div>
                                                {item.stock <= 5 && <FaExclamationTriangle className="text-amber-500 w-3 h-3" />}
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 text-right">
                                            <button className="text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:underline flex items-center gap-2 ml-auto">
                                                <FaHistory className="w-3 h-3" /> Batch History
                                            </button>
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
