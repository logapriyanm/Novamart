'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBox, FaFileUpload, FaPlus, FaSearch, FaFilter,
    FaEdit, FaTrash, FaEye, FaHistory, FaCheckCircle,
    FaClock, FaLayerGroup, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/contract';

export default function ProductMaster() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const data = await apiClient.get<any[]>(ENDPOINTS.MANUFACTURER.PRODUCTS);
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">Product Master</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Manage global brand catalog, master data, and approval cycles.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <FaFileUpload className="w-3 h-3" />
                        Bulk Upload
                    </button>
                    <Link href="/manufacturer/products/add" className="flex items-center gap-2 px-6 py-3 bg-[#0F6CBD] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20">
                        <FaPlus className="w-3 h-3" />
                        Add New Product
                    </Link>
                </div>
            </div>

            {/* Product Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total SKU</p>
                    <p className="text-3xl font-black text-[#1E293B] mt-1">{products.length}</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live Products</p>
                    <p className="text-3xl font-black text-[#1E293B] mt-1">{products.filter(p => p.status === 'APPROVED').length}</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Awaiting Approval</p>
                    <p className="text-3xl font-black text-[#1E293B] mt-1">{products.filter(p => p.status === 'PENDING').length}</p>
                </div>
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Draft Mode</p>
                    <p className="text-3xl font-black text-[#1E293B] mt-1">{products.filter(p => p.status === 'DRAFT').length}</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-[#1E293B] shadow-sm hover:bg-slate-50 transition-all whitespace-nowrap">
                    All Products
                </button>
                <button className="px-6 py-2 bg-slate-50 border border-transparent rounded-full text-xs font-bold text-slate-500 hover:bg-white hover:border-slate-200 transition-all whitespace-nowrap">
                    Live
                </button>
                <button className="px-6 py-2 bg-slate-50 border border-transparent rounded-full text-xs font-bold text-slate-500 hover:bg-white hover:border-slate-200 transition-all whitespace-nowrap">
                    Pending Approval
                </button>
                <button className="px-6 py-2 bg-slate-50 border border-transparent rounded-full text-xs font-bold text-slate-500 hover:bg-white hover:border-slate-200 transition-all whitespace-nowrap">
                    Drafts
                </button>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest w-1/3">Product Info</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Base Price</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">MOQ</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timeline</th>
                                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-bold">Loading products...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-8 py-12 text-center text-slate-400 font-bold">No products found. Add your first product!</td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="group hover:bg-slate-50/50 transition-all">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 p-1 flex items-center justify-center shrink-0">
                                                <img src={product.images?.[0] || 'https://images.unsplash.com/photo-1586769852044-692d6e3703a0?q=80&w=100&auto=format&fit=crop'} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-[#1E293B]">{product.name}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-1">ID: {product.id.split('-')[0]}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-xs font-bold text-slate-600">{product.category}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <span className="text-xs font-black text-[#1E293B]">${Number(product.basePrice).toFixed(2)}</span>
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="text-xs font-bold text-slate-600">
                                            {product.moq} <span className="text-[9px] uppercase text-slate-400 ml-0.5">Units</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-6">
                                        {product.status === 'APPROVED' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest">
                                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                                                Live
                                            </span>
                                        )}
                                        {product.status === 'PENDING' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest">
                                                Pending Approval
                                            </span>
                                        )}
                                        {product.status === 'REJECTED' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest">
                                                Rejected
                                            </span>
                                        )}
                                        {product.status === 'DRAFT' && (
                                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-500 border border-slate-200 text-[10px] font-black uppercase tracking-widest">
                                                Draft
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-6">
                                        <div className="flex items-center gap-2 cursor-pointer group/timeline">
                                            <FaClock className="w-3 h-3 text-slate-400 group-hover/timeline:text-[#0F6CBD] transition-colors" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-bold text-[#0F6CBD] group-hover/timeline:underline">View Log</span>
                                                <span className="text-[9px] text-slate-400 hidden group-hover/timeline:block">Updated {new Date(product.updatedAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-slate-400 hover:text-[#0F6CBD] hover:bg-blue-50 rounded-lg transition-all" title="Edit">
                                                <FaEdit className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-[#0F6CBD] hover:bg-blue-50 rounded-lg transition-all" title="View">
                                                <FaEye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
                    <p className="text-xs font-bold text-slate-500">Showing {products.length} products</p>
                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-50" disabled>
                            <FaChevronLeft className="w-3 h-3" />
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#0F6CBD] text-white text-xs font-black shadow-md shadow-blue-500/20">
                            1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-50" disabled>
                            <FaChevronRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
