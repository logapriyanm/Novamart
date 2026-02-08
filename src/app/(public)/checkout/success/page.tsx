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
    HiOutlineRefresh
} from 'react-icons/hi';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { orderService } from '../../../../lib/api/services/order.service';

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
        const steps = ['CREATED', 'PAID', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'COMPLETED'];
        return steps.indexOf(status);
    };

    const currentStep = order ? getStatusStep(order.status) : 0;

    const timelineItems = [
        {
            label: 'Order Placed',
            date: order ? new Date(order.createdAt).toLocaleString() : 'Processing...',
            status: currentStep >= 0 ? 'completed' : 'pending',
            icon: HiOutlineCheckCircle
        },
        {
            label: 'Payment Held in Escrow',
            date: currentStep >= 1 ? 'Secured' : 'Processing...',
            status: currentStep >= 1 ? 'completed' : currentStep === 0 ? 'active' : 'pending',
            icon: HiOutlineShieldCheck
        },
        {
            label: 'Shipped by Dealer',
            date: currentStep >= 3 ? 'In Transit' : 'Pending',
            status: currentStep >= 3 ? 'completed' : currentStep === 2 ? 'active' : 'pending',
            icon: HiOutlineTruck
        },
        {
            label: 'Funds Released',
            date: currentStep >= 5 ? 'Completed' : 'Pending',
            status: currentStep >= 5 ? 'completed' : currentStep === 4 ? 'active' : 'pending',
            icon: HiOutlineCreditCard
        },
    ];

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="text-primary"
                >
                    <HiOutlineRefresh className="w-12 h-12" />
                </motion.div>
            </div>
        );
    }

    const displayOrderId = orderId || 'N/A';

    return (
        <div className="min-h-screen pt-24 pb-20 bg-background flex flex-col items-center">
            <div className="max-w-[1000px] w-full px-6">

                {/* Header Section */}
                <div className="text-center space-y-4 mb-10">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto shadow-2xl shadow-emerald-500/30"
                    >
                        <HiOutlineCheckCircle className="w-14 h-14" />
                    </motion.div>
                    <div className="space-y-2">
                        <h1 className="text-5xl font-black text-foreground tracking-tight italic">Order <span className="text-primary">Secured</span></h1>
                        <p className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.3em]">Confirmation ID: {(order?.id || displayOrderId).toUpperCase()}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                    {/* Left: Timeline & Status */}
                    <div className="bg-white rounded-[3rem] p-10 lg:p-12 border border-foreground/[0.03] shadow-xl shadow-foreground/[0.02]">
                        <h3 className="text-lg font-black text-foreground mb-10 tracking-tight uppercase italic">Order <span className="text-primary">Journey</span></h3>

                        <div className="space-y-10 relative">
                            {/* Vertical line */}
                            <div className="absolute left-[23px] top-2 bottom-2 w-0.5 bg-foreground/5" />

                            {timelineItems.map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="flex items-start gap-8 relative z-10"
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border-2 transition-all ${item.status === 'completed' ? 'bg-primary border-primary text-white' :
                                        item.status === 'active' ? 'bg-white border-primary text-primary' :
                                            'bg-white border-foreground/5 text-foreground/20'
                                        }`}>
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className={`text-[11px] font-black uppercase tracking-widest ${item.status === 'pending' ? 'text-foreground/20' : 'text-foreground'}`}>
                                            {item.label}
                                        </p>
                                        <p className={`text-[10px] font-bold uppercase tracking-[0.05em] ${item.status === 'pending' ? 'text-foreground/10' : 'text-foreground/40'}`}>
                                            {item.date}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Escrow & Summary */}
                    <div className="space-y-8">
                        {/* Escrow Status Box */}
                        <div className="bg-primary text-white rounded-[3rem] p-10 shadow-2xl shadow-primary/20 relative overflow-hidden group">
                            <div className="absolute right-0 top-0 w-40 h-40 bg-white/5 blur-3xl rounded-full -mr-20 -mt-20 group-hover:scale-125 transition-transform duration-700" />

                            <div className="flex items-center justify-between mb-8">
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                                    <HiOutlineShieldCheck className="w-8 h-8" />
                                </div>
                                <div className="bg-white/10 px-4 py-1.5 rounded-full border border-white/20 text-[9px] font-black uppercase tracking-widest">
                                    Secured
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-xl font-black italic">Funds Held in <span className="text-primary-foreground/60">Escrow</span></h4>
                                <p className="text-[10px] font-bold text-white/50 uppercase tracking-widest leading-relaxed">
                                    Your payment is protected by NovaMart Escrow. Funds will be autonomously released to the seller after your confirmation of receipt or after 48 hours of delivery.
                                </p>
                            </div>

                            <button className="mt-10 w-full py-4 bg-white text-primary rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:scale-[1.03] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                                Learn More About Protection
                                <HiOutlineArrowRight className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Actions */}
                        <div className="grid grid-cols-2 gap-4">
                            <button className="bg-white border border-foreground/5 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-surface transition-all group">
                                <div className="p-3 rounded-xl bg-foreground/5 text-foreground/40 group-hover:bg-foreground/10 group-hover:text-foreground transition-all">
                                    <HiOutlinePrinter className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Download Receipt</span>
                            </button>
                            <button className="bg-white border border-foreground/5 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:bg-surface transition-all group">
                                <div className="p-3 rounded-xl bg-foreground/5 text-foreground/40 group-hover:bg-foreground/10 group-hover:text-foreground transition-all">
                                    <HiOutlineShare className="w-5 h-5" />
                                </div>
                                <span className="text-[9px] font-black uppercase tracking-widest text-foreground/40">Share Details</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Return button */}
                <div className="mt-16 text-center">
                    <Link href="/customer">
                        <button className="bg-foreground text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-foreground/20 flex items-center gap-4 mx-auto">
                            Go to My Orders
                            <HiOutlineArrowRight className="w-4 h-4" />
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

