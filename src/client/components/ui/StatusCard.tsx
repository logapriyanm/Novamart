'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';

interface StatusCardProps {
    title: string;
    value: string;
    subtitle: string;
    icon: IconType;
    theme: 'critical' | 'attention' | 'pending' | 'operational';
}

const themes = {
    critical: {
        bg: 'border-l-[6px] border-l-red-500',
        iconBg: 'bg-red-500/10',
        iconColor: 'text-red-500',
        badge: 'Critical',
        badgeBg: 'bg-red-500/10 text-red-500',
    },
    attention: {
        bg: 'border-l-[6px] border-l-orange-400',
        iconBg: 'bg-orange-400/10',
        iconColor: 'text-orange-400',
        badge: 'Attention',
        badgeBg: 'bg-orange-400/10 text-orange-400',
    },
    pending: {
        bg: 'border-l-[6px] border-l-amber-400',
        iconBg: 'bg-amber-400/10',
        iconColor: 'text-amber-400',
        badge: 'Pending',
        badgeBg: 'bg-amber-400/10 text-amber-400',
    },
    operational: {
        bg: 'border-l-[6px] border-l-emerald-500',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-500',
        badge: 'Operational',
        badgeBg: 'bg-emerald-500/10 text-emerald-500',
    },
};

export default function StatusCard({ title, value, subtitle, icon: Icon, theme }: StatusCardProps) {
    const style = themes[theme];

    return (
        <motion.div
            whileHover={{ y: -4 }}
            className={`bg-surface p-6 rounded-2xl shadow-sm border border-foreground/5 flex flex-col gap-4 ${style.bg}`}
        >
            <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${style.iconBg}`}>
                    <Icon className={`w-5 h-5 ${style.iconColor}`} />
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-sm font-semibold ${style.badgeBg}`}>
                    {style.badge}
                </span>
            </div>

            <div>
                <p className="text-sm font-bold text-foreground/40">{title}</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-3xl font-black text-foreground tracking-tight">{value}</h3>
                </div>
                <p className={`text-sm font-medium mt-1 ${theme === 'operational' ? 'text-emerald-500' : 'text-foreground/20'}`}>
                    {subtitle}
                </p>
            </div>
        </motion.div>
    );
}
