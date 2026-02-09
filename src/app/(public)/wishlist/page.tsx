'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaHeart, FaBookmark, FaPlus, FaFilter, FaLaptopHouse, FaUtensils, FaTools, FaThLarge } from 'react-icons/fa';
import WishlistCard from '@/client/components/features/wishlist/WishlistCard';
import WishlistSidebar from '@/client/components/features/wishlist/WishlistSidebar';
import { wishlistService } from '@/lib/api/services/wishlist.service';
import { useEffect } from 'react';
import RecentlySaved from '@/client/components/features/wishlist/RecentlySaved';



export default function WishlistPage() {
    const [activeTab, setActiveTab] = useState<'wishlist' | 'saved'>('wishlist');
    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const data = await wishlistService.getWishlist();
                // Map to UI format if needed
                const adapted = data.map(p => ({
                    id: p.id,
                    name: p.name,
                    brand: p.brand || 'NovaMart',
                    price: p.basePrice,
                    image: p.images?.[0] || 'https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=400',
                    status: (p.inventory?.[0]?.stock < 10 ? 'Low Stock' : undefined) as any
                }));
                setItems(adapted);
            } catch (error) {
                console.error('Failed to fetch wishlist:', error);
                // Fallback to mock for UI demonstration if needed or just empty
                // setItems(wishlistItems); 
            } finally {
                setIsLoading(false);
            }
        };

        fetchWishlist();
    }, []);

    const displayItems = items;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-8">

                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-black tracking-tight mb-2 italic uppercase">My Collections</h1>
                    <p className="text-foreground/40 text-[10px] font-bold uppercase tracking-[0.2em]">Organize your procurement lists and manage saved items for future orders.</p>
                </div>

                {/* Main Layout */}
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Content Area */}
                    <div className="flex-1">

                        {/* Tabs */}
                        <div className="flex items-center gap-8 border-b border-slate-200 mb-8">
                            <button
                                onClick={() => setActiveTab('wishlist')}
                                className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'wishlist' ? 'border-black text-black' : 'border-transparent text-foreground/20 hover:text-foreground/40'}`}
                            >
                                <FaHeart className={activeTab === 'wishlist' ? 'text-black' : 'text-foreground/10'} />
                                My Wishlist
                            </button>
                            <button
                                onClick={() => setActiveTab('saved')}
                                className={`flex items-center gap-2 pb-4 text-[11px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'saved' ? 'border-black text-black' : 'border-transparent text-foreground/20 hover:text-foreground/40'}`}
                            >
                                <FaBookmark className={activeTab === 'saved' ? 'text-black' : 'text-foreground/10'} />
                                Saved for Later (12)
                            </button>
                        </div>

                        {/* Filters Toolbar */}
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <button className="px-4 py-2 bg-black text-white rounded-[10px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-black/20">
                                <FaThLarge /> All Items
                            </button>
                            <button className="px-4 py-2 bg-white text-foreground/40 border border-foreground/5 hover:border-black/20 hover:text-black rounded-[10px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                                <FaLaptopHouse /> Home Office
                            </button>
                            <button className="px-4 py-2 bg-white text-foreground/40 border border-foreground/5 hover:border-black/20 hover:text-black rounded-[10px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                                <FaUtensils /> Kitchen Upgrades
                            </button>
                            <button className="px-4 py-2 bg-white text-foreground/40 border border-foreground/5 hover:border-black/20 hover:text-black rounded-[10px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-colors">
                                <FaTools /> Industrial Gear
                            </button>
                            <button className="ml-auto text-blue-600 font-bold text-xs flex items-center gap-1 hover:underline">
                                <FaPlus /> Create New List
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {isLoading ? (
                                <div className="col-span-full py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                    Loading your collection...
                                </div>
                            ) : displayItems.map((item) => (
                                <div key={item.id} className="h-[420px]"> {/* Fixed height for alignment */}
                                    <WishlistCard {...item} />
                                </div>
                            ))}
                        </div>

                        {/* Recentely Saved Section */}
                        <RecentlySaved onMoveToCart={(id) => {
                            // TODO: Implement move to cart logic
                        }} />

                    </div>

                    {/* Right Sidebar */}
                    <WishlistSidebar />
                </div>
            </div>
        </div>
    );
}
