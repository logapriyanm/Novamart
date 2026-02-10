'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBox, FaFileUpload, FaPlus, FaSearch, FaFilter,
    FaEdit, FaTrash, FaEye, FaHistory, FaCheckCircle,
    FaClock, FaLayerGroup, FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import { toast } from 'sonner';
import Link from 'next/link';
import { apiClient } from '@/lib/api/client';
import { ENDPOINTS } from '@/lib/api/contract';

export default function ProductMaster() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

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

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) return;
        try {
            await apiClient.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error('Failed to delete product:', error);
            toast.error('Failed to delete product');
        }
    };

    const handleBulkImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                const productsArray = Array.isArray(json) ? json : [json];

                await apiClient.post('/products/bulk', { products: productsArray });
                toast.success('Products imported successfully!');
                fetchProducts();
            } catch (error) {
                console.error('Import failed:', error);
                toast.error('Failed to import products. Please ensure valid JSON format.');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Hidden File Input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleBulkImport}
                className="hidden"
                accept=".json"
            />

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B]">Product Catalog</h1>
                    <p className="text-sm text-slate-400 font-medium">Manage SKUs and distribution availability.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="px-5 py-2.5 bg-white border border-slate-200 rounded-[10px] text-[11px] font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
                    >
                        <FaFileUpload className="w-3 h-3" /> Bulk Import
                    </button>
                    <Link href="/manufacturer/products/add" className="px-6 py-2.5 bg-black text-white rounded-[10px] text-[11px] font-bold uppercase tracking-widest hover:bg-black/90 transition-all shadow-sm">
                        New Product
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
            <div className="bg-white rounded-[15px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Model</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">Syncing Catalog...</td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">No Products Active</td>
                                </tr>
                            ) : products.map((product) => (
                                <tr key={product.id} className="group hover:bg-slate-50 transition-all">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                                <img src={product.images?.[0]} alt="" className="w-full h-full object-cover rounded-lg" />
                                            </div>
                                            <div>
                                                <h4 className="text-xs font-bold text-[#1E293B]">{product.name}</h4>
                                                <p className="text-[9px] font-medium text-slate-400 uppercase mt-0.5">{product.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-[#1E293B]">₹{Number(product.basePrice).toLocaleString()}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest ${product.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600' :
                                            product.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                                                'bg-slate-100 text-slate-400'
                                            }`}>
                                            {product.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link href={`/manufacturer/products/edit/${product.id}`} className="p-2 text-slate-400 hover:text-black transition-all">
                                                <FaEdit className="w-3.5 h-3.5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                                            >
                                                <FaTrash className="w-3.5 h-3.5" />
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
