'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/client/hooks/useAuth';
import { AiOutlineProduct as ProductsIcon } from "react-icons/ai";
import {
    FaThLarge as DashboardIcon,
    FaUsers as SellersIcon,
    FaUsers,
    FaIndustry,
    FaClock,
    FaGavel as DisputesIcon,
    FaTruck as LogisticsIcon,
    FaCog as SettingsIcon,
    FaHeadset as SupportIcon,
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
    FaArrowRight as ArrowRight,
    FaChevronDown,
    FaChevronRight,
    FaClipboardList,
    FaExclamationTriangle,
    FaFileAlt,
    FaGlobe,
    FaEnvelope,
    FaUserShield,
    FaPlusCircle,
    FaLayerGroup,
    FaProjectDiagram,
    FaWarehouse,
    FaStream,
    FaTasks,
    FaChartLine,
    FaUserCog,
    FaObjectGroup,
    FaStore,
    FaCartPlus,
    FaCubes,
    FaExchangeAlt,
    FaFilter,
    FaFileExport,
    FaBriefcase,
    FaUserTie,
    FaComments,
    FaClipboardCheck,
    FaNetworkWired,
    FaTimes,
    FaBars,
    FaEye,
    FaAward,
    FaBalanceScale,
    FaMoneyCheckAlt,
    FaSlidersH,
    FaArrowsAltH,
} from 'react-icons/fa';

// --- Types ---
interface MenuItem {
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    path: string;
}

interface MenuGroup {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    items: MenuItem[];
}

// =============================================================================
// ADMIN MENU (23 pages → 6 groups)
// =============================================================================
const adminMenuGroups: MenuGroup[] = [
    {
        label: 'Overview',
        icon: DashboardIcon,
        items: [
            { name: 'Dashboard', icon: DashboardIcon, path: '/admin' },
            { name: 'Analytics', icon: FaChartBar, path: '/admin/analytics' },
            { name: 'Product Analytics', icon: FaChartLine, path: '/admin/analytics/products' },
        ],
    },
    {
        label: 'User & Role Management',
        icon: FaUsers,
        items: [
            { name: 'All Users', icon: FaUsers, path: '/admin/users' },
            { name: 'Manufacturers', icon: FaIndustry, path: '/admin/manufacturers' },
            { name: 'Sellers', icon: SellersIcon, path: '/admin/dealers' },
            { name: 'Verification', icon: FaShieldAlt, path: '/admin/verification' },
            { name: 'Badges', icon: FaAward, path: '/admin/badges' },
        ],
    },
    {
        label: 'Commerce Control',
        icon: FaStore,
        items: [
            { name: 'Products', icon: ProductsIcon, path: '/admin/products' },
            { name: 'Orders', icon: LogisticsIcon, path: '/admin/orders' },
            { name: 'Escrow', icon: FaMoneyCheckAlt, path: '/admin/escrow' },
            { name: 'Disputes', icon: DisputesIcon, path: '/admin/disputes' },
            { name: 'Escalations', icon: FaExclamationTriangle, path: '/admin/escalations' },
            { name: 'Finance', icon: WalletIcon, path: '/admin/finance' },
            { name: 'Reviews', icon: ReviewsIcon, path: '/admin/reviews' },
        ],
    },
    {
        label: 'Governance & Security',
        icon: FaUserShield,
        items: [
            { name: 'Audit Log', icon: FaClipboardList, path: '/admin/audit' },
            { name: 'Rules', icon: FaBalanceScale, path: '/admin/rules' },
            { name: 'Fraud Detection', icon: FaExclamationTriangle, path: '/admin/fraud' },
            { name: 'Messages', icon: FaEnvelope, path: '/admin/messages' },
        ],
    },
    {
        label: 'CMS & Content',
        icon: FaGlobe,
        items: [
            { name: 'Home CMS', icon: FaDesktop, path: '/admin/cms' },
        ],
    },
    {
        label: 'System',
        icon: SettingsIcon,
        items: [
            { name: 'Settings', icon: SettingsIcon, path: '/admin/settings' },
            { name: 'Profile', icon: FaUserCog, path: '/admin/profile' },
        ],
    },
];

// =============================================================================
// CUSTOMER MENU (kept flat — already complete at 5 items)
// =============================================================================
const customerMenuItems: MenuItem[] = [
    { name: 'Dashboard', icon: DashboardIcon, path: '/customer' },
    { name: 'My Orders', icon: LogisticsIcon, path: '/customer/orders' },
    { name: 'Wishlist', icon: WishlistIcon, path: '/customer/wishlist' },
    { name: 'Addresses & Billing', icon: WalletIcon, path: '/customer/profile?tab=billing' },
    { name: 'My Reviews', icon: ReviewsIcon, path: '/customer/reviews' },
];

// =============================================================================
// SELLER MENU (24 pages → 5 groups)
// =============================================================================
const sellerMenuGroups: MenuGroup[] = [
    {
        label: 'Sourcing & Network',
        icon: FaNetworkWired,
        items: [
            { name: 'Discover Manufacturers', icon: FaSearch, path: '/seller/discovery' },
            { name: 'My Network', icon: FaNetworkWired, path: '/seller/network' },
            { name: 'Sourced Products', icon: FaBox, path: '/seller/sourced-products' },
            { name: 'Negotiations', icon: FaHandshake, path: '/seller/negotiations' },
        ],
    },
    {
        label: 'Retail Operations',
        icon: FaStore,
        items: [
            { name: 'Retail Products', icon: ProductsIcon, path: '/seller/products' },
            { name: 'Inventory', icon: FaWarehouse, path: '/seller/inventory' },
            { name: 'Customer Orders', icon: LogisticsIcon, path: '/seller/orders' },
        ],
    },
    {
        label: 'Finance & Performance',
        icon: FaChartBar,
        items: [
            { name: 'Payments & Earnings', icon: WalletIcon, path: '/seller/payments' },
            { name: 'Analytics', icon: FaChartLine, path: '/seller/analytics' },
            { name: 'Reviews & Ratings', icon: ReviewsIcon, path: '/seller/reviews' },
        ],
    },
    {
        label: 'Account & Communication',
        icon: FaUserCog,
        items: [
            { name: 'Notifications', icon: FaBell, path: '/seller/notifications' },
            { name: 'Messages', icon: FaEnvelope, path: '/seller/messages' },
            { name: 'Profile & Business', icon: FaUserTie, path: '/seller/profile' },
            { name: 'Settings', icon: SettingsIcon, path: '/seller/settings' },
        ],
    },
];

// =============================================================================
// MANUFACTURER MENU (21 pages → 5 groups)
// =============================================================================
const manufacturerMenuGroups: MenuGroup[] = [

    {
        label: 'Product & Inventory',
        icon: ProductsIcon,
        items: [
            { name: 'Products', icon: ProductsIcon, path: '/manufacturer/products' },
            { name: 'Product Requests', icon: FaClock, path: '/manufacturer/products/requests' },
            { name: 'Allocations', icon: FaLayerGroup, path: '/manufacturer/allocations' },
            { name: 'Pricing Rules', icon: FaTag, path: '/manufacturer/pricing' },
        ],
    },
    {
        label: 'Seller Network',
        icon: FaNetworkWired,
        items: [
            { name: 'Seller Requests', icon: FaUserCheck, path: '/manufacturer/dealers/requests' },
            { name: 'Approved Sellers', icon: SellersIcon, path: '/manufacturer/dealers' },
            { name: 'Negotiations', icon: FaHandshake, path: '/manufacturer/negotiations' },
        ],
    },
    {
        label: 'Orders & Revenue',
        icon: LogisticsIcon,
        items: [
            { name: 'Orders', icon: LogisticsIcon, path: '/manufacturer/orders' },
            { name: 'Analytics', icon: FaChartBar, path: '/manufacturer/analytics' },
        ],
    },
    {
        label: 'Account',
        icon: FaUserCog,
        items: [
            { name: 'Profile & Compliance', icon: FaShieldAlt, path: '/manufacturer/profile' },
            { name: 'Notifications', icon: FaBell, path: '/manufacturer/notifications' },
            { name: 'Messages', icon: FaEnvelope, path: '/manufacturer/messages' },
            { name: 'Settings', icon: SettingsIcon, path: '/manufacturer/settings' },
        ],
    },
];

// =============================================================================
// SIDEBAR COMPONENT
// =============================================================================

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    role?: 'ADMIN' | 'CUSTOMER' | 'SELLER' | 'MANUFACTURER';
    isCollapsed?: boolean;
}

export default function Sidebar({ isOpen, onClose, role = 'ADMIN', isCollapsed = false }: SidebarProps) {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

    // Persist collapsed state per role
    useEffect(() => {
        try {
            const stored = localStorage.getItem(`sidebar_collapsed_${role}`);
            if (stored) setCollapsedGroups(JSON.parse(stored));
        } catch { }
    }, [role]);

    const saveCollapsedState = (next: Record<string, boolean>) => {
        setCollapsedGroups(next);
        try { localStorage.setItem(`sidebar_collapsed_${role}`, JSON.stringify(next)); } catch { }
    };

    const toggleGroup = (label: string) => {
        const next = { ...collapsedGroups, [label]: !collapsedGroups[label] };
        saveCollapsedState(next);
    };

    // Determine which config to use
    const isGrouped = role !== 'CUSTOMER';
    const menuGroups = role === 'ADMIN' ? adminMenuGroups
        : role === 'SELLER' ? sellerMenuGroups
            : role === 'MANUFACTURER' ? manufacturerMenuGroups
                : [];

    // Flatten all items for search and active detection
    const allItems = useMemo(() => {
        if (!isGrouped) return customerMenuItems;
        return menuGroups.flatMap(g => g.items);
    }, [isGrouped, role]);

    // Search filter
    const filteredGroups = useMemo(() => {
        if (!isGrouped) return [];
        if (!searchQuery.trim()) return menuGroups;
        const q = searchQuery.toLowerCase();
        return menuGroups
            .map(g => ({
                ...g,
                items: g.items.filter(item => item.name.toLowerCase().includes(q)),
            }))
            .filter(g => g.items.length > 0);
    }, [searchQuery, isGrouped, role]);

    const filteredFlatItems = useMemo(() => {
        if (isGrouped) return [];
        if (!searchQuery.trim()) return customerMenuItems;
        const q = searchQuery.toLowerCase();
        return customerMenuItems.filter(item => item.name.toLowerCase().includes(q));
    }, [searchQuery, isGrouped]);

    // --- NavItem ---
    const NavItem = ({ item }: { item: MenuItem }) => {
        const dashboardPaths = ['/admin', '/seller', '/manufacturer', '/customer'];
        const isDashboard = dashboardPaths.includes(item.path);

        const isActive = pathname === item.path || (
            !isDashboard &&
            pathname?.startsWith(`${item.path}/`) &&
            !allItems.some(other =>
                other.path !== item.path &&
                pathname.startsWith(other.path) &&
                other.path.length > item.path.length
            )
        );

        return (
            <Link
                href={item.path}
                onClick={onClose}
                title={isCollapsed ? item.name : ''}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-[10px] transition-all group text-sm ${isActive
                    ? (['ADMIN', 'MANUFACTURER', 'SELLER'].includes(role) ? 'bg-black text-white' : 'bg-primary text-white')
                    : 'text-foreground/50 hover:bg-muted hover:text-foreground'
                    } ${isCollapsed ? 'justify-center px-0 w-10 h-10 mx-auto' : ''}`}
            >
                <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-white' : 'text-foreground/40 group-hover:text-foreground/60'}`} />
                {!isCollapsed && <span className="text-sm font-medium tracking-tight whitespace-nowrap">{item.name}</span>}
            </Link>
        );
    };

    // --- GroupHeader ---
    const GroupHeader = ({ group }: { group: MenuGroup }) => {
        const isOpen = !collapsedGroups[group.label];
        if (isCollapsed) return null;

        return (
            <button
                onClick={() => toggleGroup(group.label)}
                className="w-full flex items-center justify-between px-4 py-2 mt-3 first:mt-0 cursor-pointer "
            >
                <span className="text-sm font-medium text-muted-foreground/60 tracking-wide group-hover:text-foreground/70 transition-colors">
                    {group.label}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 0 : -90 }}
                    transition={{ duration: 0.15 }}
                >
                    <FaChevronDown className="w-2.5 h-2.5 text-muted-foreground/40 group-hover:text-foreground/50 transition-colors" />
                </motion.span>
            </button>
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

            {/* Sidebar */}
            <motion.aside
                initial={false}
                animate={{
                    x: isOpen ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1025 ? 300 : 0),
                    width: isCollapsed ? '5rem' : '20%'
                }}
                className={`fixed inset-y-0 right-0 bg-surface border-l border-border z-50 flex flex-col transition-all no-scrollbar lg:relative lg:border-r lg:border-l-0 lg:left-0`}
            >
                {/* Logo Section */}
                <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center p-4' : 'gap-3'}`}>
                    <div className="w-10 h-10 rounded-[10px] flex items-center justify-center p-1.5 border border-border bg-white">
                        <img src="/assets/Novamart.png" alt="N" className="w-full h-full object-contain" />
                    </div>
                    {!isCollapsed && (
                        <div className="overflow-hidden whitespace-nowrap flex flex-col">
                            <h1 className="text-xl font-bold text-foreground tracking-tight italic letter-spacing-4">NovaMart</h1>
                            {/* <span className="text-sm font-medium text-primary mt-0.5">Enterprise Portal</span> */}
                        </div>
                    )}
                </div>

                {/* Sidebar Search */}
                {!isCollapsed && (
                    <div className="px-4 pb-2">
                        <div className="relative">
                            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-foreground/30" />
                            <input
                                type="text"
                                placeholder="Search menu…"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-border rounded-[10px] py-2 pl-8 pr-8 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all placeholder:text-muted-foreground"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/30 hover:text-foreground/60"
                                >
                                    <FaTimes className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {/* Workspace Label (Seller only)
                {!isCollapsed && role === 'SELLER' && !searchQuery && (
                    <div className="px-6 py-1">
                        <p className="text-sm font-medium text-muted-foreground">Workspace</p>
                    </div>
                )} */}

                {/* Primary Navigation */}
                <nav className="flex-1 px-3 py-1 overflow-y-auto no-scrollbar">
                    {/* Customer Profile Section (unchanged) */}
                    {role === 'CUSTOMER' && !isCollapsed && (
                        <div className="mb-6 p-4 bg-white rounded-[10px] border border-border">
                            <div className="flex items-center gap-4 p-2">
                                <div className="w-12 h-12 bg-black rounded-[10px] flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {user?.name?.charAt(0) || 'R'}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1.5">
                                        <h3 className="text-sm font-medium text-foreground truncate">{user?.name || 'User'}</h3>
                                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground mt-0.5">
                                        {user?.role === 'CUSTOMER' ? 'Retail Partner' : `${user?.role} Access`}
                                    </p>
                                </div>
                            </div>
                            <div className="space-y-2 mt-2 px-2">
                                <div className="flex items-center justify-between text-sm font-medium text-muted-foreground">
                                    <span>Account Status</span>
                                    <span className="text-emerald-600">Verified</span>
                                </div>
                                <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        className="h-full bg-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Standalone Dashboard Link for Manufacturer & Seller */}
                    {(role === 'MANUFACTURER' || role === 'SELLER') && (
                        <div className="mb-2">
                            <NavItem item={{
                                name: 'Dashboard',
                                icon: DashboardIcon,
                                path: role === 'MANUFACTURER' ? '/manufacturer' : '/seller'
                            }} />
                        </div>
                    )}

                    {/* Grouped Navigation (Admin / Seller / Manufacturer) */}
                    {isGrouped && (
                        <div className="space-y-0.5">
                            {filteredGroups.map((group) => {
                                const isGroupOpen = !collapsedGroups[group.label];
                                return (
                                    <div key={group.label}>
                                        <GroupHeader group={group} />
                                        <AnimatePresence initial={false}>
                                            {(isGroupOpen || isCollapsed || searchQuery) && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="space-y-0.5 pb-1">
                                                        {group.items.map((item) => (
                                                            <NavItem key={item.path} item={item} />
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {/* Flat Navigation (Customer) */}
                    {!isGrouped && (
                        <div className="space-y-1">
                            {filteredFlatItems.map((item) => (
                                <NavItem key={item.path} item={item} />
                            ))}
                        </div>
                    )}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 space-y-1 bg-surface border-t border-border">
                    {role === 'SELLER' && !isCollapsed && (
                        <div className="mb-4 p-4 bg-primary/5 rounded-[10px] border border-primary/10">
                            <div className="justify-between items-center mb-2 hidden sm:flex">
                                <span className="text-sm font-medium text-muted-foreground">Market Reputation</span>
                                <span className="text-sm font-bold text-primary">Top 10%</span>
                            </div>
                            <div className="h-1.5 w-full bg-primary/10 rounded-full overflow-hidden mb-3 hidden sm:block">
                                <div className="h-full bg-primary w-[90%] rounded-full opacity-80"></div>
                            </div>
                            <Link href="/seller/subscription" className="block text-center w-full py-2 bg-white border border-primary/10 text-primary text-sm font-medium rounded-[10px] hover:bg-primary hover:text-white transition-all shadow-sm">
                                View Subscription
                            </Link>
                        </div>
                    )}
                </div>
            </motion.aside>
        </>
    );
}
