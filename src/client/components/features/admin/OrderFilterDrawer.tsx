import React, { useState } from 'react';
import Drawer from '@/client/components/ui/Drawer';
import { FaCheck, FaTimes } from 'react-icons/fa';

interface OrderFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        status: string[];
        dateRange: string;
        minValue: string;
    };
    onApply: (newFilters: any) => void;
    onReset: () => void;
}

export default function OrderFilterDrawer({ isOpen, onClose, filters, onApply, onReset }: OrderFilterDrawerProps) {
    const [localFilters, setLocalFilters] = useState(filters);

    const STATUS_OPTIONS = ['CREATED', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

    const toggleStatus = (status: string) => {
        const current = localFilters.status || [];
        const next = current.includes(status)
            ? current.filter(s => s !== status)
            : [...current, status];
        setLocalFilters({ ...localFilters, status: next });
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleReset = () => {
        onReset();
        setLocalFilters({ status: [], dateRange: 'ALL', minValue: '' });
        onClose();
    };

    return (
        <Drawer
            isOpen={isOpen}
            onClose={onClose}
            title="Filter Orders"
            footer={
                <div className="flex gap-4">
                    <button
                        onClick={handleReset}
                        className="flex-1 px-4 py-3 bg-white text-slate-700 font-bold text-sm uppercase tracking-wider border border-slate-200 rounded-[10px] hover:bg-slate-50 transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={handleApply}
                        className="flex-1 px-4 py-3 bg-black text-white font-bold text-sm uppercase tracking-wider rounded-[10px] hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                    >
                        Apply Filters
                    </button>
                </div>
            }
        >
            <div className="space-y-8">
                {/* Status Filter */}
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Order Status</h3>
                    <div className="flex flex-wrap gap-2">
                        {STATUS_OPTIONS.map((status) => {
                            const isSelected = localFilters.status.includes(status);
                            return (
                                <button
                                    key={status}
                                    onClick={() => toggleStatus(status)}
                                    className={`px-4 py-2 rounded-[8px] text-[10px] font-bold uppercase tracking-wider border transition-all ${isSelected
                                        ? 'bg-indigo-50 border-indigo-200 text-indigo-700'
                                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                        }`}
                                >
                                    {status}
                                    {isSelected && <FaCheck className="inline-block ml-2 w-2 h-2" />}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Date Range - Simplified for Demo */}
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Time Period</h3>
                    <div className="grid grid-cols-2 gap-3">
                        {['ALL', 'TODAY', 'WEEK', 'MONTH'].map((range) => (
                            <button
                                key={range}
                                onClick={() => setLocalFilters({ ...localFilters, dateRange: range })}
                                className={`px-4 py-3 rounded-[8px] text-[10px] font-bold uppercase tracking-wider border transition-all text-center ${localFilters.dateRange === range
                                    ? 'bg-slate-900 text-white border-slate-900'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                                    }`}
                            >
                                {range === 'ALL' ? 'All Time' : range === 'TODAY' ? 'Today' : range === 'WEEK' ? 'This Week' : 'This Month'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Min Value */}
                <div>
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Minimum Order Value</h3>
                    <input
                        type="number"
                        placeholder="e.g 10000"
                        value={localFilters.minValue}
                        onChange={(e) => setLocalFilters({ ...localFilters, minValue: e.target.value })}
                        className="w-full px-4 py-3 rounded-[10px] border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                    />
                </div>
            </div>
        </Drawer>
    );
}
