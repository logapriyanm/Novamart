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
        <div className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-y border-white/50 py-6 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {items.map((item, idx) => {
                        const Icon = iconMap[item.icon] || FaShieldAlt;
                        return (
                            <div key={idx} className="flex items-center gap-4 group p-4 rounded-2xl transition-all duration-300 hover:bg-white/40 border border-transparent hover:border-white/40 hover:shadow-lg hover:backdrop-blur-sm">
                                <div className="w-12 h-12 rounded-[14px] bg-white/60 backdrop-blur-md flex items-center justify-center text-slate-900 group-hover:bg-[#10367D] group-hover:text-white transition-all duration-300 shadow-sm border border-white/50">
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                                    <p className="text-xs font-medium text-slate-500 mt-0.5">{item.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

