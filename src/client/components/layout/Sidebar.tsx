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
    FaIndustry,
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
    FaDesktop,
    FaSearch,
    FaArrowRight as ArrowRight
} from 'react-icons/fa';

const adminMenuItems = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/admin' },
    { name: 'Verification', icon: FaShieldAlt, path: '/admin/verification' },
    { name: 'Users', icon: FaUsers, path: '/admin/users' },
    { name: 'Manufacturers', icon: FaIndustry, path: '/admin/manufacturers' },
    { name: 'Dealers', icon: DealersIcon, path: '/admin/dealers' },
    { name: 'Product Management', icon: ProductsIcon, path: '/admin/products' },
    { name: 'Orders', icon: LogisticsIcon, path: '/admin/orders' },
    { name: 'Finance', icon: WalletIcon, path: '/admin/finance' },
    { name: 'Disputes', icon: DisputesIcon, path: '/admin/disputes' },
    { name: 'Home CMS', icon: FaSearch, path: '/admin/cms' },
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
];

const manufacturerMenuItems = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/manufacturer' },
    { name: 'Products', icon: ProductsIcon, path: '/manufacturer/products' },
    { name: 'Dealer Requests', icon: FaUserCheck, path: '/manufacturer/dealers/requests' },
    { name: 'Negotiations', icon: FaHandshake, path: '/manufacturer/negotiations' },
    { name: 'Approved Dealers', icon: DealersIcon, path: '/manufacturer/dealers' },
    { name: 'Orders Overview', icon: LogisticsIcon, path: '/manufacturer/orders' },
    { name: 'Pricing Rules', icon: FaTag, path: '/manufacturer/pricing' },
    { name: 'Inventory Insights', icon: FaBox, path: '/manufacturer/inventory' },
    { name: 'Analytics', icon: FaChartBar, path: '/manufacturer/analytics' },
    { name: 'Profile & Compliance', icon: FaShieldAlt, path: '/manufacturer/profile' },
    { name: 'Notifications', icon: FaBell, path: '/manufacturer/notifications' },
];

const bottomMenuItems = [
    { name: 'Settings', icon: SettingsIcon, path: '/settings' },
    { name: 'Support', icon: SupportIcon, path: '/support' },
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
        const isDashboard = ['/admin', '/dealer', '/manufacturer', '/customer'].includes(item.path);

        // Specific match logic: An item is active if it's an exact match, 
        // OR if it's a prefix and NO other menu item is a more specific (longer) prefix.
        const isActive = pathname === item.path || (
            !isDashboard &&
            pathname?.startsWith(`${item.path}/`) &&
            !menuItems.some(other =>
                other.path !== item.path &&
                pathname.startsWith(other.path) &&
                other.path.length > item.path.length
            )
        );

        // Use role-specific settings if it's the settings item
        let finalPath = item.path;
        if (item.name === 'Settings') {
            finalPath = `/${role.toLowerCase()}/settings`;
        } else if (item.name === 'Support') {
            finalPath = `/${role.toLowerCase()}/support`;
        }

        return (
            <Link
                href={finalPath}
                onClick={onClose}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all group ${isActive
                    ? 'bg-black text-white'
                    : 'text-foreground/50 hover:bg-muted hover:text-foreground'
                    } ${isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
            >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-white' : 'text-foreground/40 group-hover:text-foreground/60'}`} />
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
                    x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1025 ? -300 : 0),
                    width: isCollapsed ? 80 : 288 // 5rem (80px) vs 18rem (288px)
                }}
                className={`fixed inset-y-0 left-0 bg-surface border-r border-border z-50 flex flex-col transition-all no-scrollbar`}
            >
                {/* Logo Section */}
                <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center p-4' : 'gap-3'}`}>
                    <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center p-1.5 shadow-sm flex-shrink-0 border border-foreground/10">
                        <img src="/assets/Novamart.png" alt="N" className="w-full h-full object-contain" />
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
                <nav className="flex-1 px-4 py-2 space-y-1 overflow-x-hidden overflow-y-auto no-scrollbar">
                    {/* Customer Profile Section (Refined) */}
                    {role === 'CUSTOMER' && !isCollapsed && (
                        <div className="mb-6 p-4 bg-muted/20 rounded-[10px] border border-border/50">
                            <div className="flex items-center gap-4 p-2">
                                <div className="w-12 h-12 bg-black rounded-[10px] flex items-center justify-center text-white font-black text-lg shadow-sm">
                                    {user?.name?.charAt(0) || 'R'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-sm font-bold text-foreground truncate">{user?.name || 'User'}</h3>
                                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                    </div>
                                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">
                                        {user?.role === 'CUSTOMER' ? 'Retail Partner' : `${user?.role} Access`}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 mt-2 px-2">
                                <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                                    <span>Account Status</span>
                                    <span className="text-emerald-600">Verified</span>
                                </div>
                                <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        className="h-full bg-emerald-500"
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

                {/* Bottom Navigation / Storage Widget */}
                <div className="p-4 space-y-1 bg-surface border-t border-border/10">
                    {role === 'DEALER' && !isCollapsed && (
                        <div className="mb-4 p-4 bg-primary/5 rounded-[10px] border border-primary/10">
                            <div className="justify-between items-center mb-2 hidden sm:flex">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Market Reputation</span>
                                <span className="text-[10px] font-bold text-primary">Top 10%</span>
                            </div>
                            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden mb-3 hidden sm:block">
                                <div className="h-full bg-primary w-[90%] rounded-full opacity-80"></div>
                            </div>
                            <Link href="/dealer/subscription" className="block text-center w-full py-2 bg-white border border-primary/10 text-primary text-[10px] font-bold rounded-[10px] hover:bg-primary hover:text-white transition-all shadow-sm">
                                View Subscription
                            </Link>
                        </div>
                    )}

                    {bottomMenuItems.map((item) => (
                        <NavItem key={item.name} item={item} />
                    ))}
                </div>
            </motion.aside>
        </>
    );
}
