'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { sellerService } from '@/lib/api/services/seller.service';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';
import { FaArrowLeft, FaBox, FaTag, FaMoneyBillWave, FaHistory, FaToggleOn, FaToggleOff, FaSave } from 'react-icons/fa';
import { MdOutlineProductionQuantityLimits, MdInventory } from 'react-icons/md';
import Image from 'next/image';

export default function InventoryItemDetails() {
    const params = useParams();
    const router = useRouter();
    const [item, setItem] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // Editable fields
    const [price, setPrice] = useState<string>('');
    const [stock, setStock] = useState<string>('');
    const [isListed, setIsListed] = useState<boolean>(false);

    useEffect(() => {
        if (params.id) {
            fetchItem(params.id as string);
        }
    }, [params.id]);

    const fetchItem = async (id: string) => {
        try {
            const data = await sellerService.getInventoryItem(id);
            setItem(data);
            setPrice(data.price?.toString() || '');
            setStock(data.stock?.toString() || '0');
            setIsListed(data.isListed);
        } catch (error) {
            console.error('Failed to load inventory item:', error);
            toast.error('Failed to load product details');
            router.push('/seller/products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePrice = async () => {
        if (!item || !price) return;

        setIsSaving(true);
        try {
            await sellerService.updatePrice(item._id, parseFloat(price));
            toast.success('Price updated successfully');
            fetchItem(item._id);
        } catch (error) {
            console.error('Update price error:', error);
            toast.error('Failed to update price');
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdateStock = async () => {
        if (!item || !stock) return;

        setIsSaving(true);
        try {
            await sellerService.updateStock(item._id, parseInt(stock));
            toast.success('Stock updated successfully');
            fetchItem(item._id);
        } catch (error) {
            console.error('Update stock error:', error);
            toast.error('Failed to update stock');
        } finally {
            setIsSaving(false);
        }
    };

    const handleToggleListing = async () => {
        if (!item) return;
        setIsSaving(true);
        try {
            await sellerService.toggleListing(item._id, !isListed);
            toast.success(isListed ? 'Product unlisted' : 'Product listed successfully');
            fetchItem(item._id);
        } catch (error) {
            toast.error('Failed to update listing status');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader size="lg" variant="primary" />
            </div>
        );
    }

    if (!item) return null;

    const product = item.productId || {};

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.back()}
                    className="w-10 h-10 rounded-[10px] bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all hover:text-[#067FF9]"
                >
                    <FaArrowLeft size={14} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">Product Details</h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Inventory Management</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                    <span className={`px-4 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest border ${item.allocationStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        item.allocationStatus === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                            'bg-slate-50 text-slate-500 border-slate-100'
                        }`}>
                        {item.allocationStatus || 'Unknown Status'}
                    </span>
                    <button
                        onClick={handleToggleListing}
                        disabled={isSaving}
                        className={`px-4 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest border flex items-center gap-2 transition-all ${isListed
                            ? 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600'
                            : 'bg-slate-200 text-slate-500 border-slate-200 hover:bg-slate-300'
                            }`}
                    >
                        {isListed ? <FaToggleOn size={16} /> : <FaToggleOff size={16} />}
                        {isListed ? 'Live' : 'Hidden'}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Product Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[10px] p-8 border border-slate-100 shadow-sm">
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            <div className="w-full md:w-1/3 aspect-square bg-slate-50 rounded-[10px] relative overflow-hidden flex-shrink-0">
                                {product.images?.[0] ? (
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-300">
                                        <FaBox size={48} />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 space-y-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-1">{product.name || 'Unnamed Product'}</h2>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">SKU: {product.sku || 'N/A'}</p>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-100">
                                    <p className="text-sm text-slate-600 leading-relaxed">
                                        {product.description || 'No description available for this product.'}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-[10px] bg-blue-50/50 border border-blue-100">
                                        <p className="text-xs font-black text-blue-500 uppercase tracking-widest mb-1">Category</p>
                                        <p className="font-bold text-slate-800">{product.category || 'Uncategorized'}</p>
                                    </div>
                                    <div className="p-4 rounded-[10px] bg-slate-50 border border-slate-100">
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Manufacturer</p>
                                        <p className="font-bold text-slate-800">Verified Partner</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Management */}
                <div className="space-y-6">
                    {/* Price & Stock Card */}
                    <div className="bg-white rounded-[10px] p-6 border border-slate-100 shadow-lg shadow-blue-500/5">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                            <MdInventory className="text-[#067FF9] w-5 h-5" /> Inventory Control
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Selling Price (₹)
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                                        <input
                                            type="number"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-[10px] font-bold text-slate-900 focus:outline-none focus:border-[#067FF9]"
                                        />
                                    </div>
                                    <button
                                        onClick={handleUpdatePrice}
                                        disabled={isSaving || price === item.price?.toString()}
                                        className="px-4 bg-[#067FF9] text-white rounded-[10px] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FaSave />
                                    </button>
                                </div>
                                <p className="text-xs text-slate-400 mt-2 font-medium">
                                    Base Price: ₹{item.sellerBasePrice || 0}
                                </p>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">
                                    Stock Level
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            value={stock}
                                            onChange={(e) => setStock(e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-[10px] font-bold text-slate-900 focus:outline-none focus:border-[#067FF9]"
                                        />
                                    </div>
                                    <button
                                        onClick={handleUpdateStock}
                                        disabled={isSaving || stock === item.stock?.toString()}
                                        className="px-4 bg-[#067FF9] text-white rounded-[10px] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        <FaSave />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Card */}
                    <div className="bg-slate-900 rounded-[10px] p-6 text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <FaHistory size={80} />
                        </div>
                        <h3 className="text-sm font-black text-white/60 uppercase tracking-widest mb-6 relative z-10">
                            Performance
                        </h3>
                        <div className="grid grid-cols-2 gap-4 relative z-10">
                            <div>
                                <p className="text-3xl font-black">{item.soldQuantity || 0}</p>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Sold</p>
                            </div>
                            <div>
                                <p className="text-3xl font-black">₹{((item.soldQuantity || 0) * (item.price || 0)).toLocaleString()}</p>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">Revenue</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
