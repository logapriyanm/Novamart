'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface ActivityFeedItemProps {
    type: 'violation' | 'delay' | 'upload' | 'success';
    title: string;
    description: React.ReactNode;
    time: string;
    actionLabel?: string;
}

const icons = {
    violation: { color: 'bg-red-500', icon: '⚠️' },
    delay: { color: 'bg-orange-500', icon: '🚚' },
    upload: { color: 'bg-blue-500', icon: '📄' },
    success: { color: 'bg-emerald-500', icon: '✅' },
};

export default function ActivityFeedItem({ type, title, description, time, actionLabel }: ActivityFeedItemProps) {
    const style = icons[type];

    return (
        <div className="flex items-start gap-4 p-4 hover:bg-background rounded-2xl transition-all group">
            <div className={`mt-1 w-10 h-10 rounded-full ${style.color} flex items-center justify-center text-white text-sm shadow-lg shadow-black/5`}>
                {style.icon}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                    <h4 className="text-sm font-black text-foreground">{title}</h4>
                    <span className="text-[10px] font-bold text-foreground/40 uppercase">{time}</span>
                </div>
                <p className="text-xs text-foreground/50 mt-1 leading-relaxed">
                    {description}
                </p>
            </div>

            {actionLabel && (
                <button className="px-4 py-1.5 bg-foreground/5 hover:bg-foreground/10 text-foreground/60 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors ml-4 self-center">
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
