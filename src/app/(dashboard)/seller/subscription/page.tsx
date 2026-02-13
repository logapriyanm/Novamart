'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { FaCheck, FaCrown, FaStar, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function SellerSubscriptionPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [currentSub, setCurrentSub] = useState<any>(null);
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        fetchPlans();
        fetchMySubscription();
    }, []);

    const fetchPlans = async () => {
        try {
            const res = await apiClient.get<any>('/subscription/plans');
            if (res.success) setPlans(res.data);
        } catch (error) {
            console.error('Failed to fetch plans');
        }
    };

    const fetchMySubscription = async () => {
        try {
            const res = await apiClient.get<any>('/subscription/my-subscription');
            if (res.success) setCurrentSub(res.data);
        } catch (error) {
            console.error('Failed to fetch subscription');
        }
    };

    const handleSubscribe = async (planId: string) => {
        try {
            const res = await apiClient.post<any>('/subscription/subscribe', { planId });
            if (res.success) {
                toast.success('Subscription successful!');
                fetchMySubscription();
            }
        } catch (error) {
            toast.error('Subscription failed. Please try again.');
        }
    };

    const handleCancel = async () => {
        if (!window.confirm('Are you sure you want to cancel your active subscription? This will revoke your tier benefits immediately.')) return;

        try {
            const res = await apiClient.post<any>('/subscription/cancel', {});
            if (res.success) {
                toast.success('Subscription cancelled successfully');
                fetchMySubscription();
            }
        } catch (error) {
            toast.error('Cancellation failed');
        }
    };

    const getIcon = (name: string) => {
        switch (name) {
            case 'BASIC': return <FaBuilding className="w-6 h-6" />;
            case 'PRO': return <FaStar className="w-6 h-6" />;
            case 'ENTERPRISE': return <FaCrown className="w-6 h-6" />;
            default: return <FaStar className="w-6 h-6" />;
        }
    };

    const getColor = (name: string) => {
        switch (name) {
            case 'BASIC': return 'bg-slate-100 text-slate-600';
            case 'PRO': return 'bg-blue-100 text-blue-600';
            case 'ENTERPRISE': return 'bg-amber-100 text-amber-600';
            default: return 'bg-slate-100 text-slate-600';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="text-center max-w-2xl mx-auto">
                <h1 className="text-3xl font-black text-[#1E293B] tracking-tight mb-4 italic uppercase">Accelerate your <span className="text-[#10367D]">Growth</span></h1>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Phase 6: Multi-Tier Performance Ecosystem</p>
                <p className="text-sm font-bold text-slate-500">Tiered growth plans designed for high-performing sellers. Unlock wholesale discounts, prioritized stock, and boosted retail margins.</p>
            </div>

            {currentSub && (
                <div className="bg-[#10367D] text-white p-8 rounded-[10px] shadow-2xl shadow-[#10367D]/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-500">
                        {getIcon(currentSub.plan.name)}
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">Active Partner</span>
                            {currentSub.plan.priorityAllocation && (
                                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1">
                                    <FaStar className="w-2 h-2" /> Priority Access
                                </span>
                            )}
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 font-black mb-1">Your Portfolio Status</p>
                        <h2 className="text-4xl font-black italic uppercase tracking-tighter">{currentSub.plan.name} <span className="text-slate-400 italic font-black text-lg ml-2">Tier</span></h2>
                        <div className="flex items-center gap-4 mt-4">
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Wholesale Benefit</p>
                                <p className="text-xl font-black text-emerald-400">-{currentSub.plan.wholesaleDiscount}%</p>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="text-center">
                                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Margin Boost</p>
                                <p className="text-xl font-black text-blue-400">+{currentSub.plan.marginBoost}%</p>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 mt-6 uppercase tracking-widest">Subscription valid until {new Date(currentSub.endDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={handleCancel}
                            className="px-8 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 rounded-[10px] text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            Cancel Subscription
                        </button>
                        <div className="bg-white/10 p-6 rounded-[10px] flex items-center justify-center">
                            {getIcon(currentSub.plan.name)}
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative bg-white rounded-[10px] p-10 border hover:shadow-2xl transition-all duration-500 group ${currentSub?.planId === plan.id ? 'border-[#10367D] ring-8 ring-[#10367D]/5' : 'border-slate-100'
                            }`}
                    >
                        {plan.name === 'PRO' && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#10367D] text-white px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl shadow-[#10367D]/20 italic">
                                Strategic Choice
                            </div>
                        )}

                        <div className={`w-20 h-20 rounded-[10px] flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-500 ${getColor(plan.name)}`}>
                            {getIcon(plan.name)}
                        </div>

                        <h3 className="text-2xl font-black text-[#1E293B] italic uppercase tracking-tight">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mt-2 mb-8">
                            <span className="text-4xl font-black text-[#10367D]">₹{Math.floor(plan.price).toLocaleString()}</span>
                            <span className="text-sm font-black text-slate-400 uppercase tracking-widest">/Year</span>
                        </div>

                        <div className="space-y-4 mb-10">
                            {/* Visual Benefits */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div className="p-3 rounded-[10px] bg-emerald-50 border border-emerald-100">
                                    <p className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Wholesale Off</p>
                                    <p className="text-lg font-black text-emerald-700">{plan.wholesaleDiscount}%</p>
                                </div>
                                <div className="p-3 rounded-[10px] bg-blue-50 border border-blue-100">
                                    <p className="text-[8px] font-black text-blue-600 uppercase tracking-widest">Price Margin</p>
                                    <p className="text-lg font-black text-blue-700">+{plan.marginBoost}%</p>
                                </div>
                            </div>

                            {plan.features.map((feature: string, i: number) => (
                                <li key={i} className="flex items-start gap-4 list-none">
                                    <div className="w-5 h-5 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                                        <FaCheck className="w-2.5 h-2.5 text-emerald-500" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 leading-snug">{feature}</span>
                                </li>
                            ))}
                        </div>

                        <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={currentSub?.planId === plan.id}
                            className={`w-full py-5 rounded-[10px] text-[10px] font-black uppercase tracking-[0.2em] transition-all ${currentSub?.planId === plan.id
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-black text-white hover:bg-[#10367D] shadow-xl hover:shadow-2xl shadow-black/5'
                                }`}
                        >
                            {currentSub?.planId === plan.id ? 'Active Business Tier' : `Select ${plan.name} Strategy`}
                        </button>
                    </motion.div>
                ))}
            </div>

            <div className="mt-16 bg-white border border-slate-100 rounded-[10px] p-10 flex items-center justify-between">
                <div>
                    <h4 className="text-xl font-black text-[#1E293B] italic uppercase tracking-tight">Need a custom <span className="text-[#10367D]">Volume Plan?</span></h4>
                    <p className="text-sm font-bold text-slate-500 mt-2">Connecting high-volume distributors with manufacturing nodes directly.</p>
                </div>
                <button className="px-8 py-4 bg-[#10367D]/5 text-[#10367D] rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-[#10367D]/10 transition-all border border-[#10367D]/10">
                    Contact Node Admin
                </button>
            </div>
        </div>
    );
}

