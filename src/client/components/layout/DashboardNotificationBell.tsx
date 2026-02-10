'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoNotificationsOutline, IoCheckmarkDoneOutline, IoTimeOutline, IoWalletOutline, IoShieldCheckmarkOutline, IoCubeOutline, IoPersonOutline } from 'react-icons/io5';
import { useNotifications } from '@/client/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const DashboardNotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getIcon = (type: string) => {
        switch (type) {
            case 'ORDER': return <IoCubeOutline className="text-blue-600" />;
            case 'PAYMENT': return <IoWalletOutline className="text-emerald-600" />;
            case 'SECURITY': return <IoShieldCheckmarkOutline className="text-rose-600" />;
            case 'KYC': return <IoPersonOutline className="text-indigo-600" />;
            default: return <IoNotificationsOutline className="text-slate-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 rounded-[10px] bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all focus:outline-none relative"
            >
                <IoNotificationsOutline className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-50 shadow-sm">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-3 w-80 max-h-[480px] overflow-hidden rounded-[10px] border border-slate-200 bg-white shadow-xl z-[100]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
                            <h3 className="text-sm font-bold text-slate-800">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 uppercase tracking-wide"
                                >
                                    <IoCheckmarkDoneOutline className="w-3 h-3" />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-slate-200">
                            {loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                        <IoNotificationsOutline className="text-xl text-slate-300" />
                                    </div>
                                    <p className="text-sm font-medium text-slate-900">All caught up!</p>
                                    <p className="text-xs text-slate-500 mt-1">No new notifications to show.</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.readAt && markAsRead(notification.id)}
                                        className={`group relative flex items-start gap-3 border-b border-slate-50 px-4 py-3 hover:bg-slate-50 transition-all cursor-pointer ${!notification.readAt ? 'bg-indigo-50/30' : ''}`}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-[8px] bg-white border border-slate-100 shadow-sm">
                                                {getIcon(notification.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between mb-0.5 gap-2">
                                                <p className={`text-sm font-semibold ${!notification.readAt ? 'text-slate-900' : 'text-slate-600'}`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.readAt && (
                                                    <span className="h-2 w-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            <div className="mt-2 flex items-center gap-1 text-[10px] font-medium text-slate-400">
                                                <IoTimeOutline />
                                                <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-slate-100 bg-slate-50/50 p-2 text-center">
                            <button className="text-[10px] text-slate-500 hover:text-slate-800 uppercase tracking-widest font-bold transition-colors">
                                View History
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardNotificationBell;
