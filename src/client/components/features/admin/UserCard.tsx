import React from 'react';
import {
    FaUserShield,
    FaStore,
    FaIndustry,
    FaUserTie,
    FaEnvelope,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';
import Tooltip from '@/client/components/ui/Tooltip';

interface UserCardProps {
    user: any;
    selectedRole: string;
    onVerify: (user: any, role: any) => void;
}

export default function UserCard({ user, selectedRole, onVerify }: UserCardProps) {
    const roleIcon = user.role === 'ADMIN' ? <FaUserShield className="text-black w-3 h-3" /> :
        user.role === 'DEALER' ? <FaStore className="text-black w-3 h-3" /> :
            user.role === 'MANUFACTURER' ? <FaIndustry className="text-black w-3 h-3" /> :
                <FaUserTie className="text-black w-3 h-3" />;

    const statusColor = (user.status === 'Active' || user.isVerified) ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
        (user.status === 'Banned' || user.isVerified === false) ? 'text-rose-600 bg-rose-50 border-rose-100' :
            'text-amber-600 bg-amber-50 border-amber-100';

    return (
        <div className="bg-white rounded-[10px] border border-slate-100 p-4 shadow-sm flex flex-col gap-4">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-[10px] bg-black flex items-center justify-center text-white text-xs font-black shadow-sm">
                        {(user.name || user.email || 'U').substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-sm font-black text-slate-900 leading-tight">{user.name || 'Unknown'}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{user.email}</p>
                    </div>
                </div>
                <div className={`px-2 py-1 rounded-[5px] border ${statusColor} text-[9px] font-black uppercase tracking-wider`}>
                    {user.status || (user.isVerified ? 'Active' : 'Pending')}
                </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                <div className="flex items-center gap-2 bg-slate-50 px-2 py-1 rounded-[5px] border border-slate-100">
                    {roleIcon}
                    <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{user.role}</span>
                </div>

                {(selectedRole === 'MANUFACTURER' || selectedRole === 'DEALER') && !user.isVerified && (
                    <button
                        onClick={() => onVerify(user, selectedRole)}
                        className="ml-auto px-3 py-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest rounded-[5px] hover:bg-slate-800 transition-colors shadow-sm"
                    >
                        Verify
                    </button>
                )}
            </div>
        </div>
    );
}
