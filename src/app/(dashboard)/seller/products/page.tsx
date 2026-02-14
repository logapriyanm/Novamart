'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    FaBox,
    FaSearch,
    FaFilter,
    FaShieldAlt,
    FaHistory,
    FaPlus,
    FaStore,
    FaTags
} from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import Link from 'next/link';
import { sellerService } from '@/lib/api/services/seller.service';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';

export default function SellerProducts() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await sellerService.getInventory();
            setProducts(data || []);
        } catch (error: any) {
            console.error('Products fetch error:', error);
            toast.error('Failed to load products');
            setProducts([]);
        } finally {
            setIsLoading(false);
        }
    };

    const filteredProducts = products.filter(product => {
        const name = product.productName || product.productId?.name || '';
        const sku = product.sku || product.productId?.sku || '';
        return name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sku.toLowerCase().includes(searchTerm.toLowerCase());
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader size="lg" variant="primary" />
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">Product <span className="text-[#10367D]">Catalog</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Inventory Management Portal</p>
                </div>
                <Link
                    href="/seller/inventory/add"
                    className="px-6 py-3 bg-[#10367D] text-white text-sm font-bold rounded-xl hover:bg-[#0d2a5f] transition-all shadow-lg flex items-center gap-2"
                >
                    <FaPlus className="w-4 h-4" />
                    Add New Product
                </Link>
            </div>

            {/* Search & Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by product name or SKU..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:border-[#10367D]/30"
                    />
                </div>
                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all text-sm font-bold flex items-center gap-2">
                    <FaFilter className="w-4 h-4" />
                    Filter
                </button>
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
                <div className="bg-white rounded-2xl p-16 text-center border border-slate-100">
                    <FaStore className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-900 mb-2">No Products Found</h3>
                    <p className="text-sm text-slate-500 mb-6">
                        {searchTerm ? 'No products match your search criteria.' : 'Start adding products to your inventory.'}
                    </p>
                    <Link
                        href="/seller/inventory/add"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#10367D] text-white text-sm font-bold rounded-xl hover:bg-[#0d2a5f] transition-all"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add First Product
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product, index) => (
                        <motion.div
                            key={product._id || index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white rounded-2xl p-6 border border-slate-100 hover:shadow-lg transition-all group"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                    {product.allocationStatus === 'PENDING' ? (
                                        <FaHistory className="w-5 h-5 text-amber-500" />
                                    ) : (
                                        <MdOutlineProductionQuantityLimits className="w-5 h-5" />
                                    )}
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.allocationStatus === 'PENDING' ? 'bg-amber-100 text-amber-700' :
                                    product.stock > 10 ? 'bg-emerald-50 text-emerald-600' :
                                        product.stock > 0 ? 'bg-amber-50 text-amber-600' :
                                            'bg-red-50 text-red-600'
                                    }`}>
                                    {product.allocationStatus === 'PENDING' ? 'Request Pending' :
                                        product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-[#10367D] transition-colors">
                                {product.productName || product.productId?.name || 'Unnamed Product'}
                            </h3>
                            <p className="text-sm text-slate-500 mb-4">SKU: {product.sku || product.productId?.sku || 'N/A'}</p>
                            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                <div>
                                    <p className="text-xs text-slate-400 mb-1">Price</p>
                                    <p className="text-lg font-bold text-slate-900">₹{product.price?.toLocaleString() || product.pricePerUnit?.toLocaleString() || '0'}</p>
                                </div>
                                {product.allocationStatus === 'PENDING' ? (
                                    <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 text-sm font-bold rounded-lg cursor-not-allowed">
                                        Pending Approval
                                    </button>
                                ) : (
                                    <Link
                                        href={`/seller/inventory/${product._id || ''}`}
                                        className="px-4 py-2 bg-slate-50 text-slate-600 text-sm font-bold rounded-lg hover:bg-[#10367D] hover:text-white transition-all"
                                    >
                                        View Details
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
