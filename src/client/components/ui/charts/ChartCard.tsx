'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { HiDownload } from 'react-icons/hi';
import { FaCalendarAlt } from 'react-icons/fa';

interface ChartCardProps {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
    onExport?: () => void;
    currentRange?: string;
    onRangeChange?: (range: string) => void;
    isLoading?: boolean;
    isEmpty?: boolean;
    className?: string; // Add className prop
}

export default function ChartCard({
    title,
    subtitle,
    children,
    onExport,
    currentRange = '30d',
    onRangeChange,
    isLoading,
    isEmpty,
    className
}: ChartCardProps) {
    return (
        <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col h-full ${className || ''}`}>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
                </div>

                <div className="flex items-center gap-2">
                    {onRangeChange && (
                        <div className="flex items-center bg-slate-50 rounded-lg p-1 border border-slate-200">
                            {['7d', '30d', '90d'].map((range) => (
                                <button
                                    key={range}
                                    onClick={() => onRangeChange(range)}
                                    className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md transition-all ${currentRange === range
                                            ? 'bg-white text-slate-800 shadow-sm'
                                            : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    )}

                    {onExport && (
                        <button
                            onClick={onExport}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
                            title="Export CSV"
                        >
                            <HiDownload className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-[300px] relative">
                {isLoading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                        <div className="w-8 h-8 border-4 border-slate-100 border-t-slate-800 rounded-full animate-spin"></div>
                    </div>
                ) : isEmpty ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                        <FaCalendarAlt className="w-8 h-8 mb-3 opacity-20" />
                        <p className="text-sm font-medium">No data available for selected period</p>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
}
