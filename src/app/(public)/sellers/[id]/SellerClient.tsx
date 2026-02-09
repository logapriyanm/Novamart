'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dealerService } from '@/lib/api/services/dealer.service';
import { motion } from 'framer-motion';
import { FaStore, FaMapMarkerAlt, FaCalendarAlt, FaStar, FaBox, FaShieldAlt } from 'react-icons/fa';
import Link from 'next/link';

interface SellerClientProps {
    id: string;
    initialData?: any;
}

export default function SellerClient({ id, initialData }: SellerClientProps) {
    const [seller, setSeller] = useState<any>(initialData || null);
    const [isLoading, setIsLoading] = useState(!initialData);

    useEffect(() => {
        const fetchSeller = async () => {
            if (initialData) return;
            if (id) {
                try {
                    const data = await dealerService.getPublicProfile(id);
                    setSeller(data);
                } catch (error) {
                    console.error('Failed to fetch seller:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };
        fetchSeller();
    }, [id, initialData]);

    if (isLoading) {
        return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    if (!seller) {
        return <div className="min-h-screen pt-32 text-center">Seller not found</div>;
    }

    return (
        <div className="min-h-screen bg-slate-50 pt-28 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                                <FaStore size={40} />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
                                    {seller.businessName}
                                    <FaShieldAlt className="text-emerald-500" size={24} />
                                </h1>
                                <div className="flex flex-wrap gap-4 mt-2 text-slate-500">
                                    <div className="flex items-center gap-1">
                                        <FaMapMarkerAlt size={16} />
                                        <span>{seller.city}, {seller.state}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <FaCalendarAlt size={16} />
                                        <span>Joined {new Date(seller.joinedAt).getFullYear()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-8 border-l border-slate-100 pl-8">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900">{seller.stats.totalProducts}</div>
                                <div className="text-sm text-slate-500">Products</div>
                            </div>
                            <div className="text-center">
                                <div className="text-3xl font-bold text-slate-900 flex items-center gap-1">
                                    {seller.stats.averageRating.toFixed(1)} <FaStar className="text-amber-400 fill-amber-400" size={20} />
                                </div>
                                <div className="text-sm text-slate-500">{seller.stats.reviewCount} Reviews</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <FaBox className="text-primary" /> Active Listings
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {seller.inventory.map((item: any) => (
                        <Link href={`/products/${item.id}`} key={item.inventoryId} className="group">
                            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
                                <div className="aspect-square bg-slate-100 relative">
                                    {item.images?.[0] && (
                                        <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    )}
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h3>
                                    <div className="mt-2 flex items-center justify-between">
                                        <span className="text-lg font-bold text-slate-900">₹{parseFloat(item.price).toLocaleString()}</span>
                                        {item.stock < 5 && (
                                            <span className="text-xs text-red-500 font-medium">Only {item.stock} left</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
