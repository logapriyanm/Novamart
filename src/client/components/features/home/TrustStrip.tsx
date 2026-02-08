import React from 'react';
import { FaShieldAlt, FaBoxOpen, FaUserCheck, FaLock } from 'react-icons/fa';

const trustItems = [
    {
        icon: FaUserCheck,
        title: 'Verified Sellers Only',
        desc: 'Rigorous 5-step background check'
    },
    {
        icon: FaBoxOpen,
        title: 'Genuine Products',
        desc: 'Direct from manufacturer inventory'
    },
    {
        icon: FaShieldAlt,
        title: 'Secure Payments',
        desc: 'State-enforced escrow safety'
    },
    {
        icon: FaLock,
        title: 'Data Privacy',
        desc: 'ISO 27001 compliant security'
    }
];

export default function TrustStrip() {
    return (
        <div className="bg-surface border-y border-foreground/5 py-6 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {trustItems.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-background transition-all duration-300 border border-primary/20">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className="text-sm font-black text-foreground uppercase tracking-wider">{item.title}</h4>
                                <p className="text-[10px] font-bold text-foreground/40 mt-0.5">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

