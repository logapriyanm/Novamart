'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { FaPlus, FaUsers, FaLock, FaCheck, FaClock, FaBox } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface CollaborationGroup {
    _id: string;
    name: string;
    description: string;
    category: string;
    targetQuantity: number;
    currentQuantity: number;
    requiredDeliveryDate: string;
    status: string;
    creatorId: { businessName: string };
    participantCount: number;
    createdAt: string;
}

export default function CollaborationPage() {
    const [groups, setGroups] = useState<CollaborationGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [features, setFeatures] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetchFeatures();
        fetchGroups();
    }, []);

    const fetchFeatures = async () => {
        try {
            const res = await apiClient.get<any>('/subscription/features');
            if (res.success) {
                setFeatures(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch features');
        }
    };

    const fetchGroups = async () => {
        try {
            const res = await apiClient.get<any>('/collaboration/groups');
            if (res.success) {
                setGroups(res.data);
            }
        } catch (error) {
            toast.error('Failed to load collaboration groups');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'CREATED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'LOCKED': return 'bg-purple-100 text-purple-700 border-purple-200';
            case 'COMPLETED': return 'bg-gray-100 text-gray-700 border-gray-200';
            case 'CANCELLED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'CREATED': return <FaClock className="w-4 h-4" />;
            case 'ACTIVE': return <FaUsers className="w-4 h-4" />;
            case 'LOCKED': return <FaLock className="w-4 h-4" />;
            case 'COMPLETED': return <FaCheck className="w-4 h-4" />;
            default: return <FaBox className="w-4 h-4" />;
        }
    };

    if (!features?.allowCollaboration) {
        return (
            <div className="min-h-screen flex items-center justify-center p-8">
                <div className="max-w-2xl w-full bg-white rounded-[30px] p-12 text-center border border-slate-100 shadow-xl">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-[20px] flex items-center justify-center mx-auto mb-6">
                        <FaUsers className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-[#1E293B] mb-4 italic uppercase">
                        Enterprise Feature
                    </h1>
                    <p className="text-slate-600 font-bold mb-8">
                        Collaboration groups are available exclusively for ENTERPRISE tier subscribers.
                        Upgrade your subscription to unlock bulk ordering and custom manufacturing capabilities.
                    </p>
                    <button
                        onClick={() => router.push('/dealer/subscription')}
                        className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-[15px] font-black uppercase tracking-wider hover:shadow-2xl transition-all"
                    >
                        Upgrade to Enterprise
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-[#1E293B] tracking-tight mb-2 italic uppercase">
                        Collaboration <span className="text-[#10367D]">Groups</span>
                    </h1>
                    <p className="text-sm font-bold text-slate-500">
                        Pool demand with other dealers for bulk custom manufacturing
                    </p>
                </div>
                <button
                    onClick={() => router.push('/dealer/collaboration/create')}
                    className="flex items-center gap-3 px-6 py-4 bg-[#10367D] text-white rounded-[15px] font-black uppercase tracking-wider hover:shadow-2xl transition-all"
                >
                    <FaPlus className="w-4 h-4" />
                    Create Group
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Groups</p>
                    <p className="text-3xl font-black text-[#10367D]">{groups.length}</p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Active</p>
                    <p className="text-3xl font-black text-green-600">
                        {groups.filter(g => g.status === 'ACTIVE').length}
                    </p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Locked</p>
                    <p className="text-3xl font-black text-purple-600">
                        {groups.filter(g => g.status === 'LOCKED').length}
                    </p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Completed</p>
                    <p className="text-3xl font-black text-gray-600">
                        {groups.filter(g => g.status === 'COMPLETED').length}
                    </p>
                </div>
            </div>

            {/* Groups List */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-12 h-12 border-4 border-[#10367D] border-t-transparent rounded-full mx-auto"></div>
                </div>
            ) : groups.length === 0 ? (
                <div className="bg-white rounded-[30px] p-16 text-center border border-slate-100">
                    <FaUsers className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-800 mb-3 italic uppercase">No Groups Yet</h3>
                    <p className="text-slate-500 font-bold mb-8">
                        Create your first collaboration group to start pooling demand with other dealers
                    </p>
                    <button
                        onClick={() => router.push('/dealer/collaboration/create')}
                        className="px-8 py-4 bg-[#10367D] text-white rounded-[15px] font-black uppercase tracking-wider hover:shadow-2xl transition-all"
                    >
                        Create First Group
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {groups.map((group, idx) => (
                        <motion.div
                            key={group._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => router.push(`/dealer/collaboration/${group._id}`)}
                            className="bg-white rounded-[25px] p-8 border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <h3 className="text-xl font-black text-[#1E293B] mb-2 group-hover:text-[#10367D] transition-colors">
                                        {group.name}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-500 line-clamp-2">
                                        {group.description || 'No description'}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-[10px] border ${getStatusColor(group.status)}`}>
                                    {getStatusIcon(group.status)}
                                    <span className="text-xs font-black uppercase">{group.status}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-slate-50 rounded-[15px] p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                                    <p className="text-sm font-black text-slate-800">{group.category}</p>
                                </div>
                                <div className="bg-slate-50 rounded-[15px] p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Participants</p>
                                    <p className="text-sm font-black text-slate-800">{group.participantCount} dealers</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Progress</span>
                                    <span className="text-xs font-black text-[#10367D]">
                                        {group.currentQuantity} / {group.targetQuantity} units
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#10367D] to-blue-500 transition-all duration-500"
                                        style={{ width: `${Math.min((group.currentQuantity / group.targetQuantity) * 100, 100)}%` }}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between text-xs font-bold text-slate-400">
                                <span>Created by {group.creatorId.businessName}</span>
                                <span>Due: {new Date(group.requiredDeliveryDate).toLocaleDateString()}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
