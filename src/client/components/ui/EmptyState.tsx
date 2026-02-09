'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { IconType } from 'react-icons';
import Link from 'next/link';

interface EmptyStateProps {
    icon: IconType;
    title: string;
    description: string;
    actionLabel?: string;
    actionPath?: string;
    onAction?: () => void;
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    actionPath,
    onAction
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 rounded-[20px] border-2 border-dashed border-slate-200">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-6"
            >
                <Icon className="w-8 h-8 text-slate-400" />
            </motion.div>

            <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-2">{title}</h3>
            <p className="text-sm text-slate-500 max-w-[280px] mb-8 leading-relaxed">
                {description}
            </p>

            {actionPath ? (
                <Link
                    href={actionPath}
                    className="px-6 py-3 bg-black text-white rounded-[12px] text-xs font-black uppercase tracking-widest hover:bg-black/90 transition-all shadow-lg shadow-black/10"
                >
                    {actionLabel}
                </Link>
            ) : onAction ? (
                <button
                    onClick={onAction}
                    className="px-6 py-3 bg-black text-white rounded-[12px] text-xs font-black uppercase tracking-widest hover:bg-black/90 transition-all shadow-lg shadow-black/10"
                >
                    {actionLabel}
                </button>
            ) : null}
        </div>
    );
}
