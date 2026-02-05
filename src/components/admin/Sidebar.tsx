'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Users,
    Factory,
    Store,
    CheckCircle2,
    ShoppingCart,
    Wallet,
    AlertTriangle,
    ShieldAlert,
    Percent,
    Award,
    BarChart3,
    History,
    Settings,
    ShieldCheck,
    Grid
} from 'lucide-react';

const adminMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Manufacturers', icon: Factory, path: '/admin/manufacturers' },
    { name: 'Dealers', icon: Store, path: '/admin/dealers' },
    { name: 'Product Approvals', icon: CheckCircle2, path: '/admin/products' },
    { name: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Escrow & Payments', icon: Wallet, path: '/admin/escrow' },
    { name: 'Disputes', icon: AlertTriangle, path: '/admin/disputes' },
    { name: 'Fraud & Risk', icon: ShieldAlert, path: '/admin/fraud' },
    { name: 'Margin & Tax Rules', icon: Percent, path: '/admin/rules' },
    { name: 'Badges & Trust', icon: Award, path: '/admin/badges' },
    { name: 'Tracking & Analytics', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Audit Logs', icon: History, path: '/admin/audit' },
    { name: 'Platform Settings', icon: Settings, path: '/admin/settings' },
];

const dealerMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dealer/dashboard' },
    { name: 'Product Grid', icon: Grid, path: '/dealer/products' },
    { name: 'Orders & Retail', icon: ShoppingCart, path: '/dealer/orders' },
    { name: 'Settlements', icon: Wallet, path: '/dealer/settlements' },
    { name: 'Analytics', icon: BarChart3, path: '/dealer/analytics' },
    { name: 'Business Settings', icon: Settings, path: '/dealer/settings' },
];

const manufacturerMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/manufacturer/dashboard' },
    { name: 'Inventory Management', icon: Grid, path: '/manufacturer/inventory' },
    { name: 'Dealer Network', icon: Store, path: '/manufacturer/dealers' },
    { name: 'Production Logs', icon: History, path: '/manufacturer/logs' },
    { name: 'Settings', icon: Settings, path: '/manufacturer/settings' },
];

const customerMenuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/customer/dashboard' },
    { name: 'My Orders', icon: ShoppingCart, path: '/customer/orders' },
    { name: 'Wishlist', icon: Grid, path: '/customer/wishlist' }, // Placeholder icon
    { name: 'Profile Settings', icon: Settings, path: '/customer/settings' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    role?: 'ADMIN' | 'DEALER' | 'MANUFACTURER' | 'CUSTOMER';
}

const Sidebar = ({ isOpen, onClose, role = 'ADMIN' }: SidebarProps) => {
    const pathname = usePathname();

    const items = role === 'ADMIN' ? adminMenuItems :
        role === 'DEALER' ? dealerMenuItems :
            role === 'MANUFACTURER' ? manufacturerMenuItems :
                customerMenuItems;

    return (
        <AnimatePresence>
            {/* Mobile Overlay */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-[#2772A0]/20 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            <motion.aside
                initial={false}
                animate={{
                    x: (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : (isOpen ? 0 : -288),
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white/40 backdrop-blur-xl border-r border-[#2772A0]/10 flex flex-col transition-all overflow-hidden group
                    lg:relative lg:translate-x-0 lg:z-auto lg:flex
                `}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-[#2772A0]/20 bg-white">
                            <img src="/logo.png" alt="Novamart" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#2772A0]">Novamart</span>
                    </div>
                </div>

                <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1 custom-scrollbar">
                    {items.map((item) => {
                        const isActive = pathname === item.path;
                        return (
                            <Link key={item.name} href={item.path} onClick={() => { if (window.innerWidth < 1024) onClose(); }}>
                                <motion.div
                                    whileHover={{ x: 4 }}
                                    whileTap={{ scale: 0.98 }}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all group
                                        ${isActive
                                            ? 'bg-[#2772A0]/10 text-[#2772A0] border border-[#2772A0]/20 shadow-inner'
                                            : 'text-[#1E293B]/60 hover:bg-white/60 hover:text-[#2772A0]'}
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-[#2772A0]' : 'text-[#2772A0]/40 group-hover:text-[#2772A0]'}`} />
                                    <span className="text-sm font-bold">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="ml-auto w-1 h-4 bg-[#2772A0] rounded-full"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-[#2772A0]/10">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 border border-[#2772A0]/10">
                        <div className="w-10 h-10 rounded-full bg-[#2772A0] flex items-center justify-center text-xs font-bold text-[#CCDDEA]">
                            SA
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-bold text-[#1E293B]">Super Admin</span>
                            <span className="text-[10px] text-[#2772A0]/60 font-bold uppercase tracking-wider">Platform Owner</span>
                        </div>
                    </div>
                </div>
            </motion.aside>
        </AnimatePresence>
    );
};

export default Sidebar;
