'use client';

import React, { useState, useEffect } from 'react';
import {
    FaBell,
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationTriangle,
    FaBox,
    FaTag,
    FaArrowLeft,
    FaTrashAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

export default function SellerNotifications() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [filter, setFilter] = useState('ALL');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await apiClient.get<any>('/notifications');
            if (res.data?.success) {
                setNotifications(res.data.data);
            }
        } catch (error) {
            console.error('Failed to load notifications', error);
        } finally {
            setIsLoading(false);
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER': return FaBox;
            case 'NEGOTIATION': return FaTag;
            case 'SYSTEM': return FaInfoCircle;
            default: return FaBell;
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'ORDER': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'NEGOTIATION': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'SYSTEM': return 'bg-slate-50 text-slate-600 border-slate-100';
            default: return 'bg-slate-50 text-slate-600';
        }
    };

    const markAsRead = async (id: string) => {
        // Optimistic update
        setNotifications(prev => prev.map(n => n._id === id ? { ...n, readAt: new Date().toISOString() } : n));

        try {
            await apiClient.put(`/notifications/${id}/read`, {});
        } catch (error) {
            console.error('Failed to mark read', error);
        }
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-slate-900 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/seller" className="flex items-center gap-2 text-sm font-black text-[#067FF9] uppercase tracking-widest hover:translate-x-[-4px] transition-transform w-fit">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Dashboard
                </Link>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">Notification <span className="text-[#067FF9]">Center</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-1">Updates & Alerts</p>
                    </div>
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-[10px] border border-slate-100">
                        {['ALL', 'UNREAD', 'HIGH PRIORITY'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-2 rounded-[8px] text-xs font-black uppercase tracking-widest transition-all ${filter === f ? 'bg-white text-[#067FF9] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden min-h-[500px]">
                {notifications.length === 0 && !isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full p-20 opacity-50">
                        <FaBell className="w-12 h-12 text-slate-300 mb-4" />
                        <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Notifications</p>
                    </div>
                ) : (
                    <ul className="divide-y divide-slate-50">
                        <AnimatePresence>
                            {notifications
                                .filter(n => {
                                    if (filter === 'UNREAD') return !n.readAt;
                                    if (filter === 'HIGH PRIORITY') return n.priority === 'HIGH';
                                    return true;
                                })
                                .map((notification) => {
                                    const Icon = getIcon(notification.type);
                                    const isRead = !!notification.readAt;
                                    return (
                                        <motion.li
                                            key={notification._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            onClick={() => !isRead && markAsRead(notification._id)}
                                            className={`p-6 hover:bg-slate-50 transition-colors cursor-pointer group flex gap-6 ${isRead ? 'opacity-60' : 'bg-blue-50/10'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center shrink-0 border ${getColor(notification.type)}`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h3 className={`text-base font-bold text-slate-900 ${!isRead && 'text-[#067FF9]'}`}>
                                                        {notification.title}
                                                    </h3>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                                                        {new Date(notification.createdAt).toLocaleDateString()} • {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-3xl">
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-[4px] bg-slate-100 text-slate-500`}>
                                                        {notification.type}
                                                    </span>
                                                    {notification.priority === 'HIGH' && (
                                                        <span className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-[4px] bg-rose-50 text-rose-500 flex items-center gap-1">
                                                            <FaExclamationTriangle className="w-3 h-3" /> High Priority
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!isRead && (
                                                    <div className="w-3 h-3 rounded-full bg-[#067FF9] mr-4" title="Mark as Read" />
                                                )}
                                            </div>
                                        </motion.li>
                                    );
                                })}
                        </AnimatePresence>
                    </ul>
                )}
            </div>
        </div>
    );
}
