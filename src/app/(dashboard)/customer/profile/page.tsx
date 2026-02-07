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
import { Card } from '../../../../client/components/ui/DashboardUI';
import { useAuth } from '../../../../client/hooks/useAuth';
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
