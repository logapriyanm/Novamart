'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    FaArrowLeft, FaStore, FaMapMarkerAlt, FaCalendarAlt,
    FaStar, FaBoxOpen, FaCheckCircle, FaExclamationCircle,
    FaEnvelope, FaPhone
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface DealerProfile {
    id: string;
    businessName: string;
    city: string;
    state: string;
    joinedAt: string;
    stats: {
        averageRating: number;
        reviewCount: number;
        totalProducts: number;
    };
    reviews: any[];
    inventory: any[];
}

export default function ManufacturerDealerProfilePage() {
    const params = useParams();
    const router = useRouter();
    const [dealer, setDealer] = useState<DealerProfile | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            if (!params.id) return;
            setIsLoading(true);
            try {
                // Determine which endpoint to use. Ideally manufacturer should have a richer view,
                // but public profile is a good fallback for basic info.
                // We'll use the public endpoint as it exists and provides core data.
                const response = await apiClient.get<any>(`/dealer/public/${params.id}`);
                setDealer(response);
            } catch (error: any) {
                console.error('Failed to fetch dealer profile:', error);
                toast.error('Failed to load dealer profile');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-8 h-8 border-4 border-[#0F6CBD] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!dealer) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
                <FaExclamationCircle className="w-12 h-12 text-slate-300 mb-4" />
                <h3 className="text-lg font-black text-slate-700">Dealer Not Found</h3>
                <button
                    onClick={() => router.back()}
                    className="mt-4 px-6 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
                >
                    Go Back
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header / Nav */}
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-slate-500 hover:text-[#0F6CBD] transition-colors text-sm font-bold uppercase tracking-wider"
            >
                <FaArrowLeft /> Back to Requests
            </button>

            {/* Profile Header Card */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-transparent rounded-full translate-x-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />

                <div className="flex flex-col md:flex-row gap-8 relative z-10">
                    {/* Icon/Logo */}
                    <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0F6CBD] text-4xl shadow-inner border border-slate-100">
                        <FaStore />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-3xl font-black text-[#1E293B] mb-2">{dealer.businessName}</h1>

                                <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                        <FaMapMarkerAlt className="text-slate-400" />
                                        {dealer.city}, {dealer.state}
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <FaCalendarAlt className="text-slate-400" />
                                        Joined {dealer.joinedAt ? new Date(dealer.joinedAt).toLocaleDateString() : 'Unknown'}
                                    </div>
                                </div>
                            </div>

                            {/* Verification Badge */}
                            <div className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1 rounded-full border border-green-100 text-xs font-black uppercase tracking-wider">
                                <FaCheckCircle /> Verified Partner
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Products</p>
                                <div className="flex items-center gap-2">
                                    <FaBoxOpen className="text-[#0F6CBD]" />
                                    <span className="text-xl font-black text-slate-800">{dealer.stats?.totalProducts || 0}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Rating</p>
                                <div className="flex items-center gap-2">
                                    <FaStar className="text-amber-400" />
                                    <span className="text-xl font-black text-slate-800">{dealer.stats?.averageRating ? dealer.stats.averageRating.toFixed(1) : 'N/A'}</span>
                                </div>
                            </div>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reviews</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl font-black text-slate-800">{dealer.stats?.reviewCount || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Additional Sections (Placeholder for future expansion) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center text-slate-400">
                <p className="text-sm font-bold uppercase tracking-widest">More detailed analytics and order history coming soon.</p>
            </div>
        </div>
    );
}
