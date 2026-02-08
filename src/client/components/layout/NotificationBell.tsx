'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoNotificationsOutline, IoCheckmarkDoneOutline, IoTimeOutline, IoWalletOutline, IoShieldCheckmarkOutline, IoCubeOutline, IoPersonOutline } from 'react-icons/io5';
import { useNotifications } from '@/client/context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell = () => {
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
            case 'ORDER': return <IoCubeOutline className="text-blue-500" />;
            case 'PAYMENT': return <IoWalletOutline className="text-green-500" />;
            case 'SECURITY': return <IoShieldCheckmarkOutline className="text-red-500" />;
            case 'KYC': return <IoPersonOutline className="text-purple-500" />;
            default: return <IoNotificationsOutline className="text-gray-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors focus:outline-none group bg-gray-900/50 rounded-lg border border-white/5"
            >
                <IoNotificationsOutline className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white ring-2 ring-black">
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
                        className="absolute right-0 mt-3 w-80 max-h-[480px] overflow-hidden rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl shadow-2xl z-[100]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-white/5">
                            <h3 className="text-sm font-semibold text-white">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={() => markAllAsRead()}
                                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1"
                                >
                                    <IoCheckmarkDoneOutline />
                                    Mark all as read
                                </button>
                            )}
                        </div>

                        {/* List */}
                        <div className="overflow-y-auto max-h-[400px] scrollbar-thin scrollbar-thumb-white/10">
                            {loading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
                                </div>
                            ) : notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                                    <IoNotificationsOutline className="text-4xl text-white/10 mb-2" />
                                    <p className="text-sm text-gray-500">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        onClick={() => !notification.readAt && markAsRead(notification.id)}
                                        className={`group relative flex items-start gap-3 border-b border-white/5 px-4 py-3 hover:bg-white/5 transition-all cursor-pointer ${!notification.readAt ? 'bg-blue-500/5' : ''}`}
                                    >
                                        <div className="mt-1 flex-shrink-0">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 border border-white/5">
                                                {getIcon(notification.type)}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <p className={`text-sm font-medium ${!notification.readAt ? 'text-white' : 'text-gray-400'}`}>
                                                    {notification.title}
                                                </p>
                                                {!notification.readAt && (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                                )}
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                                                {notification.message}
                                            </p>
                                            <div className="mt-1.5 flex items-center gap-1 text-[10px] text-gray-600">
                                                <IoTimeOutline />
                                                <span>{formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-white/10 bg-white/5 p-2 text-center">
                            <button className="text-[10px] text-gray-500 hover:text-white uppercase tracking-wider font-semibold">
                                View all notifications
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationBell;
