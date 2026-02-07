'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaPlus, FaMinus, FaShieldAlt, FaArrowRight, FaShoppingBag, FaTruck } from 'react-icons/fa';
import Breadcrumb from '../../../client/components/ui/Breadcrumb';

const initialCart = [
    {
        id: '1',
        name: "ProClean 500W Mixer Grinder",
        price: 3499,
        image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=600",
        quantity: 1,
        seller: "LuxeHome Appliances"
    }
];

export default function CartPage() {
    const [cartItems, setCartItems] = useState(initialCart);

    const updateQuantity = (id: string, delta: number) => {
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
        ));
    };

    const removeItem = (id: string) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // Free for now
    const total = subtotal + shipping;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center">
                <div className="w-32 h-32 bg-slate-100 rounded-full flex items-center justify-center mb-8">
                    <FaShoppingBag className="w-12 h-12 text-slate-300" />
                </div>
                <h1 className="text-3xl font-black text-[#1E293B] mb-2">Your hub is empty</h1>
                <p className="text-slate-400 font-bold mb-8 uppercase tracking-widest text-xs">Start filling it with verified inventory</p>
                <Link href="/products">
                    <button className="bg-[#10367D] text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all">
                        Browse Collections
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-50/30">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <Breadcrumb
                    items={[{ label: 'Shopping Cart' }]}
                />

                <h1 className="text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight mb-12">
                    Verified <span className="text-[#10367D]">Inventory Hub</span>
                </h1>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="xl:col-span-2 space-y-6">
                        {cartItems.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                className="bg-white rounded-[2.5rem] p-6 lg:p-8 border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-8 items-center"
                            >
                                <div className="w-32 h-32 bg-slate-50 rounded-2xl p-4 flex-shrink-0">
                                    <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1 text-center sm:text-left">
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                                        <h3 className="text-xl font-black text-[#1E293B]">{item.name}</h3>
                                        <div className="inline-flex bg-[#10367D]/5 text-[#10367D] px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-[#10367D]/10 w-fit mx-auto sm:mx-0">
                                            {item.seller}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-4 mb-4">
                                        <span className="text-lg font-black text-[#10367D]">₹{item.price.toLocaleString()}</span>
                                        <div className="flex items-center gap-1.5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                                            <FaShieldAlt className="w-3 h-3" />
                                            Escrow Protected
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-center sm:justify-start gap-6">
                                        <div className="flex items-center gap-4 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                                            <button
                                                onClick={() => updateQuantity(item.id, -1)}
                                                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                                            >
                                                <FaMinus className="w-2.5 h-2.5 text-[#10367D]" />
                                            </button>
                                            <span className="text-sm font-black text-[#1E293B] w-4 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, 1)}
                                                className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-slate-50 transition-colors"
                                            >
                                                <FaPlus className="w-2.5 h-2.5 text-[#10367D]" />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-slate-300 hover:text-red-500 transition-colors p-2"
                                        >
                                            <FaTrash className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Item Total</p>
                                    <p className="text-2xl font-black text-[#1E293B]">₹{(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-[#10367D]/10 shadow-xl shadow-[#10367D]/5 sticky top-32">
                            <h3 className="text-xl font-black text-[#1E293B] mb-8 pb-4 border-b border-slate-50">Transaction Summary</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cart Subtotal</span>
                                    <span className="text-lg font-black text-[#1E293B]">₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Handling & Logistics</span>
                                    <span className="text-xs font-black text-emerald-500 uppercase tracking-widest">FREE</span>
                                </div>
                                <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                                    <span className="text-sm font-black text-[#1E293B] uppercase tracking-wider">Total Governance Value</span>
                                    <div className="text-right">
                                        <span className="text-3xl font-black text-[#10367D]">₹{total.toLocaleString()}</span>
                                        <p className="text-[8px] font-bold text-slate-400 uppercase mt-1">Inclusive of all taxes</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-50 mb-8">
                                <div className="flex items-center gap-3 text-slate-500">
                                    <FaTruck className="w-4 h-4 text-[#10367D]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Delivery by Saturday, 10 Feb</span>
                                </div>
                                <div className="flex items-center gap-3 text-slate-500">
                                    <FaShieldAlt className="w-4 h-4 text-[#10367D]" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">State-Enforced Escrow</span>
                                </div>
                            </div>

                            <Link href="/checkout">
                                <button className="w-full py-5 bg-[#10367D] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-3">
                                    Proceed to Governance
                                    <FaArrowRight className="w-4 h-4" />
                                </button>
                            </Link>

                            <p className="text-center mt-6 text-[9px] font-bold text-slate-400 uppercase leading-relaxed">
                                Values are secured by NovaMart protocol.<br />Payments are held in Escrow until verification.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

