'use client';

import React, { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@/client/components/ui/Breadcrumb';

// Common mapping for URL segments to readable labels
const SEGMENT_LABELS: Record<string, string> = {
    'admin': 'Admin', // Usually hidden by Home > Admin logic, but good to have
    'seller': 'Seller',
    'manufacturer': 'Manufacturer',
    'customer': 'Customer',
    'users': 'User Management',
    'products': 'Products',
    'orders': 'Orders',
    'analytics': 'Analytics',
    'cms': 'CMS',
    'settings': 'Settings',
    'profile': 'Profile',
    'inventory': 'Inventory',
    'allocations': 'Allocations',
    'custom-orders': 'Custom Orders',
    'pricing': 'Pricing Rules',
    'sellers': 'Sellers',
    'negotiations': 'Negotiations',
    'notifications': 'Notifications',
    'messages': 'Messages',
    'marketplace': 'Marketplace',
    'pending': 'Pending Requests',
    'collaboration': 'Collaboration',
    'custom-requests': 'Custom Requests',
    'sourcing': 'Sourcing',
    'pooling': 'Pooling',
    'subscription': 'Subscription',
    'finance': 'Finance',
    'support': 'Support',
    'wishlist': 'Wishlist',
    'reviews': 'Reviews',
    'verification': 'Verification',
    'badges': 'Badges',
    'escrow': 'Escrow',
    'disputes': 'Disputes',
    'escalations': 'Escalations',
    'fraud': 'Fraud Detection',
    'audit': 'Audit Log',
    'rules': 'Rules',
    'manufacturers': 'Manufacturers',
};

export default function DashboardBreadcrumb() {
    const pathname = usePathname();

    const items = useMemo(() => {
        if (!pathname) return [];

        // Remove query params and leading/trailing slashes
        const path = pathname.split('?')[0].replace(/^\/|\/$/g, '');
        if (!path) return [];

        const segments = path.split('/');

        // Transform user-friendly structure
        return segments.map((seg, index) => {
            const href = '/' + segments.slice(0, index + 1).join('/');

            // Check if segment is an ID (simple heuristic: long alpha-numeric)
            // or use specific logic if needed
            const isId = seg.length > 20 && /[a-zA-Z0-9]+/.test(seg);

            let label = SEGMENT_LABELS[seg.toLowerCase()]
                || (isId ? 'Details' : seg.charAt(0).toUpperCase() + seg.slice(1).replace(/-/g, ' '));

            return {
                label,
                href
            };
        });
    }, [pathname]);

    // Don't render empty
    if (!items.length) return null;

    return (
        <div className="hidden md:block">
            <Breadcrumb items={items} className="mb-0" />
        </div>
    );
}
