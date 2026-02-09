'use client';

import React from 'react';
import { FaTruck, FaCheck, FaBoxOpen, FaHome, FaMapMarkerAlt } from 'react-icons/fa';

export default function ActiveOrderCard() {
    const steps = [
        { label: 'Ordered', date: 'Oct 12, 10:00 AM', status: 'completed', icon: FaCheck },
        { label: 'Processing', date: 'Oct 12, 2:30 PM', status: 'completed', icon: FaBoxOpen },
        { label: 'In Transit', date: 'Oct 13, 8:00 AM', status: 'current', icon: FaTruck },
        { label: 'Delivered', date: 'Est. Oct 15', status: 'pending', icon: FaHome },
    ];

    return (
        <div className="bg-white p-8 rounded-[20px] shadow-sm border border-slate-100 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0F6CBD]">
                        <FaTruck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-[#1E293B]">Active Order #NM-98234</h3>
                        <p className="text-xs font-bold text-slate-400">Standard Delivery</p>
                    </div>
                </div>
                <span className="bg-blue-50 text-[#0F6CBD] px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-100">
                    In Transit
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative px-4 py-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-[#0F6CBD] -translate-y-1/2 z-0 transition-all duration-1000"
                    style={{ width: '66%' }}
                ></div>

                <div className="relative z-10 flex justify-between w-full">
                    {steps.map((step, index) => {
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';

                        return (
                            <div key={index} className="flex flex-col items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted ? 'bg-[#0F6CBD] border-[#0F6CBD] text-white' :
                                            isCurrent ? 'bg-white border-[#0F6CBD] text-[#0F6CBD] shadow-lg scale-110' :
                                                'bg-white border-slate-200 text-slate-300'
                                        }`}
                                >
                                    <step.icon className="w-4 h-4" />
                                </div>
                                <div className="text-center">
                                    <p className={`text-xs font-bold mb-1 ${isCurrent ? 'text-[#1E293B]' : 'text-slate-500'}`}>
                                        {step.label}
                                    </p>
                                    <p className="text-[9px] font-bold text-slate-400">{step.date}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 rounded-xl p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <FaMapMarkerAlt className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-xs font-black text-[#1E293B]">Current Location: Chicago Logistics Hub</p>
                        <p className="text-[10px] font-bold text-slate-400">Last updated 2 hours ago</p>
                    </div>
                </div>
                <button className="text-xs font-black text-[#0F6CBD] hover:underline uppercase tracking-wider">
                    Track Live
                </button>
            </div>
        </div>
    );
}
