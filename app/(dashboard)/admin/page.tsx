/**
 * Admin Dashboard Home
 */
import React from 'react';
import {
    TrendingUp,
    Wallet,
    AlertCircle,
    Clock,
    ShieldAlert,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';

const stats = [
    { name: 'Total Platform GMV', value: '₹12.4M', change: '+12.5%', isUp: true, icon: TrendingUp },
    { name: 'Escrow HOLD Balance', value: '₹3.1M', change: '+4.2%', isUp: true, icon: Wallet },
    { name: 'Active Disputes', value: '18', change: '-2', isUp: false, icon: AlertCircle },
    { name: 'Pending Approvals', value: '42', change: '+8', isUp: true, icon: Clock },
];

const AdminDashboard = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-[#2772A0]">System Health & Governance</h1>
                <p className="text-[#1E293B]/60 text-sm font-medium">Overview of platform transactions, trust metrics, and required actions.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <div key={stat.name} className="bg-white/40 backdrop-blur-md border border-[#2772A0]/10 rounded-3xl p-6 hover:border-[#2772A0]/30 transition-all group">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-[#2772A0]/5 border border-[#2772A0]/10 flex items-center justify-center text-[#2772A0] group-hover:scale-110 transition-transform">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-bold text-[#2772A0]">
                                {stat.isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[#2772A0]/60 text-xs font-bold uppercase tracking-wider mb-1">{stat.name}</span>
                            <span className="text-2xl font-bold text-[#1E293B]">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Critical Alerts & Actions Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white/40 border border-[#2772A0]/10 rounded-3xl p-8 backdrop-blur-md">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-xl font-bold text-[#1E293B] flex items-center gap-3">
                            <ShieldAlert className="w-6 h-6 text-[#2772A0]" />
                            Critical Risk Alerts
                        </h2>
                        <button className="text-xs font-bold text-[#2772A0] hover:text-[#1E5F86] transition-colors">View All Risk Logs</button>
                    </div>

                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-white/60 border border-[#2772A0]/5 hover:border-[#2772A0]/30 transition-all group">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#2772A0] shadow-[0_0_8px_rgba(39,114,160,0.4)] animate-pulse" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-bold text-[#1E293B]">High Risk: Pattern Detected</span>
                                        <span className="text-[10px] text-[#2772A0]/40 font-bold uppercase tracking-widest">Order #ORD-99021</span>
                                    </div>
                                    <p className="text-xs text-[#2772A0]/60 font-medium">Manufacturer #MFG-LX9 reported unusual IP spikes from Dealer #DLR-002.</p>
                                </div>
                                <button className="px-4 py-2 rounded-xl bg-[#2772A0] text-[10px] font-bold text-[#CCDDEA] hover:bg-[#1E5F86] transition-all uppercase tracking-wider active:scale-95">Investigate</button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white/40 border border-[#2772A0]/10 rounded-3xl p-8 flex flex-col backdrop-blur-md">
                    <h2 className="text-xl font-bold text-[#1E293B] mb-8">Scheduled Payouts</h2>
                    <div className="flex-1 flex flex-col justify-center items-center text-center p-6 border-2 border-dashed border-[#2772A0]/10 rounded-3xl">
                        <Wallet className="w-12 h-12 text-[#2772A0]/20 mb-4" />
                        <span className="text-2xl font-bold text-[#2772A0]">₹482,900.00</span>
                        <span className="text-xs text-[#1E293B]/40 font-bold mt-2 uppercase tracking-wide">Next automated batch at 12:00 AM UTC</span>
                        <button className="mt-8 w-full py-3 bg-[#2772A0] hover:bg-[#1E5F86] text-[#CCDDEA] font-bold text-sm rounded-xl shadow-lg shadow-[#2772A0]/20 transition-all active:scale-95">Audit Payout Queue</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
