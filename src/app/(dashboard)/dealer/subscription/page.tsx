'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '../../../../lib/api/client';
import { useSnackbar } from '../../../../client/context/SnackbarContext';
import { FaCheck, FaCrown, FaStar, FaBuilding } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function DealerSubscriptionPage() {
    const [plans, setPlans] = useState<any[]>([]);
    const [currentSub, setCurrentSub] = useState<any>(null);
    const { showSnackbar } = useSnackbar();

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
                showSnackbar('Subscription successful!', 'success');
                fetchMySubscription();
            }
        } catch (error) {
            showSnackbar('Subscription failed. Please try again.', 'error');
        }
    };

    const getIcon = (name: string) => {
        switch (name) {
            case 'BASIC': return <FaBuilding />;
            case 'PRO': return <FaStar />;
            case 'ENTERPRISE': return <FaCrown />;
            default: return <FaStar />;
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
                <h1 className="text-3xl font-black text-[#1E293B] tracking-tight mb-4">Upgrade your <span className="text-[#10367D]">Business</span></h1>
                <p className="text-slate-500">Choose a plan that fits your scaling needs. Access higher margins, priority support, and verified badges.</p>
            </div>

            {currentSub && (
                <div className="bg-[#10367D] text-white p-6 rounded-3xl shadow-xl shadow-[#10367D]/20 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-1">Current Plan</p>
                        <h2 className="text-2xl font-black">{currentSub.plan.name}</h2>
                        <p className="text-xs opacity-80 mt-1">Expires on {new Date(currentSub.endDate).toLocaleDateString()}</p>
                    </div>
                    <div className="bg-white/10 p-4 rounded-2xl">
                        {getIcon(currentSub.plan.name)}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                {plans.map((plan, idx) => (
                    <motion.div
                        key={plan.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`relative bg-white rounded-[2.5rem] p-8 border hover:shadow-xl transition-all duration-300 ${currentSub?.planId === plan.id ? 'border-[#10367D] ring-4 ring-[#10367D]/5' : 'border-slate-100'
                            }`}
                    >
                        {plan.name === 'PRO' && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#10367D] text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                Most Popular
                            </div>
                        )}

                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-6 ${getColor(plan.name)}`}>
                            {getIcon(plan.name)}
                        </div>

                        <h3 className="text-xl font-black text-[#1E293B]">{plan.name}</h3>
                        <div className="flex items-baseline gap-1 mt-2 mb-6">
                            <span className="text-3xl font-black text-[#10367D]">₹{Math.floor(plan.price)}</span>
                            <span className="text-sm font-bold text-slate-400">/year</span>
                        </div>

                        <ul className="space-y-4 mb-8">
                            {plan.features.map((feature: string, i: number) => (
                                <li key={i} className="flex items-start gap-3">
                                    <FaCheck className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                    <span className="text-xs font-bold text-slate-600 leading-relaxed">{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => handleSubscribe(plan.id)}
                            disabled={currentSub?.planId === plan.id}
                            className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${currentSub?.planId === plan.id
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-[#10367D] text-white hover:bg-[#0d2b63] shadow-xl shadow-[#10367D]/20 hover:shadow-2xl'
                                }`}
                        >
                            {currentSub?.planId === plan.id ? 'Current Plan' : 'Upgrade Now'}
                        </button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
