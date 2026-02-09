'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser,
    FaBox,
    FaHeadset,
    FaStar,
    FaComments,
    FaSignOutAlt,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaClock,
    FaChevronRight,
    FaEdit,
    FaHeart,
    FaBell,
    FaBars
} from 'react-icons/fa';
import { Card, WhiteCard, StatusBadge } from '@/client/components/features/dashboard/DashboardUI';
import { useAuth } from '@/client/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';

function ProfileContent() {
    const { user, logout, isAuthenticated } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, router]);

    // Update active tab when URL changes
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const [recentOrders] = useState([
        { id: 'ORD-882194', name: 'Quantum Z wireless', status: 'DELIVERED', date: 'Oct 14, 2023', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=200' },
        { id: 'ORD-773121', name: 'Ergo-Plus Chair', status: 'IN TRANSIT', date: 'Oct 18, 2023', image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?q=80&w=200' },
    ]);

    if (!isAuthenticated) return null;


    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <Card className="p-8 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[2.5rem]">
                        <div className="flex items-center justify-between mb-10">
                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Personal Information</h3>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                <FaEdit className="w-3 h-3" /> Edit Profile
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Full Name', value: user?.name, icon: FaUser },
                                { label: 'Email Address', value: user?.email, icon: FaBell },
                                { label: 'Phone Number', value: user?.phone || '+91 98765 43210', icon: FaComments },
                                { label: 'Primary Address', value: user?.address || '123 Enterprise Way, Tech City, 560001', icon: FaMapMarkerAlt },
                            ].map((field, idx) => (
                                <div key={idx} className="space-y-2 p-6 bg-slate-50/50 rounded-2xl border border-slate-100">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <field.icon className="w-3 h-3 text-blue-600" />
                                        {field.label}
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{field.value}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                );
            case 'orders':
                return (
                    <div className="space-y-4">
                        {recentOrders.map((order, idx) => (
                            <Card key={idx} className="p-6 border-none shadow-lg shadow-blue-600/5 bg-white rounded-3xl flex items-center gap-6 group hover:translate-x-2 transition-all duration-300 cursor-pointer">
                                <div className="w-20 h-20 bg-slate-50 rounded-2xl p-2 shrink-0 border border-slate-100">
                                    <img src={order.image} alt={order.name} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{order.id}</p>
                                    <h4 className="font-black text-slate-800 mb-2">{order.name}</h4>
                                    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                        {order.status}
                                    </span>
                                </div>
                                <div className="text-right pr-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Delivered</p>
                                    <p className="text-sm font-black text-slate-800">{order.date}</p>
                                </div>
                            </Card>
                        ))}
                    </div>
                );
            case 'complaints':
                return (
                    <Card className="p-12 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[2.5rem] text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <FaHeadset className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Need Assistance?</h3>
                            <p className="text-slate-400 text-sm font-bold mt-2">Our technical experts are available 24/7 to resolve your issues.</p>
                        </div>
                        <button className="px-10 py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all transform active:scale-95">
                            Open New Support Ticket
                        </button>
                    </Card>
                );
            case 'reviews':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2].map((i) => (
                            <Card key={i} className="p-6 border-none shadow-lg shadow-blue-600/5 bg-white rounded-3xl space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-slate-50 rounded-xl" />
                                    <div>
                                        <p className="text-xs font-black text-slate-800">Product Review #{i}</p>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className="w-2 h-2 text-amber-500" />)}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-500 font-bold leading-relaxed italic border-l-2 border-slate-100 pl-4">"Exceptional build quality and fast delivery. Very satisfied!"</p>
                            </Card>
                        ))}
                    </div>
                );
            case 'wishlist':
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="p-4 border-none shadow-lg shadow-blue-600/5 bg-white rounded-[2rem] group cursor-pointer overflow-hidden">
                                <div className="aspect-square bg-slate-50 rounded-2xl mb-4 relative overflow-hidden group-hover:bg-white transition-colors">
                                    <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                                        <FaHeart className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Tech</p>
                                <h5 className="text-[13px] font-black text-slate-800 truncate mb-2">Mechanical Keyboard V2</h5>
                                <p className="text-lg font-black text-slate-800">$129.00</p>
                            </Card>
                        ))}
                    </div>
                );
            case 'billing':
                return (
                    <div className="space-y-8">
                        {/* Header */}
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Addresses & Payment</h2>
                            <p className="text-slate-500 font-medium">Manage your shipping locations and payment methods.</p>
                        </div>

                        {/* Addresses Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-black text-slate-800">Shipping Addresses</h3>
                                    <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-500 uppercase tracking-widest">2 Saved</span>
                                </div>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                    + Add New Address
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Address Card 1 */}
                                <Card className="p-6 border-2 border-blue-600 shadow-xl shadow-blue-600/5 bg-white rounded-3xl relative overflow-hidden group">
                                    <div className="absolute top-4 right-4">
                                        <span className="px-2 py-1 bg-blue-50 text-blue-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Default</span>
                                    </div>
                                    <h4 className="font-black text-slate-800 text-lg mb-1">Alex Richards</h4>
                                    <p className="text-xs font-bold text-slate-400 mb-4">+1 (555) 0123 4567</p>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                                        742 Evergreen Terrace<br />
                                        Springfield, IL 62704<br />
                                        United States
                                    </p>
                                    <div className="flex gap-4 border-t border-slate-100 pt-4">
                                        <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Edit</button>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">Remove</button>
                                    </div>
                                </Card>

                                {/* Address Card 2 */}
                                <Card className="p-6 border border-slate-100 shadow-lg shadow-blue-600/5 bg-white rounded-3xl relative overflow-hidden group hover:border-slate-200 transition-colors">
                                    <h4 className="font-black text-slate-800 text-lg mb-1">NovaMart HQ (Work)</h4>
                                    <p className="text-xs font-bold text-slate-400 mb-4">+1 (555) 0987 6543</p>
                                    <p className="text-sm text-slate-600 font-medium leading-relaxed mb-6">
                                        1200 Innovation Drive, Suite 400<br />
                                        Palo Alto, CA 94304<br />
                                        United States
                                    </p>
                                    <div className="flex justify-between items-center border-t border-slate-100 pt-4">
                                        <div className="flex gap-4">
                                            <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">Edit</button>
                                            <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors">Remove</button>
                                        </div>
                                        <button className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors">Set as Default</button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Payment Methods Section */}
                        <div className="space-y-4 pt-8 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <h3 className="text-lg font-black text-slate-800">Payment Methods</h3>
                                    <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-black text-slate-500 uppercase tracking-widest">2 Saved</span>
                                </div>
                                <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                    + Add New Payment
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Visa Card (Dark) */}
                                <div className="p-6 bg-slate-900 rounded-3xl text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                                    <div className="flex justify-between items-start mb-8">
                                        <span className="px-2 py-1 bg-white/10 rounded backdrop-blur-md text-[10px] font-black uppercase tracking-widest">Visa</span>
                                        <span className="px-2 py-1 bg-blue-600 rounded text-[9px] font-black uppercase tracking-widest">Default</span>
                                    </div>
                                    <p className="text-xs font-black text-slate-400 mb-1 uppercase tracking-widest">Card Number</p>
                                    <p className="text-xl font-mono font-bold tracking-widest mb-6">•••• •••• •••• 4242</p>
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Card Holder</p>
                                            <p className="text-sm font-bold uppercase tracking-wide">Alex Richards</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Expires</p>
                                            <p className="text-sm font-bold">12/26</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Mastercard (Light) */}
                                <Card className="p-6 border border-slate-100 shadow-lg shadow-blue-600/5 bg-white rounded-3xl text-slate-800 relative">
                                    <div className="absolute top-6 right-6 flex gap-2">
                                        <button className="p-1 hover:bg-slate-50 rounded text-slate-400 hover:text-blue-600 transition-colors"><FaEdit className="w-3 h-3" /></button>
                                        <button className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-500 transition-colors"><FaEdit className="w-3 h-3 rotate-45" /></button> {/* Using generic icon for delete/trash if specific import missing, or reuse Edit/Trash icons */}
                                    </div>
                                    <div className="w-12 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded mb-6 opacity-80" /> {/* Simulating Mastercard Logo */}

                                    <h4 className="font-bold text-slate-800 mb-1">Corporate Spending Account</h4>
                                    <p className="text-sm text-slate-500 mb-4">Mastercard ending in 8896</p>

                                    <div className="flex items-center gap-3 text-xs font-medium">
                                        <span className="text-slate-400">Expires 09/25</span>
                                        <span className="text-slate-300">•</span>
                                        <button className="text-blue-600 font-bold hover:underline">Set as Default</button>
                                    </div>
                                </Card>
                            </div>
                        </div>

                        {/* Quick Add Address Form */}
                        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-blue-600/5">
                            <h3 className="text-lg font-black text-slate-800 mb-2">Quick-Add Address</h3>
                            <p className="text-slate-500 text-xs font-medium mb-8">Fill in the fields below to quickly save a new shipping location.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                                    <input type="text" placeholder="+1 (000) 000-0000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors" />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Street Address</label>
                                    <input type="text" placeholder="House number and street name" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">City</label>
                                    <input type="text" placeholder="e.g. Springfield" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">State / Province</label>
                                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors appearance-none">
                                        <option>Select state</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Zip / Postal Code</label>
                                    <input type="text" placeholder="00000" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-600 transition-colors" />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-8">
                                <input type="checkbox" id="default-address" className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600" />
                                <label htmlFor="default-address" className="text-xs font-bold text-slate-600 select-none cursor-pointer">Set as my default shipping address</label>
                            </div>

                            <div className="flex justify-end gap-4">
                                <button className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-50 transition-colors">
                                    Cancel
                                </button>
                                <button className="px-8 py-3 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                    Save Address
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'chats':
                return (
                    <Card className="p-12 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[2.5rem] text-center">
                        <FaComments className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">No Active Conversations</h3>
                        <p className="text-slate-400 text-sm font-bold mt-2">Start a chat with a dealer to discuss bulk orders.</p>
                    </Card>
                );
            default:
                return (
                    <Card className="p-12 text-center text-slate-400 font-bold">
                        Select a section from the sidebar to view details.
                    </Card>
                );
        }
    };

    return (
        <div className="min-h-screen bg-transparent">
            <main className="max-w-6xl mx-auto py-8 relative z-20">
                <div className="flex flex-col gap-8">
                    {/* Main Content Area - Full Width */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-[#10367D] uppercase tracking-[0.3em] animate-pulse">
                Decrypting Profile Data...
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
