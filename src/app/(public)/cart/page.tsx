'use client';

import React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineTrash,
    HiOutlinePlus,
    HiOutlineMinus,
    HiOutlineShieldCheck,
    HiOutlineArrowRight,
    HiOutlineShoppingBag,
    HiOutlineInformationCircle,
    HiOutlineCheckCircle,
    HiOutlineBookmark
} from 'react-icons/hi';
import { useCart } from '@/client/context/CartContext';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, subtotal, total, clearCart } = useCart();

    const taxEstimate = subtotal * 0.08;
    const finalTotal = subtotal + taxEstimate;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center px-4 bg-background">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-surface rounded-[10px] flex items-center justify-center mb-8 border border-foreground/5 shadow-inner"
                >
                    <HiOutlineShoppingBag className="w-10 h-10 text-foreground/20" />
                </motion.div>
                <h1 className="text-4xl font-black text-foreground mb-3 text-center">Your Cart is Empty</h1>
                <p className="text-foreground/40 font-bold mb-10 uppercase tracking-[0.2em] text-[10px] text-center">Start filling it with premium industrial inventory</p>
                <Link href="/products">
                    <button className="bg-black text-white px-10 py-5 rounded-[10px] font-black uppercase tracking-widest text-xs shadow-xl shadow-black/20 hover:scale-105 transition-all">
                        Explore Marketplace
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-24 bg-background">
            <div className="max-w-[1400px] mx-auto px-4 xs:px-6 lg:px-12">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight flex items-baseline gap-2 sm:gap-4 leading-none">
                            Your Cart
                            <span className="text-foreground/20 text-base sm:text-xl font-bold">({cart.length})</span>
                        </h1>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-[10px] font-black text-black uppercase tracking-[0.2em] hover:opacity-70 transition-opacity"
                    >
                        Clear All
                    </button>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-12 items-start">
                    {/* Cart Items List */}
                    <div className="xl:col-span-8 space-y-4">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="bg-white rounded-[10px] p-4 xs:p-6 lg:p-8 border border-foreground/[0.03] shadow-sm flex flex-col md:flex-row gap-6 md:gap-8 items-center group hover:border-black/20 transition-all"
                                >
                                    {/* Product Image */}
                                    <div className="w-40 h-40 bg-background rounded-[10px] p-4 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-contain relative z-10 transition-transform group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>

                                    {/* Item Details */}
                                    <div className="flex-1 space-y-4 w-full text-center md:text-left">
                                        <div className="space-y-1">
                                            <div className="flex flex-col md:flex-row md:items-center gap-3 justify-center md:justify-start">
                                                <h3 className="text-2xl font-black text-foreground tracking-tight italic uppercase">{item.name}</h3>
                                                <div className="flex items-center gap-2 justify-center md:justify-start">
                                                    <div className="bg-black/5 text-black px-2 py-0.5 xs:px-2.5 xs:py-1 rounded-[10px] text-[8px] xs:text-[9px] font-black uppercase tracking-[0.1em] border border-black/10 flex items-center gap-1.5">
                                                        <HiOutlineCheckCircle className="w-3 h-3" />
                                                        {item.sellerName}
                                                    </div>
                                                    <div className="bg-emerald-50 text-emerald-600 px-2.5 py-1 rounded-[10px] text-[9px] font-black uppercase tracking-[0.1em] border border-emerald-100 flex items-center gap-1.5">
                                                        <HiOutlineShieldCheck className="w-3 h-3" />
                                                        Escrow Protected
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                                <span className="text-[10px] font-black text-foreground/20 uppercase tracking-[0.15em] py-1 px-3 border border-foreground/5 rounded-[10px]">Official Dealer</span>
                                                {item.quantity >= 10 && (
                                                    <span className="text-[10px] font-black text-black/40 uppercase tracking-[0.15em] py-1 px-3 border border-black/10 rounded-[10px]">Wholesale Volume</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4 border-t border-foreground/[0.03]">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-6 bg-background p-1.5 rounded-[10px] border border-foreground/[0.03] w-fit">
                                                <button
                                                    onClick={() => updateQuantity(item.id, -1)}
                                                    className="w-10 h-10 rounded-[10px] bg-white shadow-sm flex items-center justify-center hover:bg-white/50 active:scale-95 transition-all text-black"
                                                >
                                                    <HiOutlineMinus className="w-3.5 h-3.5" />
                                                </button>
                                                <span className="text-lg font-black text-foreground w-6 text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, 1)}
                                                    className="w-10 h-10 rounded-[10px] bg-white shadow-sm flex items-center justify-center hover:bg-white/50 active:scale-95 transition-all text-black"
                                                >
                                                    <HiOutlinePlus className="w-3.5 h-3.5" />
                                                </button>
                                            </div>

                                            <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest italic">${item.price.toLocaleString()}.00 each</p>

                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="flex items-center gap-2 text-foreground/20 hover:text-red-500 transition-colors py-2 px-3 rounded-[10px] hover:bg-red-50"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Remove</span>
                                                </button>
                                                <button className="flex items-center gap-2 text-foreground/20 hover:text-black transition-colors py-2 px-3 rounded-[10px] hover:bg-black/5">
                                                    <HiOutlineBookmark className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Save</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Final Price for Item */}
                                    <div className="md:text-right md:min-w-[120px] w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-foreground/[0.03]">
                                        <p className="text-2xl sm:text-3xl font-black text-black tracking-tight italic">
                                            ₹{(item.price * item.quantity).toLocaleString()}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="xl:col-span-4 lg:sticky lg:top-32 space-y-6">
                        <div className="bg-white rounded-[10px] p-6 xs:p-8 lg:p-10 border border-foreground/[0.03] shadow-xl shadow-foreground/[0.02]">
                            <h3 className="text-xl sm:text-2xl font-black text-foreground mb-6 xs:mb-8 tracking-tight italic uppercase">Order Summary</h3>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.15em]">Subtotal ({cart.length} items)</span>
                                    <span className="text-lg font-black text-foreground">₹{subtotal.toLocaleString()}.00</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.15em]">Shipping Estimate</span>
                                    <span className="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-[10px] uppercase tracking-[0.15em]">Free</span>
                                </div>
                                <div className="flex justify-between items-center pb-6 border-b border-foreground/[0.03]">
                                    <span className="text-[11px] font-black text-foreground/40 uppercase tracking-[0.15em]">Tax Estimate</span>
                                    <span className="text-lg font-black text-foreground">₹{taxEstimate.toLocaleString()}.00</span>
                                </div>

                                <div className="space-y-1">
                                    <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight uppercase italic">Total</span>
                                    <div className="hidden sm:flex items-center gap-1.5 text-foreground/20">
                                        <HiOutlineShieldCheck className="w-4 h-4" />
                                        <span className="text-[9px] font-black uppercase tracking-widest">Protected by Escrow Service</span>
                                    </div>
                                </div>
                                <span className="text-3xl sm:text-4xl font-black text-black tracking-tight">₹{finalTotal.toLocaleString()}</span>
                            </div>

                            <Link href="/checkout">
                                <button className="w-full py-6 bg-black text-white font-black rounded-[10px] shadow-2xl shadow-black/30 hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-[0.2em] relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                    <div className="relative z-10 flex items-center gap-4">
                                        <HiOutlineShieldCheck className="w-5 h-5" />
                                        Proceed to Secure Checkout
                                    </div>
                                </button>
                            </Link>

                            <div className="mt-8 pt-8 border-t border-foreground/[0.03]">
                                <p className="text-center text-[9px] font-bold text-foreground/30 uppercase tracking-[0.15em] mb-6">Guaranteed safe & secure checkout</p>
                                <div className="flex justify-center gap-6 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default">
                                    <div className="w-10 h-10 bg-surface rounded-[10px] flex items-center justify-center"><HiOutlineShieldCheck className="w-6 h-6" /></div>
                                    <div className="w-10 h-10 bg-surface rounded-[10px] flex items-center justify-center border border-foreground/5 font-black text-[8px]">SSL</div>
                                    <div className="w-10 h-10 bg-surface rounded-[10px] flex items-center justify-center border border-foreground/5 font-black text-[8px]">PCI</div>
                                    <div className="w-10 h-10 bg-surface rounded-[10px] flex items-center justify-center border border-foreground/5 font-black text-[8px]">AES</div>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-black/5 rounded-[10px] p-6 xs:p-10 border border-foreground/5 flex gap-4 xs:gap-6">
                            <div className="w-12 h-12 bg-black/10 rounded-[10px] flex items-center justify-center text-black shrink-0">
                                <HiOutlineInformationCircle className="w-7 h-7" />
                            </div>
                            <div className="space-y-3">
                                <h4 className="text-[11px] font-black text-black uppercase tracking-[0.2em] italic">How NovaMart Escrow Works</h4>
                                <p className="text-[10px] font-bold text-foreground/50 leading-relaxed uppercase tracking-widest">
                                    Your payment is held securely in escrow. Funds are only released to the dealers after you confirm delivery of your items. No risk, full transparency.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

