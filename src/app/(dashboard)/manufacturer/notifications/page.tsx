'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaBell,
    FaCheckCircle,
    FaList,
    FaFilter,
    FaCheckDouble,
    FaCube,
    FaWallet,
    FaShieldAlt,
    FaUserCheck,
    FaInfoCircle
} from 'react-icons/fa';
import { useNotifications } from '@/client/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

export default function ManufacturerNotifications() {
    const { notifications, markAsRead, markAllAsRead, loading } = useNotifications();

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER': return <FaCube className="text-blue-500 w-5 h-5" />;
            case 'PAYMENT': return <FaWallet className="text-emerald-500 w-5 h-5" />;
            case 'SECURITY': return <FaShieldAlt className="text-rose-500 w-5 h-5" />;
            case 'KYC': return <FaUserCheck className="text-purple-500 w-5 h-5" />;
            default: return <FaBell className="text-slate-400 w-5 h-5" />;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'ORDER': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'PAYMENT': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'SECURITY': return 'bg-rose-50 text-rose-600 border-rose-100';
            case 'KYC': return 'bg-purple-50 text-purple-600 border-purple-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    }

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-slate-900">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black tracking-tight italic">System <span className="text-[#067FF9]">Notifications</span></h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">Real-time alerts & updates</p>
                </div>
                <button
                    onClick={() => markAllAsRead()}
                    className="px-8 py-4 bg-white border border-slate-100 text-slate-500 rounded-[10px] font-black text-xs uppercase tracking-widest shadow-sm hover:text-[#067FF9] hover:border-[#067FF9]/20 transition-all flex items-center gap-3"
                >
                    <FaCheckDouble className="w-4 h-4" />
                    Mark All Read
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                {/* Toolbar */}
                <div className="p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-[10px] border border-slate-100 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-sm font-black uppercase tracking-widest text-slate-500">Live Feed</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="p-4 bg-white border border-slate-100 text-slate-400 rounded-[10px] hover:text-[#067FF9] transition-colors shadow-sm">
                            <FaFilter className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* List */}
                <div className="p-6 md:p-10">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-10 h-10 border-4 border-[#067FF9]/10 border-t-[#067FF9] rounded-full animate-spin" />
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Updates...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                                <FaBell className="w-10 h-10" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-700">All Caught Up!</h3>
                                <p className="text-sm text-slate-400 font-medium mt-1">You have no new notifications at this time.</p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4 max-w-5xl mx-auto">
                            <AnimatePresence>
                                {notifications.map((notification) => (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        onClick={() => !notification.readAt && markAsRead(notification.id)}
                                        className={`group relative p-6 rounded-3xl border transition-all cursor-pointer flex gap-6 items-start
                                            ${!notification.readAt
                                                ? 'bg-blue-50/30 border-blue-100 hover:bg-blue-50/50'
                                                : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                                            }`}
                                    >
                                        <div className={`w-14 h-14 rounded-[10px] flex items-center justify-center shrink-0 border ${getTypeColor(notification.type)}`}>
                                            {getIcon(notification.type)}
                                        </div>

                                        <div className="flex-1 min-w-0 pt-1">
                                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                                                <h4 className={`text-base font-black ${!notification.readAt ? 'text-[#067FF9]' : 'text-slate-700'}`}>
                                                    {notification.title}
                                                </h4>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="text-sm font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1 rounded-[10px] border border-slate-100">
                                                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                    </span>
                                                    {!notification.readAt && (
                                                        <span className="w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-3xl">
                                                {notification.message}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
