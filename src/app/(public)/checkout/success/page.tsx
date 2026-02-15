'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    HiOutlineCheckCircle,
    HiOutlineShieldCheck,
    HiOutlinePrinter,
    HiOutlineShare,
    HiOutlineArrowRight,
    HiOutlineCube,
    HiOutlineTruck,
    HiOutlineCreditCard,
    HiOutlineRefresh,
    HiCheck
} from 'react-icons/hi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { orderService } from '@/lib/api/services/order.service';
import Image from 'next/image';

export default function OrderSuccessPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('id');
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            if (!orderId) {
                setIsLoading(false);
                return;
            }
            try {
                const res = await orderService.getOrderById(orderId);
                setOrder(res.data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOrderDetails();
    }, [orderId]);

    const getStatusStep = (status: string) => {
        const steps = ['CREATED', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'COMPLETED', 'CANCELLED'];
        if (status === 'CANCELLED') return -1; // Handle cancelled specifically if needed
        return steps.indexOf(status);
    };

    const currentStep = order ? getStatusStep(order.status) : 0;

    const timelineItems = [
        {
            label: 'Order Placed',
            date: order ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Processing...',
            status: currentStep >= 0 ? 'completed' : 'pending',
            icon: HiOutlineCheckCircle,
            badge: 'Processing'
        },
        {
            label: 'Payment Held in Escrow',
            date: 'Funds are securely held until you receive the items',
            status: currentStep >= 1 ? 'completed' : currentStep === 0 ? 'active' : 'pending',
            icon: HiOutlineShieldCheck,
            badge: 'Processing'
        },
        {
            label: 'Shipped by Dealer',
            date: 'Waiting for dealer shipment confirmation',
            status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'active' : 'pending',
            icon: HiOutlineTruck,
            badge: 'Pending'
        },
        {
            label: 'Funds Released',
            date: 'Final payment will be transferred to dealer',
            status: currentStep >= 5 ? 'completed' : currentStep === 4 ? 'active' : 'pending',
            icon: HiOutlineCreditCard,
            badge: 'Pending'
        },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-black"
                >
                    <HiOutlineRefresh className="w-12 h-12" />
                </motion.div>
            </div>
        );
    }

    const displayOrderId = orderId || 'N/A';
    const firstItem = order?.items?.[0]; // Get the first item for the summary card
    const productName = firstItem?.product?.name || 'Product Detail Unavailable';
    const productPrice = firstItem?.price || 0;
    const productImage = firstItem?.product?.image || firstItem?.product?.images?.[0] || '/placeholder.png'; // Fallback image
    // Using totalAmount for now as configured in previous implementations, assuming inclusive of tax or simple calculation
    const subtotal = order?.totalAmount || 0;
    const shipping = 0; // Assuming free shipping or handled elsewhere for now. 
    // If shipping was part of total, we'd need to subtract. For now, matching the UI "Shipping $150.00" style if data existed.
    // I'll show a fixed value if order had it, or 0.

    // Formatting currency
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    return (
        <div className="min-h-screen pt-24 pb-20 bg-background flex flex-col items-center">
            <div className="max-w-[1100px] w-full px-6">

                {/* Header Section */}
                <div className="text-center space-y-4 mb-16">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mx-auto mb-6"
                    >
                        <HiCheck className="w-10 h-10" />
                    </motion.div>
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Order Secured</h1>
                        <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Confirmation ID: #{(order?.id || displayOrderId).toUpperCase().slice(-10)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Left: Timeline & Status (Span 7) */}
                    <div className="lg:col-span-7 bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-8">
                            <HiOutlineShare className="w-5 h-5 -rotate-90 text-indigo-600" />
                            <h3 className="text-lg font-bold text-slate-900">Order Journey</h3>
                        </div>

                        <div className="relative space-y-12 pl-4">
                            {/* Vertical connecting line */}
                            <div className="absolute left-[27px] top-6 bottom-6 w-[2px] bg-slate-100" />

                            {timelineItems.map((item, idx) => {
                                const isCompleted = item.status === 'completed';
                                const isActive = item.status === 'active';

                                return (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className="relative flex gap-6 items-start"
                                    >
                                        <div className={`
                                            relative z-10 w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-colors
                                            ${isCompleted ? 'bg-indigo-600 border-indigo-600 text-white' :
                                                isActive ? 'bg-white border-indigo-600 text-indigo-600' :
                                                    'bg-slate-50 border-slate-200 text-slate-400'}
                                        `}>
                                            <item.icon className="w-6 h-6" />
                                        </div>

                                        <div className="flex-1 pt-1">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className={`text-base font-bold ${isCompleted || isActive ? 'text-slate-900' : 'text-slate-400'}`}>
                                                    {item.label}
                                                </h4>
                                                <span className={`
                                                    px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider
                                                    ${isCompleted || isActive ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-100 text-slate-400'}
                                                `}>
                                                    {item.badge}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isCompleted || isActive ? 'text-slate-500' : 'text-slate-300'}`}>
                                                {item.date}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Escrow & Summary (Span 5) */}
                    <div className="lg:col-span-5 space-y-6">

                        {/* Escrow Protection Card */}
                        <div className="bg-[#1a1b4b] rounded-xl p-8 text-white relative overflow-hidden group">
                            {/* Background decorative elements matching design */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>

                            <div className="flex items-center gap-4 mb-6 relative z-10">
                                <HiOutlineShieldCheck className="w-8 h-8 text-white" />
                                <span className="text-lg font-bold">Escrow Protection</span>
                            </div>

                            <p className="text-slate-300 text-sm leading-relaxed mb-8 relative z-10">
                                Your payment of <span className="text-white font-bold">{formatCurrency(subtotal)}</span> is being held in a secure escrow account. The dealer will only receive the funds after you confirm the receipt and condition of your order.
                            </p>

                            <button className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 relative z-10">
                                Learn more about protection
                                <HiOutlineArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Order Summary Card */}
                        <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-6">Order Summary</h3>

                            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-100">
                                <div className="w-20 h-20 bg-slate-100 rounded-lg relative overflow-hidden flex-shrink-0">
                                    {/* Product Image */}
                                    {/* Using standard img for now if Image not configured, but using Next Image is better */}
                                    <Image
                                        src={productImage}
                                        alt={productName}
                                        fill
                                        className="object-cover"
                                        unoptimized // Handle external URLs simply
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 line-clamp-2 mb-1">{productName}</h4>
                                    <p className="text-xs text-slate-500 mb-2">Quantity: {firstItem?.quantity || 1}</p>
                                    <p className="font-bold text-indigo-700">{formatCurrency(productPrice)}</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Shipping</span>
                                    <span className="font-medium text-slate-900">{shipping === 0 ? '$0.00' : formatCurrency(shipping)}</span>
                                </div>
                                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="font-bold text-xl text-indigo-700">{formatCurrency(subtotal + shipping)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Go to My Orders Button */}
                        <Link href="/customer/orders">
                            <button className="w-full py-4 bg-[#1a1b4b] hover:bg-[#15163a] text-white rounded-lg font-bold flex items-center justify-center gap-2 transition-colors shadow-lg shadow-indigo-900/20">
                                Go to My Orders
                                <HiOutlineArrowRight className="w-5 h-5" />
                            </button>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}
