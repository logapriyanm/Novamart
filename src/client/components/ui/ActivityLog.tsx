'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import {
    FaUserCircle,
    FaEdit,
    FaTrash,
    FaPlus,
    FaCheck,
    FaInfoCircle,
    FaExclamationTriangle,
    FaSignInAlt,
    FaSignOutAlt
} from 'react-icons/fa';

export type ActivityType = 'create' | 'update' | 'delete' | 'info' | 'warning' | 'error' | 'login' | 'logout';

export interface ActivityItem {
    id: string;
    type: ActivityType;
    user: {
        name: string;
        avatar?: string;
        role?: string;
    };
    action: string;
    target?: string;
    timestamp: Date | string;
    details?: string;
}

interface ActivityLogProps {
    title?: string;
    activities: ActivityItem[];
    maxHeight?: string;
    className?: string;
    emptyMessage?: string;
}

const TYPE_ICONS = {
    create: { icon: FaPlus, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    update: { icon: FaEdit, color: 'text-blue-500', bg: 'bg-blue-50' },
    delete: { icon: FaTrash, color: 'text-rose-500', bg: 'bg-rose-50' },
    info: { icon: FaInfoCircle, color: 'text-slate-500', bg: 'bg-slate-50' },
    warning: { icon: FaExclamationTriangle, color: 'text-amber-500', bg: 'bg-amber-50' },
    error: { icon: FaExclamationTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
    login: { icon: FaSignInAlt, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    logout: { icon: FaSignOutAlt, color: 'text-slate-400', bg: 'bg-slate-100' },
};

export default function ActivityLog({
    title = 'Activity Log',
    activities,
    maxHeight = '400px',
    className = '',
    emptyMessage = 'No recent activity'
}: ActivityLogProps) {
    return (
        <div className={`bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden flex flex-col ${className}`}>
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
                <h3 className="text-sm font-bold text-slate-800 italic">{title}</h3>
                <span className="text-sm font-bold text-slate-400">{activities.length} Events</span>
            </div>

            {/* List */}
            <div className="overflow-y-auto custom-scrollbar p-0" style={{ maxHeight }}>
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm font-medium italic">
                        {emptyMessage}
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {activities.map((item) => {
                            const style = TYPE_ICONS[item.type] || TYPE_ICONS.info;
                            const Icon = style.icon;

                            return (
                                <div key={item.id} className="p-4 hover:bg-slate-50/50 transition-colors group flex gap-4 items-start">
                                    {/* Icon */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${style.bg}`}>
                                        <Icon className={`w-3.5 h-3.5 ${style.color}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start gap-2">
                                            <p className="text-sm font-bold text-slate-800 truncate">
                                                <span className={`${style.color}`}>{item.user.name}</span>
                                                <span className="text-slate-400 font-medium mx-1.5">•</span>
                                                <span className="text-slate-600">{item.action}</span>
                                                {item.target && <span className="text-slate-800 ml-1">"{item.target}"</span>}
                                            </p>
                                            <span className="text-xs font-bold text-slate-300 whitespace-nowrap shrink-0">
                                                {typeof item.timestamp === 'string'
                                                    ? item.timestamp
                                                    : formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                                            </span>
                                        </div>

                                        {item.details && (
                                            <p className="text-sm text-slate-500 mt-1 leading-relaxed line-clamp-2">
                                                {item.details}
                                            </p>
                                        )}

                                        {/* Meta Footer */}
                                        <div className="flex items-center gap-2 mt-2">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-xs font-bold">
                                                {item.user.role || 'User'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
