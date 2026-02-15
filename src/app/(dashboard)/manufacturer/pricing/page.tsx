'use client';

import React, { useState, useEffect } from 'react';
import { FaTag, FaPlus, FaTrash, FaToggleOn, FaToggleOff, FaPercentage, FaBox, FaCalendarAlt } from 'react-icons/fa';
import { pricingService, PricingRule } from '@/lib/api/services/pricing.service';
import { toast } from 'sonner';
import Loader from '@/client/components/ui/Loader';
import { AnimatePresence, motion } from 'framer-motion';

export default function PricingRulesPage() {
    const [rules, setRules] = useState<PricingRule[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newRule, setNewRule] = useState<Partial<PricingRule>>({
        name: '',
        type: 'BULK',
        minQuantity: 10,
        discountPercentage: 5,
        isActive: true
    });

    useEffect(() => {
        fetchRules();
    }, []);

    const fetchRules = async () => {
        try {
            const data = await pricingService.getRules();
            setRules(data || []);
        } catch (error) {
            toast.error('Failed to load pricing rules');
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async () => {
        if (!newRule.name || !newRule.discountPercentage) return;
        try {
            await pricingService.createRule(newRule);
            toast.success('Pricing Rule Created');
            setIsCreateModalOpen(false);
            fetchRules();
        } catch (error) {
            toast.error('Failed to create rule');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this rule?')) return;
        try {
            await pricingService.deleteRule(id);
            toast.success('Rule Deleted');
            setRules(prev => prev.filter(r => r._id !== id));
        } catch (error) {
            toast.error('Failed to delete rule');
        }
    };

    const handleToggle = async (id: string) => {
        try {
            await pricingService.toggleRuleStatus(id);
            setRules(prev => prev.map(r => r._id === id ? { ...r, isActive: !r.isActive } : r));
            toast.success('Status Updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 pb-6">
                <div>
                    <h1 className="text-2xl font-bold italic uppercase tracking-tight text-slate-900">Pricing Rules Engine</h1>
                    <p className="text-sm font-medium text-slate-500 mt-2">Configure automated discounts and promotional logic.</p>
                </div>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    className="px-6 py-2.5 bg-slate-900 text-white rounded-[10px] text-sm font-bold uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
                >
                    <FaPlus className="w-3 h-3" /> New Rule
                </button>
            </div>

            {/* Rules Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(rules || []).length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-slate-50 rounded-[10px] border border-dashed border-slate-200">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm text-slate-300">
                            <FaTag className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">No Active Rules</h3>
                        <p className="text-sm text-slate-500 mt-1">Create a pricing rule to start offering automated discounts.</p>
                    </div>
                ) : (
                    (rules || []).map((rule) => (
                        <div key={rule._id} className={`p-6 bg-white rounded-[10px] border transition-all hover:shadow-md group relative overflow-hidden ${rule.isActive ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-75 grayscale-[0.5]'}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className={`w-10 h-10 rounded-[10px] flex items-center justify-center ${rule.type === 'BULK' ? 'bg-blue-50 text-blue-600' :
                                    rule.type === 'PROMOTIONAL' ? 'bg-purple-50 text-purple-600' :
                                        'bg-amber-50 text-amber-600'
                                    }`}>
                                    {rule.type === 'BULK' ? <FaBox className="w-4 h-4" /> :
                                        rule.type === 'PROMOTIONAL' ? <FaTag className="w-4 h-4" /> :
                                            <FaPercentage className="w-4 h-4" />}
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggle(rule._id)}
                                        className={`transition-colors ${rule.isActive ? 'text-emerald-500' : 'text-slate-300'}`}
                                    >
                                        {rule.isActive ? <FaToggleOn className="w-6 h-6" /> : <FaToggleOff className="w-6 h-6" />}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(rule._id)}
                                        className="w-8 h-8 flex items-center justify-center rounded-[8px] hover:bg-rose-50 text-slate-300 hover:text-rose-500 transition-all"
                                    >
                                        <FaTrash className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <h3 className="text-base font-bold text-slate-900 mb-1">{rule.name}</h3>
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-[6px] uppercase tracking-wide">{rule.type}</span>
                                {rule.minQuantity > 1 && (
                                    <span className="text-xs text-slate-400 font-medium">Min Qty: {rule.minQuantity}</span>
                                )}
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                <div>
                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Discount</p>
                                    <p className="text-xl font-black text-slate-900">{rule.discountPercentage}% OFF</p>
                                </div>
                                {rule.validUntil && (
                                    <div className="text-right">
                                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wide">Valid Until</p>
                                        <p className="text-sm font-medium text-slate-700 flex items-center gap-1 justify-end">
                                            <FaCalendarAlt className="w-3 h-3 text-slate-300" />
                                            {new Date(rule.validUntil).toLocaleDateString()}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Create Modal */}
            <AnimatePresence>
                {isCreateModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={(e) => e.target === e.currentTarget && setIsCreateModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-[10px] shadow-2xl p-8 w-full max-w-md"
                        >
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Create New Rule</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1.5">Rule Name</label>
                                    <input
                                        type="text"
                                        value={newRule.name}
                                        onChange={e => setNewRule({ ...newRule, name: e.target.value })}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-400 transition-all"
                                        placeholder="e.g. Summer Bulk Discount"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1.5">Type</label>
                                        <select
                                            value={newRule.type}
                                            onChange={e => setNewRule({ ...newRule, type: e.target.value as any })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-400 transition-all"
                                        >
                                            <option value="BULK">Bulk Order</option>
                                            <option value="PROMOTIONAL">Promotional</option>
                                            <option value="EXCLUSIVE">Exclusive</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1.5">Discount (%)</label>
                                        <input
                                            type="number"
                                            value={newRule.discountPercentage}
                                            onChange={e => setNewRule({ ...newRule, discountPercentage: Number(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1.5">Min Quantity</label>
                                        <input
                                            type="number"
                                            value={newRule.minQuantity}
                                            onChange={e => setNewRule({ ...newRule, minQuantity: Number(e.target.value) })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1.5">Valid Until</label>
                                        <input
                                            type="date"
                                            value={newRule.validUntil ? new Date(newRule.validUntil).toISOString().split('T')[0] : ''}
                                            onChange={e => setNewRule({ ...newRule, validUntil: e.target.value })}
                                            className="w-full bg-slate-50 border border-slate-200 rounded-[10px] px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-slate-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <button
                                        onClick={() => setIsCreateModalOpen(false)}
                                        className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-[10px] text-sm font-bold hover:bg-slate-200 transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleCreate}
                                        className="flex-1 py-3 bg-slate-900 text-white rounded-[10px] text-sm font-bold hover:bg-slate-800 transition-all shadow-lg"
                                    >
                                        Create Rule
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
