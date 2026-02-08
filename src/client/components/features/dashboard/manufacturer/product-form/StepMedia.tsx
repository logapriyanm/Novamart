'use client';

import React, { useState } from 'react';
import {
    FaCloudUploadAlt, FaVideo, FaTrash, FaCheckCircle,
    FaInfoCircle, FaImage, FaLightbulb, FaExchangeAlt, FaPlus,
    FaBox, FaSearch
} from 'react-icons/fa';
import { useProductForm } from '../../../../../context/ProductFormContext';

export default function StepMedia() {
    const { productData, updateProductData } = useProductForm();

    const handleSimulatedUpload = () => {
        // Simulate upload delay
        setTimeout(() => {
            const randomImage = `https://images.unsplash.com/photo-${Math.floor(Math.random() * 1000)}?auto=format&fit=crop&w=500&q=60`;
            // Actually let's use some real nice product images from Unsplash
            const niceImages = [
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop"
            ];
            const img = niceImages[Math.floor(Math.random() * niceImages.length)];

            updateProductData({
                images: [...productData.images, img]
            });
        }, 800);
    };

    const removeImage = (index: number) => {
        const newImages = productData.images.filter((_, i) => i !== index);
        updateProductData({ images: newImages });
    };

    const setPrimary = (index: number) => {
        const newImages = [...productData.images];
        const primary = newImages.splice(index, 1)[0];
        newImages.unshift(primary);
        updateProductData({ images: newImages });
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-fade-in">
            {/* Left Column: Media Forms */}
            <div className="flex-1 space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-black text-[#1E293B]">Image Gallery</h3>
                        <p className="text-xs font-bold text-slate-400 mt-1">Upload at least 3 high-resolution product images.</p>
                    </div>
                </div>

                {/* Upload Area (Simulated) */}
                <div
                    onClick={handleSimulatedUpload}
                    className="border-2 border-dashed border-slate-200 rounded-[2rem] p-12 flex flex-col items-center justify-center text-center bg-slate-50/50 hover:bg-slate-50 hover:border-[#0F6CBD] transition-all cursor-pointer group"
                >
                    <div className="w-16 h-16 bg-blue-50 text-[#0F6CBD] rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <FaCloudUploadAlt className="w-7 h-7" />
                    </div>
                    <h4 className="text-sm font-black text-[#1E293B] mb-2">Click to upload (Demo Mode)</h4>
                    <p className="text-[10px] font-bold text-slate-400">Simulates uploading an image from Unsplash</p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {productData.images.map((img, index) => (
                        <div key={index} className={`relative group aspect-square rounded-2xl overflow-hidden border-2 shadow-md bg-white ${index === 0 ? 'border-[#0F6CBD]' : 'border-slate-100'}`}>
                            {index === 0 && (
                                <span className="absolute top-2 left-2 bg-[#0F6CBD] text-white text-[8px] font-black px-2 py-1 rounded shadow-sm z-10 uppercase tracking-wider">Primary</span>
                            )}
                            <img src={img} alt={`Product ${index}`} className="w-full h-full object-contain p-2" />

                            {/* Actions Overlay */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="p-2 bg-white text-rose-500 rounded-full hover:bg-rose-50"><FaTrash className="w-3 h-3" /></button>
                                {index !== 0 && (
                                    <button onClick={(e) => { e.stopPropagation(); setPrimary(index); }} className="p-2 bg-white text-[#0F6CBD] rounded-full hover:bg-blue-50" title="Set as Primary"><FaCheckCircle className="w-3 h-3" /></button>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* Add Placeholder */}
                    <div onClick={handleSimulatedUpload} className="aspect-square rounded-2xl border border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-300 hover:text-[#0F6CBD] hover:border-[#0F6CBD] hover:bg-white transition-all cursor-pointer">
                        <FaImage className="w-5 h-5 mb-1" />
                        <span className="text-[8px] font-black uppercase tracking-wider">Add Photo</span>
                    </div>
                </div>

                {/* 360 Media */}
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <h3 className="text-sm font-black text-[#1E293B] mb-2">360° Interactive Media</h3>
                    <p className="text-xs font-medium text-slate-400 mb-6">Provide an interactive view of your product to increase conversion.</p>
                    {/* Placeholder for Video implementation */}
                    <div className="border border-slate-100 rounded-xl p-6 flex flex-col justify-center bg-slate-50 text-center">
                        <p className="text-[10px] text-slate-400">Video upload coming soon.</p>
                    </div>
                </div>
            </div>

            {/* Right Column: Sidebar */}
            <div className="w-full lg:w-80 space-y-6">
                <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <FaCheckCircle className="w-4 h-4 text-[#0F6CBD]" />
                        <h3 className="text-sm font-black text-[#1E293B]">Media Standards</h3>
                    </div>
                    <div className="space-y-4">
                        {/* Tips */}
                        <p className="text-[10px] text-slate-500 leading-snug">Demo Mode enabled: Uploads are simulated for testing.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
