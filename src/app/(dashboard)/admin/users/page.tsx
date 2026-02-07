'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUsers,
    FaUserShield,
    FaUserTie,
    FaStore,
    FaIndustry,
    FaSearch,
    FaArrowLeft,
    FaRegClock,
    FaBan,
    FaKey,
    FaEllipsisV,
    FaFilter
} from 'react-icons/fa';
import Link from 'next/link';

const systemUsers = [
    { id: 'USR-001', name: 'Alex Thompson', role: 'ADMIN', email: 'alex.t@novamart.gov', status: 'Active', activity: '2m ago', avatar: 'AT' },
    { id: 'USR-042', name: 'Elite Electronics', role: 'DEALER', email: 'ops@elite-mumbai.com', status: 'Active', activity: '1h ago', avatar: 'EE' },
    { id: 'USR-089', name: 'Nexus Appliance Corp', role: 'MANUFACTURER', email: 'nexus.factory@nexus.com', status: 'Under Review', activity: 'Yesterday', avatar: 'NA' },
    { id: 'USR-112', name: 'Sanjay Kumar', role: 'CUSTOMER', email: 'sanjay.k@gmail.com', status: 'Banned', activity: '3d ago', avatar: 'SK' },
];

export default function UserManagementPortal() {
    const [selectedRole, setSelectedRole] = useState('ALL');

    const filteredUsers = selectedRole === 'ALL'
        ? systemUsers
        : systemUsers.filter(u => u.role === selectedRole);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-[#1E293B] tracking-tight">Identity <span className="text-[#10367D]">Oversight</span></h1>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Global User Directory & Privilege Governance</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="relative w-64">
                            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-3 h-3" />
                            <input type="text" placeholder="Search identities..." className="w-full bg-white border border-slate-100 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-[#10367D]/30 shadow-sm" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Role Filters */}
            <div className="flex flex-wrap gap-3">
                {['ALL', 'ADMIN', 'DEALER', 'MANUFACTURER', 'CUSTOMER'].map((role) => (
                    <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedRole === role
                                ? 'bg-[#10367D] text-white shadow-xl shadow-[#10367D]/20 scale-105'
                                : 'bg-white text-slate-400 border border-slate-100 hover:border-[#10367D]/20'
                            }`}
                    >
                        {role}S
                    </button>
                ))}
            </div>

            {/* User Directory Table */}
            <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-black text-[#1E293B] uppercase tracking-widest flex items-center gap-3">
                        <FaUsers className="text-[#10367D]" />
                        Active Identity Ledger
                    </h2>
                    <button className="text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:underline flex items-center gap-2">
                        <FaFilter className="w-3 h-3" />
                        Advanced Audit Filters
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">User Entity</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Privilege Level</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Protocol Status</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Last Handshake</th>
                                <th className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-slate-50 group transition-colors">
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-2xl bg-[#10367D] flex items-center justify-center text-white text-xs font-black shadow-lg shadow-[#10367D]/10 group-hover:scale-110 transition-transform">
                                                {user.avatar}
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#1E293B] leading-none">{user.name}</p>
                                                <p className="text-[10px] font-bold text-slate-400 mt-1.5">{user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6">
                                        <div className="flex items-center gap-2">
                                            {user.role === 'ADMIN' ? <FaUserShield className="text-[#10367D] w-3 h-3" /> :
                                                user.role === 'DEALER' ? <FaStore className="text-[#10367D] w-3 h-3" /> :
                                                    user.role === 'MANUFACTURER' ? <FaIndustry className="text-[#10367D] w-3 h-3" /> :
                                                        <FaUserTie className="text-[#10367D] w-3 h-3" />}
                                            <span className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">{user.role}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-wider ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                                                user.status === 'Banned' ? 'bg-rose-100 text-rose-700' :
                                                    'bg-amber-100 text-amber-700'
                                            }`}>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-10 py-6 text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-xs font-bold text-slate-600">{user.activity}</span>
                                            <span className="text-[8px] font-black text-slate-400 uppercase mt-0.5 tracking-widest">Via Web-Terminal</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button title="Reset Auth" className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-[#10367D] hover:text-white transition-all"><FaKey className="w-3.5 h-3.5" /></button>
                                            <button title="Ban User" className="w-10 h-10 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"><FaBan className="w-3.5 h-3.5" /></button>
                                            <button title="More Options" className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-slate-200 transition-all"><FaEllipsisV className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-10 border-t border-slate-50 bg-slate-50/50 flex justify-center">
                    <p className="text-[10px] font-black text-slate-400 flex items-center gap-2 uppercase tracking-[0.2em]">
                        <FaRegClock className="text-[#10367D]" />
                        Showing {filteredUsers.length} identities from NovaMart Global Directory
                    </p>
                </div>
            </div>
        </div>
    );
}

