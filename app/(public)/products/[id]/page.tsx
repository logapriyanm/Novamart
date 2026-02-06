'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaStar, FaTruck, FaClock, FaUndo, FaCheckCircle, FaMinus, FaPlus, FaShoppingCart, FaBolt, FaQuestionCircle, FaAward } from 'react-icons/fa';
import ChatWidget from '../../../../src/components/chat/ChatWidget';
import Breadcrumb from '../../../../src/components/ui/Breadcrumb';

// Mock data for demonstration - in real app, fetch by id
const productData = {
    id: '1',
    name: "ProClean 500W Mixer Grinder",
    price: 3499,
    mrp: 5999,
    discount: '42% OFF',
    rating: 4.8,
    reviews: 1240,
    images: [
        "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200",
        "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200",
        "https://images.unsplash.com/photo-1509391366360-fe5bb6521e7c?q=80&w=1200"
    ],
    verified: true,
    stock: 12,
    seller: {
        name: "LuxeHome Appliances Ltd.",
        rating: 4.9,
        verified: true,
        since: "2018",
        location: "Rajkot, Gujarat"
    },
    specs: {
        "Power": "500 Watts",
        "Jars": "3 Stainless Steel Jars",
        "Material": "ABS Plastic Body",
        "Warranty": "2 Years Manufacturer Warranty"
    }
};

export default function ProductDetailPage() {
    const { id } = useParams();
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-50/30">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Products', href: '/products' },
                        { label: 'Kitchen Appliances', href: '/products?cat=kitchen-appliances' },
                        { label: productData.name }
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                    {/* Left: Product Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-[4/3] bg-white rounded-[3rem] border border-slate-100 overflow-hidden relative group shadow-sm">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={productData.images[selectedImage]}
                                alt={productData.name}
                                className="w-full h-full object-contain p-12"
                            />
                            {productData.verified && (
                                <div className="absolute top-8 left-8 bg-[#10367D] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#10367D]/20">
                                    <FaShieldAlt className="w-4 h-4" />
                                    Verified Quality
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {productData.images.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-24 h-24 rounded-2xl bg-white border-2 transition-all p-2 flex-shrink-0 ${selectedImage === idx ? 'border-[#10367D] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-[#10367D]/5 text-[#10367D] px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#10367D]/10">
                                    {productData.seller.name}
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl">
                                    <FaStar className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-black">{productData.rating}</span>
                                    <span className="text-[10px] font-bold text-amber-600/60 ml-1">({productData.reviews} reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight mb-4 leading-tight">
                                {productData.name}
                            </h1>
                            <div className="flex items-end gap-4 mb-6">
                                <span className="text-4xl font-black text-[#10367D]">₹{productData.price.toLocaleString()}</span>
                                <span className="text-xl font-bold text-slate-300 line-through mb-1">₹{productData.mrp.toLocaleString()}</span>
                                <span className="text-sm font-black text-emerald-500 bg-emerald-50 px-3 py-1 rounded-lg mb-1">{productData.discount}</span>
                            </div>
                        </div>

                        {/* Seller Card & Features */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="p-6 rounded-[2rem] bg-white border border-[#10367D]/5 shadow-sm space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Distributor</span>
                                    <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 italic">
                                        <FaCheckCircle className="w-2.5 h-2.5" />
                                        <span className="text-[8px] font-black uppercase">Verified Chain</span>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-black text-[#1E293B] italic">{productData.seller.name}</h4>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{productData.seller.location}</span>
                                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                                        <span className="text-[10px] font-black text-[#10367D] uppercase">Batch ID: DLR-MU-26-X440</span>
                                    </div>
                                </div>
                                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Manufacturer Traceability</p>
                                    <p className="text-[10px] font-black text-[#1E293B]">MFG-NS-2026-X8801 <span className="text-slate-300 ml-1">| Original Seal</span></p>
                                </div>
                                <button className="w-full py-2.5 rounded-xl border border-[#10367D]/10 text-[#10367D] text-[10px] font-black uppercase tracking-widest hover:bg-[#10367D] hover:text-white transition-all">
                                    Verify Dealer Credentials
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-4 text-[#1E293B]/60">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#10367D]">
                                        <FaTruck className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black">Dealer-Direct Fulfillment</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Tracked via Nova-Escrow Path</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-[#1E293B]/60">
                                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#10367D]">
                                        <FaAward className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black">15-Point Quality Audit</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Platform Governance Approved</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quantity & CTA */}
                        <div className="mb-10">
                            <div className="flex items-center gap-6 mb-8 bg-white/50 backdrop-blur-xl border border-[#10367D]/5 p-6 rounded-[2rem]">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-10 h-10 rounded-xl border border-[#10367D]/10 flex items-center justify-center hover:bg-[#10367D]/5"
                                    >
                                        <FaMinus className="w-3 h-3 text-[#10367D]" />
                                    </button>
                                    <span className="text-lg font-black text-[#1E293B] w-6 text-center">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-10 h-10 rounded-xl border border-[#10367D]/10 flex items-center justify-center hover:bg-[#10367D]/5"
                                    >
                                        <FaPlus className="w-3 h-3 text-[#10367D]" />
                                    </button>
                                </div>
                                <div className="text-sm font-bold text-slate-400">
                                    Only <span className="text-[#10367D]">{productData.stock} items</span> left in stock!
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <button className="w-full py-5 bg-white border-2 border-[#10367D] text-[#10367D] font-black text-sm rounded-2xl shadow-xl shadow-[#10367D]/5 hover:bg-[#10367D]/5 transition-all uppercase tracking-widest flex items-center justify-center gap-3">
                                    <FaShoppingCart className="w-4 h-4" />
                                    Add to Cart
                                </button>
                                <button className="w-full py-5 bg-[#10367D] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-3">
                                    <FaBolt className="w-4 h-4" />
                                    Secure Buy now
                                </button>
                            </div>
                        </div>

                        {/* Trust-Controlled Chat Widget */}
                        <ChatWidget
                            productId={id as string}
                            dealerId="mock-dealer-id"
                            dealerName={productData.seller.name}
                        />

                        {/* Tabs */}
                        <div className="border-t border-[#10367D]/5 pt-8">
                            <div className="flex gap-8 mb-8 border-b border-[#10367D]/5">
                                {['description', 'specifications', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#10367D]' : 'text-slate-400'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10367D]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="min-h-[200px]">
                                {activeTab === 'specifications' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {Object.entries(productData.specs).map(([key, val]) => (
                                            <div key={key} className="flex justify-between p-4 bg-white rounded-2xl border border-slate-50">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{key}</span>
                                                <span className="text-xs font-bold text-[#1E293B]">{val}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                        "{productData.name} is engineered for performance and durability. Featuring high-grade components and an innovative user-first design, it brings protocol-grade efficiency to your daily home operations. Every unit is tested against our 15-point quality checklist before being securely shipped from our hub."
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
