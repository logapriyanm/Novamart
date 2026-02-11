'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

export interface SidebarSection {
    title: string;
    description?: string;
    icon?: any;
    items?: {
        title: string;
        description?: string;
    }[];
}

interface FooterPageSidebarProps {
    title: string;
    description: string;
    welcomeMessage?: string;
    sections: SidebarSection[];
}

const FooterPageSidebar: React.FC<FooterPageSidebarProps> = ({
    title,
    description,
    welcomeMessage,
    sections
}) => {
    return (
        <div className="hidden lg:flex flex-col w-full max-w-[400px] h-fit sticky top-32 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[10px] overflow-hidden shadow-xl shadow-black/5">
            {/* Header */}
            <div className="p-6 bg-slate-900 text-white">
                <h2 className="text-xl font-black uppercase italic tracking-tighter">{title}</h2>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] mt-1 text-slate-400">{description}</p>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh] no-scrollbar">
                {welcomeMessage && (
                    <section className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-[10px] border border-slate-100 dark:border-slate-700">
                        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed italic">
                            "{welcomeMessage}"
                        </p>
                    </section>
                )}

                <div className="space-y-10">
                    {sections.map((section, sIdx) => (
                        <div key={sIdx} className="space-y-4">
                            <div className="flex items-center gap-3">
                                {section.icon && (
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-200 rounded-[10px]">
                                        <section.icon className="w-5 h-5" />
                                    </div>
                                )}
                                <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-tighter italic">
                                    {section.title}
                                </h3>
                            </div>

                            {section.description && (
                                <p className="text-sm text-slate-500 dark:text-slate-400 pl-11 font-medium leading-relaxed italic">
                                    {section.description}
                                </p>
                            )}

                            {section.items && (
                                <div className="pl-11 space-y-4">
                                    {section.items.map((item, iIdx) => (
                                        <div key={iIdx} className="flex gap-3 group">
                                            <div className="mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400 group-hover:bg-slate-900 dark:group-hover:bg-white group-hover:scale-150 transition-all" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-slate-700 dark:text-slate-200 uppercase tracking-tight italic">
                                                    {item.title}
                                                </h4>
                                                {item.description && (
                                                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium italic leading-relaxed">
                                                        {item.description}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / Badge */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">
                    NovaMart Connection Protocol v2.0
                </p>
            </div>
        </div>
    );
};

export default FooterPageSidebar;
