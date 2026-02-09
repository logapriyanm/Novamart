'use client';

import React from 'react';
import DashboardHeader from '@/client/components/features/dashboard/customer/DashboardHeader';
import ActiveOrderCard from '@/client/components/features/dashboard/customer/ActiveOrderCard';
import RecentProducts from '@/client/components/features/dashboard/customer/RecentProducts';
import RecommendedBanner from '@/client/components/features/dashboard/customer/RecommendedBanner';

export default function CustomerDashboard() {
    return (
        <div className="space-y-8 pb-20 animate-fade-in max-w-7xl mx-auto">
            {/* Header Section */}
            <DashboardHeader />

            {/* Active Order Tracking */}
            <div className="w-full">
                <ActiveOrderCard />
            </div>

            {/* Recently Viewed Products */}
            <div className="w-full pt-4">
                <RecentProducts />
            </div>

            {/* Recommended Banner */}
            <div className="w-full pt-4">
                <RecommendedBanner />
            </div>
        </div>
    );
}
