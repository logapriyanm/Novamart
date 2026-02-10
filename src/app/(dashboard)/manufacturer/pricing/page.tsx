'use client';

import React from 'react';
import { FaTag } from 'react-icons/fa';
import { Card } from '@/client/components/features/dashboard/DashboardUI';

export default function PricingRulesPage() {
    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pricing Rules</h2>
            <Card className="p-12 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[2.5rem] text-center space-y-4">
                <div className="w-20 h-20 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTag className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800">Advanced Pricing Engine Coming Soon!</h3>
                <p className="text-slate-400 text-sm font-bold">Configure bulk discounts, dealer-specific pricing tiers, and promotional rules here.</p>
            </Card>
        </div>
    );
}
