'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
    FaExclamationTriangle,
    FaBell,
    FaLock,
    FaCheckCircle,
    FaUsers,
    FaCube,
    FaGavel
} from 'react-icons/fa';

import StatusCard from '../../../client/components/admin/StatusCard';
import ActivityFeedItem from '../../../client/components/admin/ActivityFeedItem';
import QuickActionButton from '../../../client/components/admin/QuickActionButton';
import SystemNotice from '../../../client/components/admin/SystemNotice';
import TrafficOrigin from '../../../client/components/admin/TrafficOrigin';

export default function AdminDashboard() {
    return (
        <div className="max-w-[1600px] mx-auto space-y-10 animate-fade-in">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-black text-foreground tracking-tight">System Health Dashboard</h1>
                <p className="text-sm font-bold text-foreground/40 mt-1">Real-time overview of platform status and critical administrative actions.</p>
            </div>

            {/* Status Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatusCard
                    title="High Risk Dealers"
                    value="3"
                    subtitle="1 since yesterday"
                    icon={FaExclamationTriangle}
                    theme="critical"
                />
                <StatusCard
                    title="Pending Verifications"
                    value="11"
                    subtitle="4 expiring soon"
                    icon={FaBell}
                    theme="attention"
                />
                <StatusCard
                    title="Escrow Holds"
                    value="6"
                    subtitle="Stable volume"
                    icon={FaLock}
                    theme="pending"
                />
                <StatusCard
                    title="Platform Status"
                    value="Healthy"
                    subtitle="99.9% uptime"
                    icon={FaCheckCircle}
                    theme="operational"
                />
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left: Live Activity Feed */}
                <div className="xl:col-span-8 bg-surface p-8 rounded-[2rem] border border-foreground/5 shadow-sm flex flex-col h-full">
                    <div className="flex items-center justify-between mb-8 px-2">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-foreground tracking-tight">Live Activity Feed</h3>
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        </div>
                        <button className="text-[11px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
                    </div>

                    <div className="space-y-4">
                        <ActivityFeedItem
                            type="violation"
                            title="Compliance Violation"
                            description={<>Dealer <span className="font-black text-primary">DLR-002</span> flagged for GST mismatch in recent transaction.</>}
                            time="2m ago"
                            actionLabel="Review"
                        />
                        <ActivityFeedItem
                            type="delay"
                            title="Logistics Delay"
                            description={<>Order <span className="font-black text-primary">NM-123</span> delayed at Warehouse B due to heavy rainfall.</>}
                            time="14m ago"
                            actionLabel="Resolve"
                        />
                        <ActivityFeedItem
                            type="upload"
                            title="KYC Upload"
                            description={<>New KYC documents uploaded for review: <span className="font-black text-primary">DLR-089</span>.</>}
                            time="45m ago"
                            actionLabel="Review"
                        />
                        <ActivityFeedItem
                            type="success"
                            title="Verification Approved"
                            description={<>Admin <span className="italic font-bold">"P. Parker"</span> approved 5 new products.</>}
                            time="1h ago"
                            actionLabel="Details"
                        />
                    </div>
                </div>

                {/* Right: Quick Actions & Notices */}
                <div className="xl:col-span-4 space-y-8">
                    <div className="bg-surface p-8 rounded-[2rem] border border-foreground/5 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black text-foreground/40 uppercase tracking-[0.2em] mb-6">Quick Actions</h3>
                        <QuickActionButton
                            label="Review Dealers"
                            icon={FaUsers}
                            variant="primary"
                        />
                        <QuickActionButton
                            label="Review Products"
                            icon={FaCube}
                            variant="dark"
                        />
                        <QuickActionButton
                            label="Review Disputes"
                            icon={FaGavel}
                            variant="outline"
                        />
                    </div>

                    <SystemNotice />

                    <TrafficOrigin />
                </div>
            </div>
        </div>
    );
}
