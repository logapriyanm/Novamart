import React from 'react';
import { FaShieldAlt, FaBoxOpen, FaUserCheck, FaLock, FaCheckCircle, FaAward } from 'react-icons/fa';

const iconMap: Record<string, any> = {
    'FaShieldAlt': FaShieldAlt,
    'FaBoxOpen': FaBoxOpen,
    'FaUserCheck': FaUserCheck,
    'FaLock': FaLock,
    'FaCheckCircle': FaCheckCircle,
    'FaAward': FaAward
};

interface TrustStripProps {
    items?: { icon: string; title: string; desc: string }[];
}

export default function TrustStrip({ items = [] }: TrustStripProps) {
    if (items.length === 0) return null;

    return (
        <div className="bg-surface border-y border-foreground/5 py-6 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item, idx) => {
                        const Icon = iconMap[item.icon] || FaShieldAlt;
                        return (
                            <div key={idx} className="flex items-center gap-4 group">
                                <div className="w-12 h-12 rounded-[10px] bg-black/5 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white transition-all duration-300 border border-foreground/5">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-foreground uppercase tracking-wider">{item.title}</h4>
                                    <p className="text-[10px] font-bold text-foreground/40 mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

