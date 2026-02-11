'use client';

import React, { useEffect, useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { FaClock, FaCheck, FaTimes, FaCog, FaUsers, FaUser } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface CustomOrder {
    _id: string;
    productName: string;
    productCategory: string;
    requestType: string;
    status: string;
    totalQuantity: number;
    requiredDeliveryDate: string;
    dealerId?: { businessName: string };
    collaborationGroupId?: { name: string; participantCount: number };
    customSpecifications: any;
    createdAt: string;
}

export default function ManufacturerCustomOrdersPage() {
    const [orders, setOrders] = useState<CustomOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await apiClient.get<any>('/custom-manufacturing/incoming');
            if (res.success) {
                setOrders(res.data);
            }
        } catch (error) {
            toast.error('Failed to load custom orders');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'REQUESTED': return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'NEGOTIATING': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'APPROVED': return 'bg-green-100 text-green-700 border-green-200';
            case 'IN_PRODUCTION': return 'bg-purple-100 text-purple-700 border-purple-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    const filteredOrders = orders.filter(order =>
        filter === 'ALL' || order.status === filter
    );

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-black text-[#1E293B] tracking-tight mb-2 italic uppercase">
                    Custom <span className="text-[#10367D]">Manufacturing Orders</span>
                </h1>
                <p className="text-sm font-bold text-slate-500">
                    Review and respond to custom product requests from dealers
                </p>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {['ALL', 'REQUESTED', 'NEGOTIATING', 'APPROVED', 'IN_PRODUCTION'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-6 py-3 rounded-[10px] font-black uppercase tracking-wider text-xs whitespace-nowrap transition-all ${filter === status
                                ? 'bg-[#10367D] text-white shadow-lg'
                                : 'bg-white text-slate-600 border border-slate-200 hover:border-[#10367D]'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">New Requests</p>
                    <p className="text-3xl font-black text-blue-600">
                        {orders.filter(o => o.status === 'REQUESTED').length}
                    </p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Negotiating</p>
                    <p className="text-3xl font-black text-yellow-600">
                        {orders.filter(o => o.status === 'NEGOTIATING').length}
                    </p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">In Production</p>
                    <p className="text-3xl font-black text-purple-600">
                        {orders.filter(o => o.status === 'IN_PRODUCTION').length}
                    </p>
                </div>
                <div className="bg-white rounded-[20px] p-6 border border-slate-100">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Total Orders</p>
                    <p className="text-3xl font-black text-[#10367D]">{orders.length}</p>
                </div>
            </div>

            {/* Orders List */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin w-12 h-12 border-4 border-[#10367D] border-t-transparent rounded-full mx-auto"></div>
                </div>
            ) : filteredOrders.length === 0 ? (
                <div className="bg-white rounded-[30px] p-16 text-center border border-slate-100">
                    <FaCog className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-slate-800 mb-3 italic uppercase">
                        {filter === 'ALL' ? 'No Custom Orders' : `No ${filter} Orders`}
                    </h3>
                    <p className="text-slate-500 font-bold">
                        {filter === 'ALL'
                            ? 'You have no custom manufacturing orders yet'
                            : `You don't have any ${filter.toLowerCase()} orders`
                        }
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredOrders.map((order, idx) => (
                        <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            onClick={() => router.push(`/manufacturer/custom-orders/${order._id}`)}
                            className="bg-white rounded-[25px] p-8 border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        {order.requestType === 'GROUP' ? (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-[10px]">
                                                <FaUsers className="w-3 h-3" />
                                                <span className="text-xs font-black uppercase">Bulk Order</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-[10px]">
                                                <FaUser className="w-3 h-3" />
                                                <span className="text-xs font-black uppercase">Individual</span>
                                            </div>
                                        )}
                                    </div>
                                    <h3 className="text-xl font-black text-[#1E293B] mb-2 group-hover:text-[#10367D] transition-colors">
                                        {order.productName}
                                    </h3>
                                    <p className="text-sm font-bold text-slate-500">
                                        {order.productCategory}
                                    </p>
                                </div>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-[10px] border ${getStatusColor(order.status)}`}>
                                    <span className="text-xs font-black uppercase">{order.status.replace('_', ' ')}</span>
                                </div>
                            </div>

                            {/* Client Info */}
                            <div className="bg-slate-50 rounded-[15px] p-4 border border-slate-100 mb-4">
                                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Client</p>
                                {order.requestType === 'GROUP' && order.collaborationGroupId ? (
                                    <div>
                                        <p className="text-sm font-black text-slate-800">{order.collaborationGroupId.name}</p>
                                        <p className="text-xs text-slate-500 font-bold">
                                            {order.collaborationGroupId.participantCount} dealers collaborating
                                        </p>
                                    </div>
                                ) : order.dealerId ? (
                                    <p className="text-sm font-black text-slate-800">{order.dealerId.businessName}</p>
                                ) : (
                                    <p className="text-sm text-slate-500">Unknown</p>
                                )}
                            </div>

                            {/* Order Details */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-slate-50 rounded-[15px] p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Quantity</p>
                                    <p className="text-lg font-black text-[#10367D]">{order.totalQuantity} units</p>
                                </div>
                                <div className="bg-slate-50 rounded-[15px] p-4 border border-slate-100">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Required By</p>
                                    <p className="text-sm font-black text-slate-800">
                                        {new Date(order.requiredDeliveryDate).toLocaleDateString('en-IN', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>

                            {order.status === 'REQUESTED' && (
                                <div className="mt-6 pt-6 border-t border-slate-100">
                                    <p className="text-xs font-black text-[#10367D] uppercase tracking-widest text-center">
                                        Click to review and respond →
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
