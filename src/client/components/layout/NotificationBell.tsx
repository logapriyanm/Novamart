'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoNotificationsOutline, IoCheckmarkDoneOutline, IoTimeOutline, IoWalletOutline, IoShieldCheckmarkOutline, IoCubeOutline, IoPersonOutline } from 'react-icons/io5';
import { useNotifications } from '@/client/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationBellProps {
    variant?: 'default' | 'dashboard';
}

const NotificationBell = ({ variant = 'default' }: NotificationBellProps) => {
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
        const isDashboard = variant === 'dashboard';

        switch (type) {
            case 'ORDER': return <IoCubeOutline className={isDashboard ? "text-blue-600" : "text-blue-500"} />;
            case 'PAYMENT': return <IoWalletOutline className={isDashboard ? "text-emerald-600" : "text-green-500"} />;
            case 'SECURITY': return <IoShieldCheckmarkOutline className={isDashboard ? "text-rose-600" : "text-red-500"} />;
            case 'KYC': return <IoPersonOutline className={isDashboard ? "text-indigo-600" : "text-purple-500"} />;
            default: return <IoNotificationsOutline className={isDashboard ? "text-slate-400" : "text-gray-400"} />;
        }
    };

    const isDashboard = variant === 'dashboard';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={isDashboard
                    ? "w-10 h-10 rounded-[10px] bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all focus:outline-none relative"
                    : "flex flex-col items-center group gap-1 relative focus:outline-none"
                }
            >
                <div className="relative">
                    <IoNotificationsOutline className={isDashboard ? "w-5 h-5" : "w-6 h-6 text-foreground/40 group-hover:text-black transition-colors"} />
                    {unreadCount > 0 && (
                        <span className={isDashboard
                            ? "absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-slate-50 shadow-sm"
                            : "absolute -top-2 -right-2 bg-black text-background text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-background shadow-sm"
                        }>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>
                {!isDashboard && (
                    <span className="text-[10px] font-black text-foreground/60 group-hover:text-black transition-colors uppercase italic tracking-tighter">Alerts</span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`absolute right-0 mt-3 w-80 max-h-[480px] overflow-hidden ${isDashboard
                            ? "rounded-[10px] border border-slate-200 bg-white shadow-xl z-[100]"
                            : "rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl z-[100]"}`}
                    >
                        {/* Header */}
                        <div className={`flex items-center justify-between border-b px-4 py-3 ${isDashboard
                            ? "border-slate-100 bg-slate-50/50"
                            : "border-white/10 bg-white/5"}`}>
                            <h3 className={`text-sm font-semibold ${isDashboard ? "font-bold text-slate-800" : "text-white"}`}>Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className={`${isDashboard
                                        ? "text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 uppercase tracking-wide"
                                        : "text-xs text-blue-400 hover:text-blue-300"} transition-colors flex items-center gap-1`}
                                >
                                    <IoCheckmarkDoneOutline className={isDashboard ? "w-3 h-3" : ""} />
                                    Mark all read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className={`overflow-y-auto max-h-[400px] scrollbar-thin ${isDashboard ? "scrollbar-thumb-slate-200" : "scrollbar-thumb-white/10"}`}>
                            {loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className={`h-5 w-5 animate-spin rounded-full border-2 border-t-transparent ${isDashboard ? "border-indigo-500" : "border-blue-500"}`} />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    {isDashboard ? (
                                        <>
                                            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                                                <IoNotificationsOutline className="text-xl text-slate-300" />
                                            </div>
                                            <p className="text-sm font-medium text-slate-900">All caught up!</p>
                                            <p className="text-xs text-slate-500 mt-1">No new notifications to show.</p>
                                        </>
                                    ) : (
                                        <>
                                            <IoNotificationsOutline className="text-4xl text-white/10 mb-2" />
                                            <p className="text-sm text-gray-500">No notifications yet</p>
                                        </>
                                    )}
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.readAt && markAsRead(notification.id)}
                                        className={`group relative flex items-start gap-3 border-b px-4 py-3 transition-all cursor-pointer ${isDashboard
                                                ? `border-slate-50 hover:bg-slate-50 ${!notification.readAt ? 'bg-indigo-50/30' : ''}`
                                                : `border-white/5 hover:bg-white/5 ${!notification.readAt ? 'bg-blue-500/5' : ''}`
                                            }`}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            <div className={`flex h-8 w-8 items-center justify-center ${isDashboard
                                                    ? "rounded-[8px] bg-white border border-slate-100 shadow-sm"
                                                    : "rounded-lg bg-white/5 border border-white/5"
                                                }`}>
                                                {getIcon(notification.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className={`text-sm font-medium ${isDashboard
                                                        ? `${!notification.readAt ? 'text-slate-900 font-semibold' : 'text-slate-600'}`
                                                        : `${!notification.readAt ? 'text-white' : 'text-gray-400'}`
                                                    }`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.readAt && (
                                                    <span className={`h-1.5 w-1.5 rounded-full ${isDashboard ? "bg-indigo-500" : "bg-blue-500"}`} />
                                                )}
                                            </div>
                                            <p className={`text-xs line-clamp-2 leading-relaxed ${isDashboard ? "text-slate-500" : "text-gray-500"}`}>
                                                {notification.message}
                                            </p>
                                            <div className={`mt-1.5 flex items-center gap-1 text-[10px] ${isDashboard ? "text-slate-400 font-medium" : "text-gray-600"}`}>
                                                <IoTimeOutline />
                                                <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className={`border-t p-2 text-center ${isDashboard ? "border-slate-100 bg-slate-50/50" : "border-white/10 bg-white/5"}`}>
                            <button className={`text-[10px] uppercase tracking-wider font-semibold transition-colors ${isDashboard ? "text-slate-500 hover:text-slate-800 font-bold" : "text-gray-500 hover:text-white"
                                }`}>
                                {isDashboard ? "View History" : "View all notifications"}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
