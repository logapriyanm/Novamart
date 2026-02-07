'use client';

import React from 'react';
import {
    FaBox, FaUsers, FaChartLine, FaClipboardList,
    FaCalendarAlt, FaPlus, FaGlobeAmericas, FaCheckCircle,
    FaArrowUp, FaEllipsisH, FaShieldAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ManufacturerDashboard() {
    return (
        <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">Dashboard Overview</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">Real-time performance and supply chain monitoring.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
                        <FaCalendarAlt className="w-3 h-3" />
                        Last 30 Days
                    </button>
                    <Link href="/manufacturer/products" className="flex items-center gap-2 px-6 py-3 bg-[#0F6CBD] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20">
                        <FaPlus className="w-3 h-3" />
                        New Product
                    </Link>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Card 1 */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                            <FaClipboardList className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">+2 new</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Products</p>
                        <p className="text-3xl font-black text-[#1E293B] mt-1">24</p>
                    </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                            <FaUsers className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">+12%</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Dealers</p>
                        <p className="text-3xl font-black text-[#1E293B] mt-1">156</p>
                    </div>
                </div>

                {/* Card 3 */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                            <FaChartLine className="w-5 h-5" />
                        </div>
                        <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">+4k</span>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Units Sold via Dealers</p>
                        <p className="text-3xl font-black text-[#1E293B] mt-1">12,482</p>
                    </div>
                </div>

                {/* Card 4 */}
                <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col justify-between h-40 relative overflow-hidden group hover:shadow-md transition-all">
                    <div className="flex justify-between items-start">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                            <FaUsers className="w-5 h-5" />
                        </div>
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Pending Dealer Requests</p>
                        <p className="text-3xl font-black text-[#1E293B] mt-1">8</p>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Top Performing Products (Spans 2 cols) */}
                <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black tracking-tight text-[#1E293B]">Top Performing Products</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Sales volume by individual SKU</p>
                        </div>
                        <select className="bg-slate-50 border border-slate-200 text-xs font-bold text-slate-600 rounded-lg px-3 py-2 outline-none">
                            <option>By Volume</option>
                            <option>By Revenue</option>
                        </select>
                    </div>

                    <div className="space-y-6">
                        {/* Product Bar 1 */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                                <span>Ultra-Quiet Desk Fan v2</span>
                                <span>4,200 units</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '85%' }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className="h-full bg-[#0F6CBD] rounded-full"
                                ></motion.div>
                            </div>
                        </div>

                        {/* Product Bar 2 */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                                <span>Smart Thermostat Elite</span>
                                <span>3,850 units</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '70%' }}
                                    transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                                    className="h-full bg-[#479EF5] rounded-full"
                                ></motion.div>
                            </div>
                        </div>

                        {/* Product Bar 3 */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                                <span>Industrial Power Strip (12-Outlet)</span>
                                <span>2,100 units</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '45%' }}
                                    transition={{ duration: 1, delay: 0.4, ease: 'easeOut' }}
                                    className="h-full bg-[#87C6FF] rounded-full"
                                ></motion.div>
                            </div>
                        </div>

                        {/* Product Bar 4 */}
                        <div>
                            <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                                <span>Portable Projector S100</span>
                                <span>940 units</span>
                            </div>
                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '20%' }}
                                    transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
                                    className="h-full bg-[#BDE3FF] rounded-full"
                                ></motion.div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column Stack */}
                <div className="space-y-8">

                    {/* Regional Demand */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-black tracking-tight text-[#1E293B]">Regional Demand</h3>
                        </div>

                        {/* Map Placeholder */}
                        <div className="bg-slate-100 rounded-2xl h-40 flex items-center justify-center relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/World_map_blank_without_borders.svg/2000px-World_map_blank_without_borders.svg.png')] bg-cover bg-center opacity-30 grayscale hover:scale-110 transition-transform duration-700"></div>
                            <div className="relative z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-slate-200">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#1E293B]">N. America: High Demand</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                            <div className="text-center">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Top Region</p>
                                <p className="text-xs font-bold text-[#1E293B] mt-1">California, US</p>
                            </div>
                            <div className="text-center">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Growth Rate</p>
                                <p className="text-xs font-bold text-emerald-600 mt-1">+18.4%</p>
                            </div>
                        </div>
                    </div>

                    {/* Compliance Status */}
                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
                        <div className="mb-6">
                            <h3 className="text-lg font-black tracking-tight text-[#1E293B]">Compliance Status</h3>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                        <FaShieldAlt className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-emerald-800">Business Verified</p>
                                        <p className="text-[9px] font-medium text-emerald-600/70">Profile 100% complete</p>
                                    </div>
                                </div>
                                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>

                            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600">
                                        <FaClipboardList className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-black text-emerald-800">GST Active</p>
                                        <p className="text-[9px] font-medium text-emerald-600/70">Verified Oct 2023</p>
                                    </div>
                                </div>
                                <FaCheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
