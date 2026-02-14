'use client';

import React, { useState, useEffect } from 'react';
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
    FaFilter,
    FaCheckCircle
} from 'react-icons/fa';
import Link from 'next/link';
import { adminService } from '@/lib/api/services/admin.service';
import UserVerificationModal from '@/client/components/features/admin/UserVerificationModal';
import Loader from '@/client/components/ui/Loader';
import TableSkeleton from '@/client/components/ui/TableSkeleton';
import Tooltip from '@/client/components/ui/Tooltip';
import UserCard from '@/client/components/features/admin/UserCard';
import { toast } from 'sonner';

export default function UserManagementPortal() {
    const [selectedRole, setSelectedRole] = useState('ALL');
    const [users, setUsers] = useState<any[]>([]);
    const [manufacturers, setManufacturers] = useState<any[]>([]);
    const [sellers, setSellers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Verification State
    const [verifyModalOpen, setVerifyModalOpen] = useState(false);
    const [selectedEntity, setSelectedEntity] = useState<any>(null);
    const [entityType, setEntityType] = useState<'MANUFACTURER' | 'SELLER'>('MANUFACTURER');

    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [usersData, mfgData, sellersData] = await Promise.all([
                adminService.getUsers(),
                adminService.getManufacturers(),
                adminService.getDealers() // Service still uses getDealers
            ]);
            setUsers(usersData || []);
            setManufacturers(mfgData || []);
            setSellers(sellersData || []);
        } catch (error) {
            console.error('Failed to fetch user data', error);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyClick = (entity: any, type: 'MANUFACTURER' | 'SELLER') => {
        setSelectedEntity(entity);
        setEntityType(type);
        setVerifyModalOpen(true);
    };

    const confirmVerification = async (isVerified: boolean) => {
        try {
            if (entityType === 'MANUFACTURER') {
                await adminService.verifyManufacturer(selectedEntity._id || selectedEntity.id, isVerified);
            } else {
                await adminService.verifyDealer(selectedEntity._id || selectedEntity.id, isVerified); // Service uses verifyDealer
            }
            toast.success(`${entityType} ${isVerified ? 'Verified' : 'Rejected'} Successfully`);
            fetchAllData(); // Refresh list
        } catch (error) {
            toast.error('Action Failed');
            throw error;
        }
    };

    // Derived list based on selected tab
    const getDisplayedUsers = () => {
        if (selectedRole === 'ALL') return users;
        if (selectedRole === 'MANUFACTURER') return manufacturers.map(m => ({
            ...m,
            name: m.companyName,
            role: 'MANUFACTURER',
            email: m.user?.email, // Assuming relation exists from fetch
            status: m.isVerified ? 'Active' : 'Under Review'
        }));
        if (selectedRole === 'SELLER') return sellers.map(s => ({
            ...s,
            name: s.businessName,
            role: 'SELLER',
            email: s.user?.email,
            status: s.isVerified !== false ? 'Active' : 'Under Review'
        }));
        return users.filter(u => u.role === selectedRole);
    };

    const displayedList = getDisplayedUsers();

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col gap-2">
                <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-black hover:translate-x-[-4px] transition-transform">
                    <FaArrowLeft className="w-3 h-3" />
                    Back to Mission Control
                </Link>
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-black tracking-tight uppercase italic">Identity Oversight</h1>
                        <p className="text-foreground/40 font-bold text-sm mt-1">Global User Directory & Privilege Governance</p>
                    </div>
                </div>
            </div>

            {/* Quick Role Filters */}
            <div className="flex flex-wrap gap-3">
                {['ALL', 'ADMIN', 'SELLER', 'MANUFACTURER', 'CUSTOMER'].map((role) => (
                    <button
                        key={role}
                        onClick={() => setSelectedRole(role)}
                        className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-all border ${selectedRole === role
                            ? 'bg-black text-white border-black shadow-md'
                            : 'bg-white text-black border-slate-200 hover:border-black'
                            }`}
                    >
                        {role === 'SELLER' || role === 'MANUFACTURER' || role === 'CUSTOMER' || role === 'ADMIN' ? role + 'S' : role}
                    </button>
                ))}
            </div>

            {loading ? (
                <TableSkeleton />
            ) : (
                <>
                    {/* Mobile Card View */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {displayedList.map((user) => (
                            <UserCard
                                key={user._id || user.id}
                                user={user}
                                selectedRole={selectedRole}
                                onVerify={handleVerifyClick}
                            />
                        ))}
                        {displayedList.length === 0 && (
                            <div className="p-8 text-center bg-white rounded-[10px] border border-slate-100 shadow-sm">
                                <p className="text-sm font-bold text-slate-400">No users found</p>
                            </div>
                        )}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                                <FaUsers className="text-slate-500" />
                                Active Identity Ledger
                            </h2>
                            <p className="text-xs font-medium text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200">
                                {displayedList.length} Entities Found
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-slate-200 bg-slate-50/50">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 tracking-wider">User Entity</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 tracking-wider">Privilege Level</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 tracking-wider text-center">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 tracking-wider text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {displayedList.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-10 text-center text-sm text-slate-500">
                                                No entities found in this registry.
                                            </td>
                                        </tr>
                                    ) : displayedList.map((user) => (
                                        <tr key={user._id || user.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 text-xs font-bold">
                                                        {(user.name || user.email || 'U').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-slate-900 leading-none">{user.name || 'Unknown User'}</p>
                                                        <p className="text-xs text-slate-500 mt-1">{user.email || 'No Email'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    {user.role === 'ADMIN' ? (
                                                        <FaUserShield className="text-slate-400 w-3 h-3" />
                                                    ) : user.role === 'SELLER' ? (
                                                        <FaStore className="text-slate-400 w-3 h-3" />
                                                    ) : user.role === 'MANUFACTURER' ? (
                                                        <FaIndustry className="text-slate-400 w-3 h-3" />
                                                    ) : (
                                                        <FaUserTie className="text-slate-400 w-3 h-3" />
                                                    )}
                                                    <span className="text-sm text-slate-700 capitalize">{user.role?.toLowerCase()}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${(user.status === 'Active' || user.isVerified) ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                                    (user.status === 'Banned' || user.isVerified === false) ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                                        'bg-amber-50 text-amber-700 border border-amber-100'
                                                    }`}>
                                                    {user.status || (user.isVerified ? 'Active' : 'Pending')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(selectedRole === 'MANUFACTURER' || selectedRole === 'SELLER') && !user.isVerified && (
                                                        <button
                                                            onClick={() => handleVerifyClick(user, selectedRole as any)}
                                                            className="px-3 py-1.5 bg-slate-900 text-white text-xs font-medium rounded-md hover:bg-slate-800 transition-colors"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
                                                    <button className="text-slate-400 hover:text-slate-600 transition-colors">
                                                        <FaEllipsisV className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}

            <UserVerificationModal
                isOpen={verifyModalOpen}
                onClose={() => setVerifyModalOpen(false)}
                onConfirm={confirmVerification}
                user={selectedEntity}
                type={entityType}
            />
        </div>
    );
}
