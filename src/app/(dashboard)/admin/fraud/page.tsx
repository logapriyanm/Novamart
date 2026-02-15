'use client';

import React, { useState, useEffect } from 'react';
import {
    FaShieldAlt,
    FaExclamationTriangle,
    FaArrowLeft,
    FaSpinner
} from 'react-icons/fa';
import Link from 'next/link';

export default function FraudRiskPanel() {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('/api/admin/fraud-signals', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAlerts(data.data || []);
                }
            } catch (err) {
                console.error('Failed to fetch fraud alerts');
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-[#067FF9] hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-[#1E293B] tracking-tight uppercase italic">Risk <span className="text-[#067FF9]">Oversight</span></h1>
                    <p className="text-slate-400 font-medium text-sm mt-1">Anomaly Detection & Prevention</p>
                </div>
            </div>

            <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 lg:p-10 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                    <h2 className="text-sm font-black text-[#1E293B]">Active threat stream</h2>
                    <span className="text-sm font-bold text-slate-400">{alerts.length} signal{alerts.length !== 1 ? 's' : ''}</span>
                </div>

                {loading ? (
                    <div className="p-16 flex items-center justify-center">
                        <FaSpinner className="w-6 h-6 animate-spin text-slate-300" />
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="p-16 flex flex-col items-center justify-center text-center">
                        <FaShieldAlt className="w-16 h-16 text-emerald-100 mb-6" />
                        <h3 className="text-lg font-bold text-slate-300">All clear</h3>
                        <p className="text-sm font-medium text-slate-300 mt-2">No active fraud signals detected. System is operating normally.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-50">
                        {alerts.map((alert: any) => (
                            <div key={alert._id || alert.id} className="p-8 flex items-center justify-between hover:bg-slate-50 transition-all">
                                <div className="flex items-center gap-6">
                                    <div className={`w-14 h-14 rounded-[10px] flex items-center justify-center ${alert.severity === 'CRITICAL' ? 'bg-rose-500/10 text-rose-500' : alert.severity === 'HIGH' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                        <FaExclamationTriangle className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#1E293B]">{alert.type}</h4>
                                        <p className="text-sm font-medium text-slate-400">{alert.description || alert.reason}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-sm font-bold px-2 py-0.5 rounded-[10px] ${alert.severity === 'CRITICAL' ? 'bg-rose-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                        {alert.severity || 'INFO'}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

