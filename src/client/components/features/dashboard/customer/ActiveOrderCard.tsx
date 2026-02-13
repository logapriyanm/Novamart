'use client';

import React, { useEffect, useState } from 'react';
import { FaTruck, FaCheck, FaBoxOpen, FaHome, FaMapMarkerAlt, FaShoppingBag } from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { useRouter } from 'next/navigation';

export default function ActiveOrderCard() {
    const [activeOrder, setActiveOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orders = await apiClient.get<any[]>('/orders/my');
                // Find first order that is NOT delivered or cancelled
                const active = orders?.find((o: any) => !['DELIVERED', 'CANCELLED', 'RETURNED'].includes(o.status));
                setActiveOrder(active || null);
            } catch (err) {
                console.error('Failed to fetch active orders:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return (
            <div className="bg-white p-8 rounded-[10px] shadow-sm border border-slate-100 flex items-center justify-center h-48 animate-pulse">
                <div className="text-slate-400 text-sm font-bold">Loading Active Order...</div>
            </div>
        );
    }

    if (!activeOrder) {
        return (
            <div className="bg-white p-8 rounded-[10px] shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <FaShoppingBag className="w-8 h-8" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800">No Active Orders</h3>
                    <p className="text-slate-400 text-sm mt-1">Start shopping to track your delivery here.</p>
                </div>
                <button
                    onClick={() => router.push('/products')}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-[10px] text-sm font-bold hover:bg-blue-700 transition-colors"
                >
                    Browse Products
                </button>
            </div>
        );
    }

    // Determine current step based on status
    const getStepStatus = (stepLabel: string) => {
        const status = activeOrder.status;
        const timeline = activeOrder.timeline || []; // Assuming timeline exists or we fallback

        // Map status to steps
        // Steps: Ordered, Processing, In Transit, Delivered

        // If status is PENDING, only 'Ordered' is completed/current?
        // Let's simplify:
        const stepOrder = ['Ordered', 'Processing', 'In Transit', 'Delivered'];
        const currentStepIndex = stepOrder.indexOf(mapStatusToStep(status));
        const thisStepIndex = stepOrder.indexOf(stepLabel);

        if (thisStepIndex < currentStepIndex) return 'completed';
        if (thisStepIndex === currentStepIndex) return 'current';
        return 'pending';
    };

    const mapStatusToStep = (status: string) => {
        switch (status) {
            case 'PENDING': return 'Processing'; // Already ordered
            case 'PROCESSING': return 'Processing';
            case 'SHIPPED': return 'In Transit';
            case 'DELIVERED': return 'Delivered';
            default: return 'Ordered';
        }
    };

    const steps = [
        { label: 'Ordered', status: getStepStatus('Ordered'), icon: FaCheck },
        { label: 'Processing', status: getStepStatus('Processing'), icon: FaBoxOpen },
        { label: 'In Transit', status: getStepStatus('In Transit'), icon: FaTruck },
        { label: 'Delivered', status: getStepStatus('Delivered'), icon: FaHome },
    ];

    // Calculate progress percentage
    const currentStepIndex = steps.findIndex(s => s.status === 'current');
    const progress = currentStepIndex === -1 ? 100 : (currentStepIndex / (steps.length - 1)) * 100;

    return (
        <div className="bg-white p-8 rounded-[10px] shadow-sm border border-slate-100 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0F6CBD]">
                        <FaTruck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#1E293B]">Order #{activeOrder.id ? `NM-${activeOrder.id.slice(0, 5).toUpperCase()}` : '...'}</h3>
                        <p className="text-xs font-bold text-slate-400">{activeOrder.items?.length} Items · ₹{Number(activeOrder.totalAmount).toLocaleString()}</p>
                    </div>
                </div>
                <span className={`px-4 py-1.5 rounded-full text-xs font-bold border ${activeOrder.status === 'SHIPPED' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                    {activeOrder.status}
                </span>
            </div>

            {/* Progress Bar */}
            <div className="relative px-4 py-4">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-[#0F6CBD] -translate-y-1/2 z-0 transition-all duration-1000"
                    style={{ width: `${progress}%` }}
                ></div>

                <div className="relative z-10 flex justify-between w-full">
                    {steps.map((step, index) => {
                        const isCompleted = step.status === 'completed';
                        const isCurrent = step.status === 'current';

                        return (
                            <div key={index} className="flex flex-col items-center gap-3">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${isCompleted ? 'bg-[#0F6CBD] border-[#0F6CBD] text-white' :
                                        isCurrent ? 'bg-white border-[#0F6CBD] text-[#0F6CBD] shadow-lg scale-110' :
                                            'bg-white border-slate-200 text-slate-300'
                                        }`}
                                >
                                    <step.icon className="w-4 h-4" />
                                </div>
                                <div className="text-center">
                                    <p className={`text-xs font-bold mb-1 ${isCurrent ? 'text-[#1E293B]' : 'text-slate-500'}`}>
                                        {step.label}
                                    </p>
                                    {/* Dates omitted for now as they are complex to map without processed timeline */}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 rounded-[10px] p-4 flex items-center justify-between border border-slate-100">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-white rounded-[10px] flex items-center justify-center text-slate-400 shadow-sm border border-slate-100">
                        <FaMapMarkerAlt className="w-4 h-4" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-[#1E293B]">Delivery Address</p>
                        <p className="text-xs font-medium text-slate-400 line-clamp-1">{activeOrder.shippingAddress || 'Address on file'}</p>
                    </div>
                </div>
                <button
                    onClick={() => router.push(`/customer/orders`)}
                    className="text-sm font-bold text-[#0F6CBD] hover:underline"
                >
                    View Details
                </button>
            </div>
        </div>
    );
}
