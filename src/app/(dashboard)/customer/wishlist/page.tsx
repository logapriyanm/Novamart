'use client';

import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { Card } from '@/client/components/features/dashboard/DashboardUI';

export default function WishlistPage() {
    return (
        <div className="space-y-8 animate-fade-in max-w-7xl mx-auto">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">My Wishlist</h2>
            <Card className="p-12 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[2.5rem] text-center space-y-4">
                <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHeart className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-800">Wishlist Coming Soon!</h3>
                <p className="text-slate-400 text-sm font-bold">We are building a personalized wishlist experience for you. Stay tuned!</p>
            </Card>
        </div>
    );
}
