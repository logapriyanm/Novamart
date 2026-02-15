'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaArrowLeft,
    FaSave,
    FaImage,
    FaTrash,
    FaUpload,
    FaBoxOpen,
    FaTag,
    FaInfoCircle,
    FaCheck,
    FaTimes,
    FaPlus,
    FaList
} from 'react-icons/fa';
import Link from 'next/link';

export default function SellerProductEdit({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = React.use(params); // Unwrap params
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [product, setProduct] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        customName: '',
        customDescription: '',
        price: '',
        isListed: false,
        customImages: [] as string[],
        customCategory: '',
        customSubCategory: '',
        customSpecifications: {} as Record<string, string>,
    });

    // Specification Edit State
    const [newSpecKey, setNewSpecKey] = useState('');
    const [newSpecValue, setNewSpecValue] = useState('');

    // Upload State
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchProductDetails(id);
        }
    }, [id]);

    const fetchProductDetails = async (inventoryId: string) => {
        try {
            const data = await apiClient.get<any>(`/seller/inventory/${inventoryId}`);
            setProduct(data);
            setFormData({
                customName: data.customName || data.productId?.name || '',
                customDescription: data.customDescription || data.productId?.description || '',
                price: data.price?.toString() || '',
                isListed: data.isListed,
                customImages: data.customImages || [],
                customCategory: data.customCategory || data.productId?.category || '',
                customSubCategory: data.customSubCategory || data.productId?.specifications?.subCategory || '',
                customSpecifications: data.customSpecifications || data.productId?.specifications || {},
            });
        } catch (error) {
            console.error(error);
            toast.error('Failed to load product details');
            router.push('/seller/products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadData = new FormData();
        Array.from(files).forEach(file => {
            uploadData.append('images', file);
        });

        try {
            const res = await apiClient.upload<{ urls: string[] }>('/media/upload', uploadData);

            if (res?.urls) {
                setFormData(prev => ({
                    ...prev,
                    customImages: [...prev.customImages, ...res.urls]
                }));
                toast.success('Images uploaded successfully');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            customImages: prev.customImages.filter((_, i) => i !== index)
        }));
    };

    const handleAddSpec = () => {
        if (!newSpecKey || !newSpecValue) return;
        setFormData(prev => ({
            ...prev,
            customSpecifications: {
                ...prev.customSpecifications,
                [newSpecKey]: newSpecValue
            }
        }));
        setNewSpecKey('');
        setNewSpecValue('');
    };

    const handleRemoveSpec = (key: string) => {
        const newSpecs = { ...formData.customSpecifications };
        delete newSpecs[key];
        setFormData(prev => ({ ...prev, customSpecifications: newSpecs }));
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            // 1. Update Basic Details (Price)
            if (formData.price !== product.price?.toString()) {
                await apiClient.put('/seller/inventory/price', {
                    inventoryId: product._id,
                    price: formData.price
                });
            }

            // 2. Update Listing Status
            if (formData.isListed !== product.isListed) {
                await apiClient.put('/seller/inventory/toggle-listing', {
                    inventoryId: product._id,
                    isListed: formData.isListed
                });
            }

            // 3. Update Custom Details (Name, Desc, Images, Category, Specs)
            await apiClient.put('/seller/inventory/details', {
                inventoryId: product._id,
                customName: formData.customName,
                customDescription: formData.customDescription,
                customImages: formData.customImages,
                customCategory: formData.customCategory,
                customSubCategory: formData.customSubCategory,
                customSpecifications: formData.customSpecifications
            });


            toast.success('Product updated successfully');
            router.push('/seller/products');
        } catch (error: any) {
            console.error(error);
            toast.error(error.message || 'Failed to update product');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#067FF9]"></div>
            </div>
        );
    }

    if (!product) return null;

    return (
        <div className="max-w-6xl mx-auto pb-20 animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/seller/products" className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <FaArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-black italic text-slate-900">Edit <span className="text-[#067FF9]">Listing</span></h1>
                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Customize {product.productId?.name}</p>
                </div>
                <div className="ml-auto flex gap-3">
                    <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, isListed: !prev.isListed }))}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider border transition-all ${formData.isListed
                            ? 'bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-100'
                            }`}
                    >
                        {formData.isListed ? 'Listed: Active' : 'Listed: Hidden'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="px-6 py-2 bg-[#1212A1] text-white rounded-lg font-bold shadow-lg hover:bg-[#0e0e81] active:scale-95 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                        {isSaving ? 'Saving...' : 'Save Changes'}
                        <FaSave />
                    </button>
                </div>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Media & Core Info */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Media Gallery */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FaImage className="text-blue-500" /> Media Gallery
                            </h3>
                            <label className="cursor-pointer px-4 py-2 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors">
                                <FaUpload /> Upload Image
                                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                            </label>
                        </div>

                        {uploading && <div className="text-sm text-blue-500 font-medium mb-4 animate-pulse">Uploading images...</div>}

                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {/* Display Custom Images First */}
                            {formData.customImages.map((img, idx) => (
                                <div key={`custom-${idx}`} className="aspect-square relative group rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                                    <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 text-rose-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                                    >
                                        <FaTrash className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            {/* Fallback to Manufacturer Images if No Custom Images */}
                            {formData.customImages.length === 0 && product.productId?.images?.map((img: string, idx: number) => (
                                <div key={`mfg-${idx}`} className="aspect-square relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 opacity-70">
                                    <img src={img} alt="Manufacturer Default" className="w-full h-full object-cover grayscale" />
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                                        <span className="text-[10px] uppercase font-bold text-white bg-black/50 px-2 py-1 rounded">Default</span>
                                    </div>
                                </div>
                            ))}
                            {formData.customImages.length === 0 && (!product.productId?.images || product.productId?.images.length === 0) && (
                                <div className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-300">
                                    <FaImage className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Basic Details */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FaInfoCircle className="text-blue-500" /> Basic Details
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Category</label>
                                <input
                                    type="text"
                                    value={formData.customCategory}
                                    onChange={(e) => setFormData({ ...formData, customCategory: e.target.value })}
                                    placeholder={product.productId?.category}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Sub-Category</label>
                                <input
                                    type="text"
                                    value={formData.customSubCategory}
                                    onChange={(e) => setFormData({ ...formData, customSubCategory: e.target.value })}
                                    placeholder={product.productId?.specifications?.subCategory || 'e.g. Heavy Duty'}
                                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Display Name</label>
                            <input
                                type="text"
                                value={formData.customName}
                                onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
                                placeholder={product.productId?.name}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Description</label>
                            <textarea
                                rows={5}
                                value={formData.customDescription}
                                onChange={(e) => setFormData({ ...formData, customDescription: e.target.value })}
                                placeholder={product.productId?.description}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-300"
                            />
                        </div>
                    </div>

                    {/* Specifications Editor */}
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FaList className="text-blue-500" /> Specifications
                            </h3>
                        </div>

                        <div className="space-y-4">
                            {/* Existing Specs */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(formData.customSpecifications).map(([key, value]) => (
                                    <div key={key} className="flex items-center gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                                        <div className="flex-1">
                                            <p className="text-xs font-bold text-slate-400 uppercase">{key}</p>
                                            <p className="text-sm font-semibold text-slate-800">{value}</p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSpec(key)}
                                            className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                                        >
                                            <FaTimes />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add New Spec */}
                            <div className="flex gap-2 items-end pt-4 border-t border-slate-100">
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Feature Name</label>
                                    <input
                                        type="text"
                                        value={newSpecKey}
                                        onChange={(e) => setNewSpecKey(e.target.value)}
                                        placeholder="e.g. Voltage"
                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <label className="text-xs font-bold text-slate-400 uppercase">Value</label>
                                    <input
                                        type="text"
                                        value={newSpecValue}
                                        onChange={(e) => setNewSpecValue(e.target.value)}
                                        placeholder="e.g. 240V"
                                        className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddSpec}
                                    className="p-3 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
                                >
                                    <FaPlus />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Pricing & Stock */}
                <div className="space-y-8">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
                        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <FaTag className="text-blue-500" /> Pricing & Stock
                        </h3>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-500 uppercase tracking-wide">Retail Price (₹)</label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl font-black text-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                            {/* Margin Analysis could go here */}
                        </div>

                        <div className="pt-4 border-t border-slate-100 space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Wholesale Cost</span>
                                <span className="font-bold text-slate-800">₹{Number(product.sellerBasePrice || product.productId?.basePrice).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Platform Margin</span>
                                <span className="font-bold text-slate-800">5%</span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-500 font-medium">Max Margin Cap</span>
                                <span className="font-bold text-blue-500">{product.maxMargin || 20}%</span>
                            </div>
                        </div>

                        <div className="p-4 bg-blue-50 rounded-xl">
                            <div className="flex items-center gap-3">
                                <FaBoxOpen className="text-blue-500 w-5 h-5" />
                                <div>
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wide">Stock Level</p>
                                    <p className="text-lg font-black text-slate-800">{product.stock} Units</p>
                                </div>
                            </div>
                            {product.isAllocated && (
                                <div className="mt-2 text-xs text-slate-500 font-medium">
                                    Allocated from Manufacturer: <span className="font-bold">{product.allocatedStock}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Manufacturer Info Card */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4 opacity-75">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            Manufacturer
                        </h3>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg border border-slate-200 flex items-center justify-center font-bold text-slate-400">
                                {product.productId?.manufacturerId?.companyName?.[0] || 'M'}
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{product.productId?.manufacturerId?.companyName || 'Unknown'}</p>
                                <p className="text-xs text-slate-500">Authorized Partner</p>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
