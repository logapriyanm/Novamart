'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/client/hooks/useAuth';
import {
    FaThLarge as DashboardIcon,
    FaUsers as DealersIcon,
    FaUsers,
    FaCube as ProductsIcon,
    FaGavel as DisputesIcon,
    FaTruck as LogisticsIcon,
    FaCog as SettingsIcon,
    FaHeadset as SupportIcon,
    FaSignOutAlt as LogoutIcon,
    FaRocket as LogoIcon,
    FaHeart as WishlistIcon,
    FaCreditCard as PaymentsIcon,
    FaMapMarkedAlt as AddressesIcon,
    FaUserCheck,
    FaTag,
    FaBox,
    FaChartBar,
    FaShieldAlt,
    FaBell,
    FaStar as ReviewsIcon,
    FaCheckCircle as CheckCircle,
    FaWallet as WalletIcon,
    FaCrown,
    FaHandshake,
    FaArrowRight as ArrowRight
} from 'react-icons/fa';

const adminMenuItems = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/admin' },
    { name: 'Verification', icon: FaShieldAlt, path: '/admin/verification' },
    { name: 'Users', icon: FaUsers, path: '/admin/users' },
    { name: 'Dealers', icon: DealersIcon, path: '/admin/dealers' },
    { name: 'Products', icon: ProductsIcon, path: '/admin/products' },
    { name: 'Orders', icon: LogisticsIcon, path: '/admin/orders' },
    { name: 'Finance', icon: WalletIcon, path: '/admin/finance' },
    { name: 'Disputes', icon: DisputesIcon, path: '/admin/disputes' },
    { name: 'Settings', icon: SettingsIcon, path: '/admin/settings' },
];

const customerMenuItems = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/customer' },
    { name: 'My Orders', icon: LogisticsIcon, path: '/customer/orders' },
    { name: 'Wishlist', icon: WishlistIcon, path: '/customer/wishlist' },
    { name: 'Addresses & Billing', icon: WalletIcon, path: '/customer/profile?tab=billing' },
    { name: 'My Reviews', icon: ReviewsIcon, path: '/customer/reviews' },
];

const dealerMenuItems = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/dealer' },
    { name: 'Marketplace', icon: FaBox, path: '/dealer/marketplace' },
    { name: 'Orders', icon: LogisticsIcon, path: '/dealer/orders' },
    { name: 'Negotiations', icon: FaHandshake, path: '/dealer/negotiations' },
    { name: 'Subscription', icon: FaCrown, path: '/dealer/subscription' },
    { name: 'Finance', icon: WalletIcon, path: '/dealer/finance' },
    { name: 'Settings', icon: SettingsIcon, path: '/dealer/settings' },
];

const manufacturerMenuItems = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/manufacturer' },
    { name: 'Products', icon: ProductsIcon, path: '/manufacturer/products' },
    { name: 'Dealer Requests', icon: FaUserCheck, path: '/manufacturer/dealers/requests' },
    { name: 'Approved Dealers', icon: DealersIcon, path: '/manufacturer/dealers/approved' },
    { name: 'Orders Overview', icon: LogisticsIcon, path: '/manufacturer/orders' },
    { name: 'Pricing Rules', icon: FaTag, path: '/manufacturer/pricing' },
    { name: 'Inventory Insights', icon: FaBox, path: '/manufacturer/inventory' },
    { name: 'Analytics', icon: FaChartBar, path: '/manufacturer/analytics' },
    { name: 'Profile & Compliance', icon: FaShieldAlt, path: '/manufacturer/profile' },
    { name: 'Notifications', icon: FaBell, path: '/manufacturer/notifications' },
    { name: 'Support', icon: SupportIcon, path: '/manufacturer/support' },
];

const bottomMenuItems = [
    // { name: 'Settings', icon: SettingsIcon, path: '/settings' }, // Image 1 doesn't show Settings in main list, maybe bottom?
    // Image 1 shows "Workspace" label above main items.
    // Keeping standard footer items for now but customized per role if needed.
    { name: 'Settings', icon: SettingsIcon, path: '/settings' }, // Generic settings path, might need role prefix
    { name: 'Support', icon: SupportIcon, path: '/support' },
    { name: 'Logout', icon: LogoutIcon, path: '/auth/logout' },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    role?: 'ADMIN' | 'CUSTOMER' | 'DEALER' | 'MANUFACTURER';
    isCollapsed?: boolean;
}

export default function Sidebar({ isOpen, onClose, role = 'ADMIN', isCollapsed = false }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();

    // Update menu items based on Role. 
    const menuItems = role === 'ADMIN' ? adminMenuItems :
        role === 'DEALER' ? dealerMenuItems :
            role === 'MANUFACTURER' ? manufacturerMenuItems :
                customerMenuItems;

    const NavItem = ({ item }: { item: any }) => {
        const isActive = pathname === item.path;
        const isLogout = item.name === 'Logout';

        if (isLogout) {
            return (
                <button
                    onClick={() => {
                        logout();
                        onClose();
                    }}
                    title={isCollapsed ? item.name : ''}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group text-foreground/50 hover:bg-rose-500/10 hover:text-rose-500 ${isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : 'w-full'}`}
                >
                    <item.icon className={`w-5 h-5 flex-shrink-0 text-foreground/40 group-hover:text-rose-500`} />
                    {!isCollapsed && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{item.name}</span>}
                </button>
            );
        }

        return (
            <Link
                href={item.path}
                onClick={onClose}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${isActive
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20' // Image 1 active state is blue bg
                    : 'text-foreground/50 hover:bg-muted hover:text-foreground'
                    } ${isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
            >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-primary-foreground' : 'text-foreground/40 group-hover:text-foreground/60'}`} />
                {!isCollapsed && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{item.name}</span>}
            </Link>
        );
    };

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -300 : 0),
                    width: isCollapsed ? 80 : 288 // 5rem (80px) vs 18rem (288px)
                }}
                className={`fixed inset-y-0 left-0 bg-surface border-r border-border z-50 flex flex-col transition-all lg:sticky overflow-hidden h-screen`}
            >
                {/* Logo Section */}
                <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center p-4' : 'gap-3'}`}>
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-xl shadow-primary/10 flex-shrink-0 border border-foreground/[0.03]">
                        <img src="/logo.png" alt="N" className="w-full h-full object-contain" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden whitespace-nowrap flex flex-col">
                            <h1 className="text-lg font-black text-foreground tracking-tighter leading-none">NovaMart</h1>
                            <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] mt-0.5">Enterprise Portal</span>
                        </div>
                    )}
                </div>

                {/* Workspace Label */}
                {!isCollapsed && role === 'DEALER' && (
                    <div className="px-6 py-2">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Workspace</p>
                    </div>
                )}

                {/* Primary Navigation */}
                <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
                    {/* Customer Profile Section (Keep existing logic for Customer role) */}
                    {role === 'CUSTOMER' && !isCollapsed && (
                        <div className="mb-6 p-4 bg-muted/30 rounded-3xl border border-border shadow-sm">
                            <div className="flex items-center gap-4 p-2">
                                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-lg shadow-lg shadow-primary/20">
                                    {user?.name?.charAt(0) || 'R'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-sm font-black text-foreground truncate">{user?.name || 'User'}</h3>
                                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                    </div>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                        {user?.role === 'CUSTOMER' ? 'Retail Partner' : `${user?.role} Access`}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                                    <span className="text-muted-foreground">Account Status</span>
                                    <span className="text-primary">{user?.status === 'ACTIVE' ? 'Verified' : 'Pending'}</span>
                                </div>
                                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: user?.status === 'ACTIVE' ? '100%' : '50%' }}
                                        className="h-full bg-primary"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1">
                        {menuItems.map((item) => (
                            <NavItem key={item.path} item={item} />
                        ))}
                    </div>
                </nav>

                {/* Bottom Navigation / Storage Widget (Image 1) */}
                <div className="p-4 space-y-1">
                    {/* Image 1 shows "Used Storage" widget at bottom for Dealer */}
                    {role === 'DEALER' && !isCollapsed && (
                        <div className="mt-4 mb-4 p-4 bg-muted/20 rounded-2xl border border-border/50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-bold text-muted-foreground">Platform Activity</span>
                                <span className="text-[10px] font-bold text-foreground">Active</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-3">
                                <div className="h-full bg-primary w-full rounded-full opacity-50"></div>
                            </div>
                            <Link href="/dealer/subscription" className="block text-center w-full py-2 bg-background border border-border text-foreground text-[10px] font-bold rounded-lg hover:bg-muted transition-colors">
                                View Subscription
                            </Link>
                        </div>
                    )}

                    {bottomMenuItems.map((item) => (
                        <NavItem key={item.path} item={item} />
                    ))}
                </div>
            </motion.aside>
        </>
    );
}
