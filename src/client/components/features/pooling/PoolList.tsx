'use client';

import React, { useState, useEffect } from 'react';
import { poolingService } from '@/lib/api/services/pooling.service';
import { motion } from 'framer-motion';
import { FaUsers, FaBox, FaClock, FaCheckCircle, FaBolt } from 'react-icons/fa';
import EmptyState from '@/client/components/ui/EmptyState';

export default function PoolList() {
    const [pools, setPools] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [participation, setParticipation] = useState<{ [key: string]: number }>({});
    const [isJoining, setIsJoining] = useState<string | null>(null);

    useEffect(() => {
        loadPools();
    }, []);

    const loadPools = async () => {
        setIsLoading(true);
        try {
            const data = await poolingService.getPools({ status: 'OPEN' });
            setPools(data);
        } catch (error) {
            console.error('Failed to load pools:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleJoin = async (poolId: string) => {
        const qty = participation[poolId];
        if (!qty || qty <= 0) return;

        setIsJoining(poolId);
        try {
            await poolingService.joinPool(poolId, qty);
            await loadPools(); // Refresh to see updated progress
            setParticipation(prev => ({ ...prev, [poolId]: 0 })); // Reset input
        } catch (error) {
            console.error('Failed to join pool:', error);
            alert('Failed to join pool. Please try again.');
        } finally {
            setIsJoining(null);
        }
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-64 bg-slate-100 rounded-[20px]"></div>
                ))}
            </div>
        );
    }

    if (pools.length === 0) {
        return (
            <EmptyState
                icon={FaUsers}
                title="No Active Pools"
                description="There are currently no open demand pools. Check back later for bulk opportunities."
            />
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pools.map(pool => {
                const progress = (pool.currentQuantity / pool.targetQuantity) * 100;
                const isFull = pool.currentQuantity >= pool.targetQuantity;

                return (
                    <motion.div
                        key={pool.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-[20px] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
                    >
                        {/* Status Badge */}
                        <div className="absolute top-4 right-4 z-10">
                            <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                                <FaBolt className="w-3 h-3" />
                                {isFull ? 'Filled' : 'Open'}
                            </span>
                        </div>

                        <div className="mb-6 relative z-10">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{pool.manufacturer?.user?.businessName || 'Manufacturer'}</h4>
                            <h3 className="text-lg font-black text-slate-800 leading-tight mb-2">{pool.product?.name}</h3>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <FaClock className="w-3 h-3 text-slate-400" />
                                <span>Expires {new Date(pool.expiresAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-6">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest mb-2">
                                <span className="text-slate-500">{pool.currentQuantity} / {pool.targetQuantity} Units</span>
                                <span className="text-emerald-600">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(progress, 100)}%` }}
                                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
                                />
                            </div>
                        </div>

                        {/* Action Area */}
                        <div className="bg-slate-50 -mx-6 -mb-6 p-6 border-t border-slate-100">
                            {isFull ? (
                                <div className="text-center py-2">
                                    <span className="text-xs font-black text-emerald-600 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <FaCheckCircle /> Target Met
                                    </span>
                                </div>
                            ) : (
                                <div className="flex gap-3">
                                    <div className="relative flex-1">
                                        <input
                                            type="number"
                                            placeholder="Qty"
                                            min="1"
                                            className="w-full px-4 py-2.5 rounded-[10px] border border-slate-200 text-sm font-bold focus:outline-none focus:border-emerald-500 transition-colors"

                                            value={participation[pool.id] || ''}
                                            onChange={(e) => setParticipation(prev => ({ ...prev, [pool.id]: parseInt(e.target.value) }))}
                                        />
                                        <FaBox className="absolute right-3 top-3 text-slate-300 w-3 h-3" />
                                    </div>
                                    <button
                                        onClick={() => handleJoin(pool.id)}
                                        disabled={!participation[pool.id] || isJoining === pool.id}
                                        className="bg-black text-white px-6 py-2.5 rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {isJoining === pool.id ? '...' : 'Commit'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
