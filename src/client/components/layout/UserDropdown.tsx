'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/client/hooks/useAuth';
import {
    FaUser,
    FaCog,
    FaSignOutAlt,
    FaShieldAlt,
    FaCheckCircle
} from 'react-icons/fa';
import { IoIosArrowDropdown } from 'react-icons/io';
import Link from 'next/link';

export default function UserDropdown() {
    const { user, logout } = useAuth();
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

    if (!user) return null;

    const getProfilePath = () => {
        switch (user.role) {
            case 'ADMIN': return '/admin/profile';
            case 'MANUFACTURER': return '/manufacturer/profile';
            case 'SELLER': return '/seller/profile';
            default: return '/customer/profile';
        }
    };

    const getSettingsPath = () => {
        switch (user.role) {
            case 'ADMIN': return '/admin/settings';
            case 'MANUFACTURER': return '/manufacturer/settings'; // Assuming standard path
            case 'SELLER': return '/seller/settings';
            default: return '/customer/settings';
        }
    };

    return (
        <div
            className="relative"
            ref={dropdownRef}
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <button
                className="flex items-center gap-3 pl-4 border-l border-foreground/5 group hover:opacity-80 transition-all focus:outline-none py-2"
            >
                <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-foreground leading-none flex items-center justify-end gap-1.5 slice">
                        {user.name}
                        {user.status === 'ACTIVE' && <FaCheckCircle className="w-3 h-3 text-emerald-500" />}
                    </p>
                    <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest mt-1 italic">
                        {user.role} Access
                    </p>
                </div>
                <div className="relative w-10 h-10  rounded-full  flex items-center justify-center overflow-hidden border  ">
                    {user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-black text-lg">
                            {user.name?.charAt(0) || 'U'}
                        </div>
                    )}
                </div>
                <IoIosArrowDropdown className={`w-3 h-3 text-foreground/20 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-0 pt-3 w-56 z-[100]"
                    >
                        <div className="bg-surface border border-foreground/5 rounded-[10px] shadow-2xl overflow-hidden">
                            <div className="p-4 border-b border-foreground/5 bg-background/50">
                                <p className="text-xs font-black text-foreground uppercase tracking-widest leading-none mb-1">Signed in as</p>
                                <p className="text-sm font-bold text-foreground truncate">{user.email}</p>
                            </div>

                            <div className="p-2">
                                <Link
                                    href={getProfilePath()}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-foreground/60 hover:text-black hover:bg-foreground/5 rounded-[8px] transition-all group"
                                >
                                    <FaUser className="w-4 h-4 transition-colors group-hover:text-primary" />
                                    <span>My Profile</span>
                                </Link>
                                <Link
                                    href={getSettingsPath()}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-foreground/60 hover:text-black hover:bg-foreground/5 rounded-[8px] transition-all group"
                                >
                                    <FaCog className="w-4 h-4 transition-colors group-hover:text-primary" />
                                    <span>Settings</span>
                                </Link>
                                {user.role === 'ADMIN' && (
                                    <Link
                                        href="/admin/security"
                                        onClick={() => setIsOpen(false)}
                                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-foreground/60 hover:text-black hover:bg-foreground/5 rounded-[8px] transition-all group"
                                    >
                                        <FaShieldAlt className="w-4 h-4 transition-colors group-hover:text-primary" />
                                        <span>Security</span>
                                    </Link>
                                )}
                            </div>

                            <div className="p-2 border-t border-foreground/5 bg-background/20">
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-bold text-rose-500 hover:bg-rose-500/5 rounded-[8px] transition-all"
                                >
                                    <FaSignOutAlt className="w-4 h-4" />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
