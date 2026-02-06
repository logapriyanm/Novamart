'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaThLarge as LayoutDashboard,
    FaUsers as Users,
    FaIndustry as Factory,
    FaStore as Store,
    FaCheckCircle as CheckCircle2,
    FaShoppingCart as ShoppingCart,
    FaWallet as Wallet,
    FaExclamationTriangle as AlertTriangle,
    FaShieldAlt as ShieldAlert,
    FaPercentage as Percent,
    FaAward as Award,
    FaChartBar as BarChart3,
    FaHistory as History,
    FaCog as Settings,
    FaTh as Grid
} from 'react-icons/fa';

const adminMenuItems = [
    { name: 'Mission Control', icon: LayoutDashboard, path: '/admin' },
    { name: 'Account Entities', icon: Users, path: '/admin/users' },
    { name: 'Manufacturer Gates', icon: Factory, path: '/admin/manufacturers' },
    { name: 'Dealer Onboarding', icon: Store, path: '/admin/dealers' },
    { name: 'Inventory Queue', icon: CheckCircle2, path: '/admin/products' },
    { name: 'Order Oversight', icon: ShoppingCart, path: '/admin/orders' },
    { name: 'Escrow & Treasury', icon: Wallet, path: '/admin/escrow' },
    { name: 'Conflict Tribunal', icon: AlertTriangle, path: '/admin/disputes' },
    { name: 'Anomaly Detection', icon: ShieldAlert, path: '/admin/fraud' },
    { name: 'Economic Rules', icon: Percent, path: '/admin/rules' },
    { name: 'Trust Signals', icon: Award, path: '/admin/badges' },
    { name: 'Review Audit', icon: Grid, path: '/admin/reviews' },
    { name: 'Strategic Intel', icon: BarChart3, path: '/admin/analytics' },
    { name: 'Audit Persistence', icon: History, path: '/admin/audit' },
    { name: 'Terminal Config', icon: Settings, path: '/admin/settings' },
];

const dealerMenuItems = [
    { name: 'Command Center', icon: LayoutDashboard, path: '/dealer' },
    { name: 'Supply Sourcing', icon: Factory, path: '/dealer/source' },
    { name: 'Owned Inventory', icon: Grid, path: '/dealer/inventory' },
    { name: 'Retail Pipeline', icon: ShoppingCart, path: '/dealer/orders' },
    { name: 'Support Desk', icon: Users, path: '/dealer/support' },
    { name: 'Sales Intel', icon: BarChart3, path: '/dealer/analytics' },
    { name: 'Compliance Portal', icon: Settings, path: '/dealer/settings' },
];

const manufacturerMenuItems = [
    { name: 'Command Center', icon: LayoutDashboard, path: '/manufacturer' },
    { name: 'Bulk Catalog', icon: Grid, path: '/manufacturer/inventory' },
    { name: 'Dealer Network', icon: Store, path: '/manufacturer/dealers' },
    { name: 'Supply Requests', icon: ShoppingCart, path: '/manufacturer/orders' },
    { name: 'Strategic Intel', icon: BarChart3, path: '/manufacturer/analytics' },
    { name: 'Compliance Portal', icon: Settings, path: '/manufacturer/settings' },
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
                    className="fixed inset-0 bg-[#10367D]/20 backdrop-blur-sm z-40 lg:hidden"
                />
            )}

            <motion.aside
                initial={false}
                animate={{
                    x: (typeof window !== 'undefined' && window.innerWidth >= 1024) ? 0 : (isOpen ? 0 : -288),
                }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className={`
                    fixed inset-y-0 left-0 z-50 w-72 bg-white/40 backdrop-blur-xl border-r border-[#10367D]/10 flex flex-col transition-all overflow-hidden group
                    lg:relative lg:translate-x-0 lg:z-auto lg:flex
                `}
            >
                <div className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-[#10367D]/20 bg-white">
                            <img src="/logo.png" alt="Novamart" className="w-full h-full object-cover" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[#10367D]">Novamart</span>
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
                                            ? 'bg-[#10367D]/10 text-[#10367D] border border-[#10367D]/20 shadow-inner'
                                            : 'text-[#1E293B]/60 hover:bg-white/60 hover:text-[#10367D]'}
                                    `}
                                >
                                    <item.icon className={`w-5 h-5 ${isActive ? 'text-[#10367D]' : 'text-[#10367D]/40 group-hover:text-[#10367D]'}`} />
                                    <span className="text-sm font-bold">{item.name}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="sidebar-active"
                                            className="ml-auto w-1 h-4 bg-[#10367D] rounded-full"
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-6 border-t border-[#10367D]/10">
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/40 border border-[#10367D]/10">
                        <div className="w-10 h-10 rounded-full bg-[#10367D] flex items-center justify-center text-[10px] font-black text-white">
                            {role === 'ADMIN' ? 'AD' : role === 'MANUFACTURER' ? 'MF' : role === 'DEALER' ? 'DL' : 'CU'}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-black text-[#1E293B]">
                                {role === 'ADMIN' ? 'Platform Governor' : role === 'MANUFACTURER' ? 'Supply Authority' : role === 'DEALER' ? 'Regional Partner' : 'Consumer Account'}
                            </span>
                            <span className="text-[10px] text-[#10367D]/60 font-black uppercase tracking-wider">
                                {role === 'ADMIN' ? 'Governance Master' : 'Verified Identity'}
                            </span>
                        </div>
                    </div>
                </div>
            </motion.aside>
        </AnimatePresence>
    );
};

export default Sidebar;

