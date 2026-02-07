'use client';

import React, { useState } from 'react';
import {
    FaUserCheck, FaStore, FaClock, FaMapMarkerAlt,
    FaCheck, FaTimes, FaFileExport, FaFilter,
    FaChevronLeft, FaChevronRight, FaExternalLinkAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock Data for Dealer Requests
const dealerRequests = [
    {
        id: 1,
        name: 'Global Electronics Hub',
        type: 'Premium Retailer',
        location: 'New York, NY',
        requestedTime: '2h ago',
        logo: 'https://ui-avatars.com/api/?name=Global+Electronics&background=0F6CBD&color=fff&rounded=true&bold=true',
        verified: true,
        categories: [
            { name: 'Home Audio', requested: true },
            { name: 'Smart Home', requested: true },
            { name: 'Wearables', requested: false },
        ]
    },
    {
        id: 2,
        name: 'Alpine Outdoor Equipment',
        type: 'Specialty Boutique',
        location: 'Denver, CO',
        requestedTime: '5h ago',
        logo: 'https://ui-avatars.com/api/?name=Alpine+Outdoor&background=F59E0B&color=fff&rounded=true&bold=true',
        verified: false,
        reviewRequired: true,
        categories: [
            { name: 'Outdoor Tech', requested: true },
        ]
    },
    {
        id: 3,
        name: 'Lumina Retail Group',
        type: 'Nationwide Chain',
        location: 'Seattle, WA',
        requestedTime: '12h ago',
        logo: 'https://ui-avatars.com/api/?name=Lumina+Retail&background=0F6CBD&color=fff&rounded=true&bold=true',
        verified: true,
        categories: [
            { name: 'Kitchen Appliances', requested: true },
            { name: 'Home Decor', requested: true },
        ]
    }
];

export default function DealerRequests() {
    const [activeTab, setActiveTab] = useState('Pending');

    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">Dealer Access Requests</h1>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Review and manage retail partnership applications from the NovaMart network.</p>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Tabs */}
                <div className="flex items-center gap-8 border-b border-slate-200 w-full md:w-auto">
                    <button
                        onClick={() => setActiveTab('Pending')}
                        className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === 'Pending' ? 'text-[#0F6CBD]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Pending <span className="ml-1 bg-blue-100 text-[#0F6CBD] px-1.5 py-0.5 rounded text-[9px]">12</span>
                        {activeTab === 'Pending' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F6CBD]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('Approved')}
                        className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === 'Approved' ? 'text-[#0F6CBD]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Approved
                        {activeTab === 'Approved' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F6CBD]" />}
                    </button>
                    <button
                        onClick={() => setActiveTab('Rejected')}
                        className={`pb-4 text-xs font-black uppercase tracking-widest relative transition-colors ${activeTab === 'Rejected' ? 'text-[#0F6CBD]' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        Rejected
                        {activeTab === 'Rejected' && <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F6CBD]" />}
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <FaFilter className="w-3 h-3" />
                        Filter
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <FaFileExport className="w-3 h-3" />
                        Export
                    </button>
                </div>
            </div>

            {/* Requests List */}
            <div className="space-y-4">
                {dealerRequests.map((dealer) => (
                    <div key={dealer.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 flex flex-col md:flex-row gap-8">
                        {/* Dealer Info */}
                        <div className="flex-1">
                            <div className="flex items-start gap-4">
                                <img src={dealer.logo} alt={dealer.name} className="w-16 h-16 rounded-xl shadow-sm" />
                                <div>
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="text-lg font-black text-[#1E293B]">{dealer.name}</h3>
                                        {dealer.verified && (
                                            <span className="bg-blue-50 text-[#0F6CBD] text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 border border-blue-100">
                                                <FaCheck className="w-2 h-2" /> NovaMart Verified
                                            </span>
                                        )}
                                        {dealer.reviewRequired && (
                                            <span className="bg-amber-50 text-amber-600 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border border-amber-100">
                                                Review Required
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-4 mt-2 text-xs font-bold text-slate-500">
                                        <div className="flex items-center gap-1.5">
                                            <FaMapMarkerAlt className="w-3 h-3 text-slate-400" />
                                            {dealer.location}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaStore className="w-3 h-3 text-slate-400" />
                                            {dealer.type}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <FaClock className="w-3 h-3 text-slate-400" />
                                            Requested {dealer.requestedTime}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8">
                                <button className="text-[10px] font-black uppercase tracking-widest text-[#0F6CBD] hover:underline flex items-center gap-1">
                                    View Dealer Profile <FaExternalLinkAlt className="w-2 h-2" />
                                </button>
                            </div>
                        </div>

                        {/* Requested Categories */}
                        <div className="flex-1 border-l border-slate-100 pl-8 md:pl-8">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">Requested Categories</p>
                            <div className="flex gap-4 flex-wrap">
                                {dealer.categories.map((cat, idx) => (
                                    <label key={idx} className="flex items-center gap-2 cursor-pointer group">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${cat.requested ? 'bg-[#0F6CBD] border-[#0F6CBD]' : 'bg-white border-slate-300'}`}>
                                            {cat.requested && <FaCheck className="w-2 h-2 text-white" />}
                                        </div>
                                        <span className="text-xs font-bold text-[#1E293B] group-hover:text-[#0F6CBD] transition-colors">{cat.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col justify-between items-end border-l border-slate-100 pl-8 md:pl-8 min-w-[200px]">
                            <div></div> {/* Spacer */}
                            <div className="flex items-center gap-3 w-full">
                                <button className="flex-1 py-3 px-4 border border-rose-100 text-rose-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-50 transition-all">
                                    Reject
                                </button>
                                <button className="flex-1 py-3 px-4 bg-[#0F6CBD] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                                    Approve Dealer <FaCheck className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 mt-8">
                <p>Showing 3 of 12 pending requests</p>
                <div className="flex gap-2">
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-50">
                        <FaChevronLeft className="w-3 h-3" />
                    </button>
                    <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all">
                        <FaChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>
        </div>
    );
}
