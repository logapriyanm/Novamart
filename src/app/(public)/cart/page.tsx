'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlinePlus,
    HiOutlineMinus,
    HiOutlineShieldCheck,
    HiOutlineShoppingBag,
    HiOutlineCheckCircle,
    HiOutlineTrash,
    HiOutlineLockClosed,
} from 'react-icons/hi';

import { useCart } from '@/client/context/CartContext';

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, subtotal, total, clearCart } = useCart();
    const [promoCode, setPromoCode] = useState('');

    const taxEstimate = subtotal * 0.08;
    const finalTotal = subtotal + taxEstimate;

    if (cart.length === 0) {
        return (
            <div className="min-h-screen pt-40 pb-20 flex flex-col items-center justify-center px-4 bg-white">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-gray-50 rounded-xl flex items-center justify-center mb-8 border border-gray-100"
                >
                    <HiOutlineShoppingBag className="w-10 h-10 text-gray-300" />
                </motion.div>
                <h1 className="text-3xl font-bold text-gray-900 mb-3 text-center">Your Cart is Empty</h1>
                <p className="text-gray-400 mb-10 text-sm text-center">Start filling it with premium products</p>
                <Link href="/products">
                    <button className="bg-[#1a1a6e] text-white px-10 py-4 rounded-lg font-semibold text-sm hover:bg-[#13134f] transition-colors">
                        Explore Marketplace
                    </button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-24 pb-24 bg-white">
            <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                {/* Breadcrumb */}
                <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-600 transition-colors">Home</Link>
                    <span>›</span>
                    <span className="text-gray-700 font-medium">Shopping Cart</span>
                </nav>

                {/* Header */}
                <div className="flex items-start justify-between mb-2">
                    <div>
                        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Shopping Cart</h1>
                        <p className="text-sm text-gray-400 mt-1">{cart.length} unique items in your cart</p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors flex items-center gap-1.5 mt-2"
                    >
                        <HiOutlineTrash className="w-4 h-4" />
                        Clear All
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-8 space-y-0 divide-y divide-gray-100">
                        <AnimatePresence mode="popLayout">
                            {cart.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, x: -50 }}
                                    className="py-6 first:pt-0 last:pb-0"
                                >
                                    <div className="flex gap-5">
                                        {/* Product Image */}
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-lg p-3 flex-shrink-0 flex items-center justify-center border border-gray-100">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                        </div>

                                        {/* Item Details */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="min-w-0">
                                                    <h3 className="text-base font-bold text-gray-900 truncate">{item.name}</h3>
                                                    {/* Badges */}
                                                    <div className="flex flex-wrap items-center gap-2 mt-1.5">
                                                        <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                                                            <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                                                            Official Seller
                                                        </span>
                                                        <span className="text-gray-300">•</span>
                                                        <span className="text-xs text-gray-500">Escrow Protected</span>
                                                        {item.quantity >= 10 && (
                                                            <>
                                                                <span className="text-gray-300">•</span>
                                                                <span className="text-xs text-gray-500">Wholesale Volume</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 mt-1">Unit Price: ₹{item.price.toLocaleString()}</p>
                                                </div>
                                                {/* Price */}
                                                <p className="text-lg sm:text-xl font-bold text-gray-900 whitespace-nowrap">
                                                    ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                                </p>
                                            </div>

                                            {/* Controls Row */}
                                            <div className="flex items-center justify-between mt-4">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center border border-gray-200 rounded-md overflow-hidden">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, -1)}
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <HiOutlineMinus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <span className="w-10 h-9 flex items-center justify-center text-sm font-semibold text-gray-900 border-x border-gray-200 bg-white">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, 1)}
                                                        className="w-9 h-9 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <HiOutlinePlus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>

                                                {/* Remove Button (bin icon) */}
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="flex items-center gap-1.5 text-red-500 hover:text-red-600 transition-colors text-sm font-semibold"
                                                >
                                                    <HiOutlineTrash className="w-4 h-4" />
                                                    <span className="hidden sm:inline">REMOVE</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:col-span-4 lg:sticky lg:top-28">
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>

                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Subtotal ({cart.length} items)</span>
                                        <span className="text-sm font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Shipping Estimate</span>
                                        <span className="text-sm font-bold text-red-500 uppercase">Free</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Tax Estimate</span>
                                        <span className="text-sm font-semibold text-gray-900">₹{taxEstimate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-gray-900">Total</span>
                                        <div className="text-right">
                                            <span className="text-2xl font-black text-[#1a1a6e]">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mt-0.5">Incl. all taxes and fees</p>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/checkout">
                                    <button className="w-full py-4 bg-[#1a1a6e] text-white font-bold rounded-lg hover:bg-[#13134f] transition-colors flex items-center justify-center gap-3 text-sm">
                                        Proceed to Secure Checkout
                                        <HiOutlineLockClosed className="w-4 h-4" />
                                    </button>
                                </Link>

                                {/* Security Badges */}
                                <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-gray-100">
                                    <div className="flex flex-col items-center gap-1">
                                        <HiOutlineShieldCheck className="w-5 h-5 text-gray-400" />
                                        <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">SSL Secure</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <HiOutlineCheckCircle className="w-5 h-5 text-gray-400" />
                                        <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">PCI Compliant</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <HiOutlineLockClosed className="w-5 h-5 text-gray-400" />
                                        <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider">AES 256-BIT</span>
                                    </div>
                                </div>

                                {/* Promo Code */}
                                <div className="mt-6 pt-5 border-t border-gray-100">
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Promotional Code</p>
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={promoCode}
                                            onChange={(e) => setPromoCode(e.target.value)}
                                            placeholder="Enter code"
                                            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-[#1a1a6e] transition-colors"
                                        />
                                        <button className="px-5 py-2.5 border-2 border-[#1a1a6e] text-[#1a1a6e] rounded-lg text-sm font-bold hover:bg-[#1a1a6e] hover:text-white transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
