'use client';

import React, { useState, useEffect } from 'react';
import {
    FaSort,
    FaEye,
    FaEyeSlash,
    FaEdit,
    FaPlus,
    FaArrowUp,
    FaArrowDown,
    FaSave,
    FaTrash,
    FaCalendarAlt,
    FaSearch
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface CMSSection {
    _id: string;
    sectionKey: string;
    title: string;
    subtitle?: string;
    componentName: string;
    isActive: boolean;
    order: number;
    visibleFor: string[];
    content?: any;
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        keywords?: string[];
    };
    schedule?: {
        startDate?: string;
        endDate?: string;
    };
}

export default function AdminCMSPage() {
    const [sections, setSections] = useState<CMSSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [editingSection, setEditingSection] = useState<CMSSection | null>(null);

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setIsLoading(true);
            const data = await apiClient.get<CMSSection[]>('/cms/admin/all');
            setSections(data);
        } catch (error) {
            toast.error('Failed to load CMS sections');
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (id: string, currentState: boolean) => {
        if (currentState) {
            const confirmed = window.confirm('Are you sure you want to disable this section? It will be hidden from all assigned roles instantly.');
            if (!confirmed) return;
        }

        try {
            const res = await apiClient.put<any>(`/cms/admin/${id}`, { isActive: !currentState });
            if (res.success) {
                setSections(sections.map(s => s._id === id ? { ...s, isActive: !currentState } : s));
                toast.success(`Section ${!currentState ? 'enabled' : 'disabled'} successfully`);
            }
        } catch (error) {
            toast.error('Failed to update section status');
        }
    };

    const handleMove = (index: number, direction: 'up' | 'down') => {
        const newSections = [...sections];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= sections.length) return;

        [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];

        // Update order numbers
        const updated = newSections.map((s, i) => ({ ...s, order: (i + 1) * 10 }));
        setSections(updated);
    };

    const handleSaveOrder = async () => {
        try {
            setIsSaving(true);
            const sectionOrders = sections.map(s => ({ id: s._id, order: s.order }));
            const res = await apiClient.post<any>('/cms/admin/reorder', { sectionOrders });
            if (res.success) {
                toast.success('New order saved effectively');
            }
        } catch (error) {
            toast.error('Failed to save order');
        } finally {
            setIsSaving(false);
        }
    };

    const handleEditSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingSection) return;

        try {
            setIsSaving(true);
            const res = await apiClient.put<any>(`/cms/admin/${editingSection._id}`, editingSection);
            if (res.success) {
                setSections(sections.map(s => s._id === editingSection._id ? editingSection : s));
                setEditingSection(null);
                toast.success('Section updated successfully');
            }
        } catch (error) {
            toast.error('Failed to save changes');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-foreground tracking-tight">Home Page CMS</h1>
                    <p className="text-foreground/60 mt-1">Manage sections, visibility, and role-based content dynamically.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleSaveOrder}
                        disabled={isSaving}
                        className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-[12px] font-bold text-sm hover:scale-[1.02] transition-all disabled:opacity-50"
                    >
                        <FaSave /> Save Changes
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 gap-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-24 bg-surface animate-pulse rounded-[16px] border border-foreground/5"></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {sections.map((section, index) => (
                            <motion.div
                                key={section._id}
                                layout
                                className={`bg-surface border ${section.isActive ? 'border-foreground/5' : 'border-red-200 bg-red-50/10'} p-5 rounded-[20px] shadow-sm flex items-center gap-6 group transition-all`}
                            >
                                {/* Reorder Controls */}
                                <div className="flex flex-col gap-1">
                                    <button
                                        onClick={() => handleMove(index, 'up')}
                                        disabled={index === 0}
                                        className="p-1.5 rounded-md hover:bg-background disabled:opacity-30 text-foreground/40"
                                    >
                                        <FaArrowUp className="w-3 h-3" />
                                    </button>
                                    <div className="text-[10px] font-black text-center text-foreground/20 uppercase">{section.order}</div>
                                    <button
                                        onClick={() => handleMove(index, 'down')}
                                        disabled={index === sections.length - 1}
                                        className="p-1.5 rounded-md hover:bg-background disabled:opacity-30 text-foreground/40"
                                    >
                                        <FaArrowDown className="w-3 h-3" />
                                    </button>
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-foreground truncate">{section.title}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-background border border-foreground/10 text-[10px] font-black uppercase text-foreground/40">
                                            {section.componentName}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        {section.visibleFor.map(role => (
                                            <span key={role} className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                {role}
                                            </span>
                                        ))}
                                        {!section.isActive && (
                                            <span className="text-[9px] font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-md uppercase tracking-wider">
                                                Disabled
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => handleToggleActive(section._id, section.isActive)}
                                        title={section.isActive ? 'Disable Section' : 'Enable Section'}
                                        className={`p-3 rounded-[12px] transition-all ${section.isActive ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                                    >
                                        {section.isActive ? <FaEye /> : <FaEyeSlash />}
                                    </button>
                                    <button
                                        onClick={() => setEditingSection(section)}
                                        className="p-3 bg-blue-100 text-blue-600 rounded-[12px] hover:bg-blue-200 transition-all"
                                    >
                                        <FaEdit />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Edit Modal */}
            <AnimatePresence>
                {editingSection && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setEditingSection(null)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-surface w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden border border-foreground/10"
                        >
                            <div className="p-8 border-b border-foreground/5 sticky top-0 bg-surface z-10 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-black text-foreground">Edit Section</h2>
                                    <p className="text-xs text-foreground/40 font-bold uppercase tracking-widest mt-1">{editingSection.sectionKey}</p>
                                </div>
                                <button
                                    onClick={() => setEditingSection(null)}
                                    className="text-foreground/40 hover:text-foreground p-2"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleEditSave} className="p-8 space-y-6 overflow-y-auto max-h-[70vh]">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-wider text-foreground/40">Display Title</label>
                                        <input
                                            type="text"
                                            value={editingSection.title}
                                            onChange={e => setEditingSection({ ...editingSection, title: e.target.value })}
                                            className="w-full bg-background border border-foreground/10 rounded-[12px] px-4 py-3 text-sm focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black uppercase tracking-wider text-foreground/40">Subtitle (Optional)</label>
                                        <input
                                            type="text"
                                            value={editingSection.subtitle || ''}
                                            onChange={e => setEditingSection({ ...editingSection, subtitle: e.target.value })}
                                            className="w-full bg-background border border-foreground/10 rounded-[12px] px-4 py-3 text-sm focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-wider text-foreground/40">Visibility Roles</label>
                                    <div className="flex flex-wrap gap-2">
                                        {['GUEST', 'CUSTOMER', 'DEALER', 'MANUFACTURER', 'ADMIN'].map(role => (
                                            <button
                                                key={role}
                                                type="button"
                                                onClick={() => {
                                                    const current = editingSection.visibleFor;
                                                    const fresh = current.includes(role)
                                                        ? current.filter(r => r !== role)
                                                        : [...current, role];
                                                    setEditingSection({ ...editingSection, visibleFor: fresh });
                                                }}
                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${editingSection.visibleFor.includes(role) ? 'bg-primary text-white' : 'bg-background border border-foreground/10 text-foreground/40'}`}
                                            >
                                                {role}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="border-t border-foreground/5 pt-6">
                                    <h4 className="text-sm font-black text-foreground mb-4 uppercase tracking-tighter flex items-center gap-2">
                                        <FaSearch className="w-3 h-3" /> SEO Optimization
                                    </h4>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-wider text-foreground/40">Meta Title Override</label>
                                            <input
                                                type="text"
                                                placeholder="Keep empty to use default"
                                                value={editingSection.seo?.metaTitle || ''}
                                                onChange={e => setEditingSection({ ...editingSection, seo: { ...(editingSection.seo || {}), metaTitle: e.target.value } })}
                                                className="w-full bg-background border border-foreground/10 rounded-[12px] px-4 py-3 text-sm focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-wider text-foreground/40">Meta Description</label>
                                            <textarea
                                                rows={2}
                                                placeholder="Brief summary for search engines"
                                                value={editingSection.seo?.metaDescription || ''}
                                                onChange={e => setEditingSection({ ...editingSection, seo: { ...(editingSection.seo || {}), metaDescription: e.target.value } })}
                                                className="w-full bg-background border border-foreground/10 rounded-[12px] px-4 py-3 text-sm focus:border-primary outline-none resize-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-foreground/5 pt-6 sticky bottom-0 bg-surface mt-auto">
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full bg-primary text-white font-black py-4 rounded-[16px] flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 shadow-xl shadow-primary/20"
                                    >
                                        {isSaving ? 'Saving Changes...' : 'Update Section Configuration'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
