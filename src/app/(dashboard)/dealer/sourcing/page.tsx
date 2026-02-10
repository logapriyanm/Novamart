'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBox,
    FaArrowRight,
    FaSearch,
    FaFilter,
    FaIndustry,
    FaShieldAlt,
    FaShoppingCart,
    FaCheckCircle,
    FaInfoCircle,
    FaHandshake,
    FaTimes,
    FaSpinner as Loader2
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/client/hooks/useAuth';
import { negotiationService } from '@/lib/api/services/negotiation.service';

export default function SourcingTerminal() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [isSourcing, setIsSourcing] = useState(false);
    const [sourceSuccess, setSourceSuccess] = useState(false);
    const [showNegModal, setShowNegModal] = useState(false);
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchApprovedProducts();
    }, []);

    const fetchApprovedProducts = async () => {
        setIsLoading(true);
        try {
            // Fetch products with status APPROVED
            const res = await apiClient.get<any>('/products?status=APPROVED');
            setProducts(res.products || []);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSource = async () => {
        if (!selectedProduct) return;
        setIsSourcing(true);
        try {
            await apiClient.post('/dealer/source', {
                productId: selectedProduct.id,
                region: 'NATIONAL', // Default for now
                stock: 0, // Initial stock is 0
                price: selectedProduct.basePrice // Initial retail price matches base
            }, {});
            setSourceSuccess(true);
            toast.success('Product sourced successfully!');
            setTimeout(() => {
                router.push('/dealer/inventory');
            }, 1500);
        } catch (error: any) {
            toast.error(error.message || 'Failed to source product');
        } finally {
            setIsSourcing(false);
        }
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight italic">Sourcing <span className="text-[#10367D]">Terminal</span></h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Acquire approved manufacturer assets for regional fulfillment</p>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
                {/* Catalog View */}
                <div className="xl:col-span-8 space-y-8">
                    {/* Search & Filter */}
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search by name or category..."
                                className="w-full bg-white border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:outline-none focus:border-[#10367D]/30 transition-all shadow-sm"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="px-6 py-4 bg-white border border-slate-100 rounded-2xl text-[#10367D] font-black text-[10px] uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 shrink-0">
                            <FaFilter className="w-3 h-3" /> Filters
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {isLoading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="bg-white rounded-[2.5rem] p-8 border border-slate-50 animate-pulse h-64"></div>
                            ))
                        ) : filteredProducts.length === 0 ? (
                            <div className="col-span-full h-96 flex flex-col items-center justify-center text-center p-12 bg-white rounded-[3rem] border border-dashed border-slate-100">
                                <FaBox className="w-16 h-16 text-slate-100 mb-6" />
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest italic">No approved assets found</h3>
                                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-2">Check back later for new manufacturer releases</p>
                            </div>
                        ) : (
                            filteredProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    layoutId={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className={`bg-white rounded-[2.5rem] p-8 border transition-all cursor-pointer hover:shadow-xl hover:shadow-[#10367D]/5 group ${selectedProduct?.id === product.id ? 'border-[#10367D] shadow-xl shadow-[#10367D]/10' : 'border-slate-50'}`}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 rounded-2xl bg-[#10367D]/5 text-[#10367D] flex items-center justify-center group-hover:scale-110 transition-transform">
                                            {product.images?.[0] ? (
                                                <img src={product.images[0]} alt="" className="w-full h-full object-cover rounded-2xl" />
                                            ) : (
                                                <FaBox className="w-6 h-6" />
                                            )}
                                        </div>
                                        <span className="text-[8px] font-black uppercase px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-lg border border-emerald-100 flex items-center gap-1">
                                            <FaShieldAlt className="w-2 h-2" /> Verified
                                        </span>
                                    </div>
                                    <h3 className="text-base font-black text-[#1E293B] mb-1 leading-tight">{product.name}</h3>
                                    <div className="flex items-center gap-2 mb-4 italic">
                                        <FaIndustry className="w-2.5 h-2.5 text-slate-400" />
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{product.manufacturer?.companyName || 'Manufacturer Corp'}</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50 mt-auto">
                                        <div>
                                            <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5">Base Sourcing Price</p>
                                            <p className="text-sm font-black text-[#1E293B]">₹{product.basePrice}</p>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-[#10367D]/5 text-[#10367D] flex items-center justify-center group-hover:bg-[#10367D] group-hover:text-white transition-all">
                                            <FaArrowRight className="w-3 h-3" />
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Sourcing Detail View */}
                <div className="xl:col-span-4 relative">
                    {selectedProduct ? (
                        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-xl overflow-hidden flex flex-col h-fit sticky top-8">
                            <div className="p-10 bg-[#1E293B] text-white">
                                <h2 className="text-xl font-black italic tracking-tight">Acquisition <span className="text-[#10367D]">Protocol</span></h2>
                                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 italic">Formalizing regional distribution rights</p>
                            </div>
                            <div className="p-10 space-y-10">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-[#10367D]">
                                            <FaInfoCircle className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-black text-[#1E293B] uppercase tracking-widest">{selectedProduct.name}</h4>
                                            <p className="text-[9px] font-bold text-slate-400">{selectedProduct.category}</p>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-[10px] font-bold text-[#1E293B]/70 leading-relaxed italic">
                                        {selectedProduct.description}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">MOQ</p>
                                        <p className="text-sm font-black text-[#1E293B]">{selectedProduct.moq} Units</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Standard Sourcing</p>
                                        <p className="text-sm font-black text-[#1E293B]">₹{selectedProduct.basePrice}</p>
                                    </div>
                                </div>

                                {sourceSuccess ? (
                                    <div className="bg-emerald-500 text-white p-6 rounded-[2.5rem] text-center animate-bounce">
                                        <FaCheckCircle className="w-8 h-8 mx-auto mb-2" />
                                        <p className="text-xs font-black uppercase tracking-widest">Sourcing Successful</p>
                                        <p className="text-[8px] font-bold opacity-80 mt-1">Directing to Inventory Control...</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <button
                                            onClick={handleSource}
                                            disabled={isSourcing}
                                            className="w-full bg-[#10367D] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                                        >
                                            {isSourcing ? <Loader2 className="w-5 h-5 animate-spin" /> : <FaShoppingCart className="w-5 h-5" />}
                                            {isSourcing ? 'Acquiring...' : 'Source for my Fleet'}
                                        </button>

                                        <button
                                            onClick={() => setShowNegModal(true)}
                                            className="w-full bg-white border-2 border-[#10367D] text-[#10367D] py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] hover:bg-[#10367D]/5 transition-all flex items-center justify-center gap-4"
                                        >
                                            <FaHandshake className="w-5 h-5" />
                                            Negotiate Price
                                        </button>
                                    </div>
                                )}
                                <p className="text-[8px] font-black text-slate-400 text-center uppercase tracking-widest leading-relaxed">
                                    Note: Sourcing creates a link to the manufacturer. You must add stock and set your regional retail price in the **Inventory Control** center before it goes live.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="h-96 bg-slate-50/30 rounded-[3.5rem] border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-center p-12">
                            <FaIndustry className="w-16 h-16 text-slate-100 mb-6" />
                            <h3 className="text-sm font-black text-slate-300 uppercase tracking-widest italic">Asset Details</h3>
                            <p className="text-[9px] font-bold text-slate-200 uppercase tracking-widest mt-2 max-w-[180px]">Select any approved product from the catalog to see sourcing specs</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Negotiation Modal */}
            <AnimatePresence>
                {showNegModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
                        >
                            <div className="p-8 bg-[#10367D] text-white flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black italic uppercase tracking-tight">Bulk Negotiation</h2>
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Formalizing direct procurement terms</p>
                                </div>
                                <button onClick={() => setShowNegModal(false)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="p-10 space-y-8">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Negotiating for</p>
                                    <h3 className="text-lg font-black text-[#1E293B]">{selectedProduct.name}</h3>
                                </div>

                                <NegotiationForm
                                    productId={selectedProduct.id}
                                    basePrice={selectedProduct.basePrice}
                                    moq={selectedProduct.moq}
                                    onSuccess={() => {
                                        setShowNegModal(false);
                                        toast.success('Negotiation request sent!');
                                        router.push('/dealer/negotiations');
                                    }}
                                />
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function NegotiationForm({ productId, basePrice, moq, onSuccess }: { productId: string, basePrice: number, moq: number, onSuccess: () => void }) {
    const [quantity, setQuantity] = useState(moq);
    const [proposedPrice, setProposedPrice] = useState(basePrice);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await negotiationService.createNegotiation({
                productId,
                quantity,
                proposedPrice
            });
            onSuccess();
        } catch (error: any) {
            console.error('Negotiation failed:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Quantity (MOQ: {moq})</label>
                    <input
                        type="number"
                        min={moq}
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none focus:border-[#10367D]/30 transition-all"
                        required
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proposed Price (Base: ₹{basePrice})</label>
                    <input
                        type="number"
                        value={proposedPrice}
                        onChange={(e) => setProposedPrice(parseFloat(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black focus:outline-none focus:border-[#10367D]/30 transition-all"
                        required
                    />
                </div>
            </div>

            <div className="bg-[#10367D]/5 p-6 rounded-2xl border border-[#10367D]/10">
                <div className="flex justify-between items-center mb-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Projected Deal Value</p>
                    <p className="text-xl font-black text-[#10367D]">₹{(quantity * proposedPrice).toLocaleString()}</p>
                </div>
                <p className="text-[8px] font-bold text-[#10367D]/60 uppercase tracking-widest">Subject to manufacturer approval and availability</p>
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#10367D] text-white py-6 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-50"
            >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FaHandshake className="w-5 h-5" />}
                Submit Formal Offer
            </button>
        </form>
    );
}
