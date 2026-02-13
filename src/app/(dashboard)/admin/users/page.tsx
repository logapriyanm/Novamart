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
                        className={`px-6 py-3 rounded-[10px] text-sm font-bold transition-all ${selectedRole === role
                            ? 'bg-primary text-white shadow-md'
                            : 'bg-white text-foreground/40 border border-foreground/10 hover:border-primary/50'
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
                    <div className="hidden md:block bg-white rounded-[10px] border border-foreground/10 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-foreground/10 bg-background/50 flex items-center justify-between">
                            <h2 className="text-sm font-black text-black flex items-center gap-3">
                                <FaUsers className="text-black" />
                                Active Identity Ledger
                            </h2>
                            <p className="text-sm font-bold text-foreground/40">
                                {displayedList.length} Entities Found
                            </p>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-foreground/10">
                                        <th className="px-10 py-5 text-sm font-bold text-foreground/40">User Entity</th>
                                        <th className="px-10 py-5 text-sm font-bold text-foreground/40">Privilege Level</th>
                                        <th className="px-10 py-5 text-sm font-bold text-foreground/40 text-center">Protocol Status</th>
                                        <th className="px-10 py-5 text-sm font-bold text-foreground/40 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {displayedList.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="p-10 text-center text-sm font-bold text-slate-400">
                                                No entities found in this registry.
                                            </td>
                                        </tr>
                                    ) : displayedList.map((user) => (
                                        <tr key={user._id || user.id} className="hover:bg-slate-50 group transition-colors">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-[10px] bg-black flex items-center justify-center text-white text-sm font-black group-hover:scale-110 transition-transform">
                                                        {(user.name || user.email || 'U').substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-black leading-none">{user.name || 'Unknown User'}</p>
                                                        <p className="text-sm font-bold text-foreground/40 mt-1.5">{user.email || 'No Email'}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-2">
                                                    {user.role === 'ADMIN' ? (
                                                        <Tooltip content="Administrator - Full Access">
                                                            <FaUserShield className="text-black w-3 h-3 cursor-help" />
                                                        </Tooltip>
                                                    ) : user.role === 'SELLER' ? (
                                                        <Tooltip content="Authorized Seller">
                                                            <FaStore className="text-black w-3 h-3 cursor-help" />
                                                        </Tooltip>
                                                    ) : user.role === 'MANUFACTURER' ? (
                                                        <Tooltip content="Verified Manufacturer">
                                                            <FaIndustry className="text-black w-3 h-3 cursor-help" />
                                                        </Tooltip>
                                                    ) : (
                                                        <Tooltip content="Standard Customer">
                                                            <FaUserTie className="text-black w-3 h-3 cursor-help" />
                                                        </Tooltip>
                                                    )}
                                                    <span className="text-sm font-bold text-black">{user.role}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className={`inline-flex items-center px-4 py-1.5 rounded-[10px] text-sm font-bold ${(user.status === 'Active' || user.isVerified) ? 'bg-emerald-100 text-emerald-700' :
                                                    (user.status === 'Banned' || user.isVerified === false) ? 'bg-rose-100 text-rose-700' :
                                                        'bg-amber-100 text-amber-700'
                                                    }`}>
                                                    {user.status || (user.isVerified ? 'Active' : 'Pending')}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    {(selectedRole === 'MANUFACTURER' || selectedRole === 'SELLER') && !user.isVerified && (
                                                        <button
                                                            onClick={() => handleVerifyClick(user, selectedRole as any)}
                                                            className="btn-primary"
                                                        >
                                                            Verify
                                                        </button>
                                                    )}
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
