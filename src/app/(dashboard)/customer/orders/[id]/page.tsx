'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaBox, FaStore, FaClock, FaMoneyBillWave, FaMapMarkerAlt, FaTruck, FaStar } from 'react-icons/fa';
import ChatWidget from '@/client/components/features/chat/ChatWidget';

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    // const { showSnackbar } = useSnackbar();
    const [order, setOrder] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                // Assuming we have an endpoint for single order.
                // If not, we might need to filter from all orders or create getOrderById.
                // Let's assume /orders/:id exists or use /orders and filter.
                // Actually, backend usually has getOrderById. 
                // Let's try to fetch from /orders/:id (Need to verify route exists)
                // If not, we might need to add it.
                // Checked dealerController, it has confirmOrder etc, but Customer order fetch?
                // customerController usually handles this.
                // Assuming endpoint exists for now. If failure, I will fix backend.
                const data = await apiClient.get(`/orders/${params.id}`);
                setOrder(data);
            } catch (error) {
                console.error('Failed to fetch order:', error);
                // Fallback for demo/dev if endpoint missing
                // toast.error('Failed to load order');
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchOrder();
        }
    }, [params.id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'CANCELLED': return 'bg-red-50 text-red-600 border-red-100';
            case 'SHIPPED': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'CONFIRMED': return 'bg-amber-50 text-amber-600 border-amber-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    if (isLoading) {
        return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    if (!order) {
        return (
            <div className="min-h-screen pt-32 flex flex-col items-center justify-center text-slate-400">
                <FaBox size={48} className="mb-4 opacity-50" />
                <p>Order not found</p>
                <button onClick={() => router.back()} className="mt-4 text-primary hover:underline">Go Back</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-20 animate-fade-in spacing-y-8">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => router.back()} className="w-10 h-10 rounded-[10px] bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-all">
                    <FaArrowLeft size={14} />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className={`ml-auto px-4 py-2 rounded-[10px] border text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${getStatusColor(order.status)}`}>
                    <FaBox size={12} />
                    {order.status}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-[10px] p-8 shadow-xl shadow-blue-600/5 border border-slate-100">
                        <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2">
                            <FaBox className="text-primary" /> Order Items
                        </h2>
                        <div className="space-y-6">
                            {order.items?.map((item: any) => (
                                <div key={item.id} className="flex gap-6 items-start">
                                    <div className="w-20 h-20 bg-slate-50 rounded-[10px] flex-shrink-0" />
                                    <div className="flex-1">
                                        <h3 className="font-bold text-slate-800">{item.product?.name || 'Product Name'}</h3>
                                        <p className="text-sm text-slate-500 mt-1">Qty: {item.quantity} × ₹{item.price}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-800 mb-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                                        {order.status === 'DELIVERED' && (
                                            <button
                                                onClick={() => router.push(`/orders/${order.id}/review?productId=${item.product?.id}`)}
                                                className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 hover:underline"
                                            >
                                                Rate & Review
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-100 mt-6 pt-6 flex justify-between items-end">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Amount</p>
                            <p className="text-2xl font-black text-primary">₹{order.totalAmount.toLocaleString('en-IN')}</p>
                        </div>
                    </div>

                    {/* Escrow & Trust Section */}
                    {order.escrow && (
                        <div className="bg-white rounded-[10px] p-8 shadow-xl shadow-blue-600/5 border border-slate-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <FaMoneyBillWave size={100} className={
                                    order.escrow.status === 'RELEASED' ? 'text-emerald-500' :
                                        order.escrow.status === 'FROZEN' ? 'text-rose-500' : 'text-blue-500'
                                } />
                            </div>

                            <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                                <FaMoneyBillWave className="text-primary" /> Secure Payment (Escrow)
                            </h2>

                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className={`px-4 py-2 rounded-[10px] text-xs font-black uppercase tracking-widest border ${order.escrow.status === 'RELEASED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                        order.escrow.status === 'FROZEN' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                            'bg-blue-50 text-blue-600 border-blue-100'
                                        }`}>
                                        Status: {order.escrow.status}
                                    </div>
                                    <p className="text-sm text-slate-500">
                                        Funds are held securely until delivery is confirmed.
                                    </p>
                                </div>

                                {order.escrow.status === 'HOLD' && (
                                    <div className="p-4 bg-slate-50 rounded-[10px] border border-slate-100">
                                        <h4 className="font-bold text-slate-800 mb-2">Buyer Protection Actions</h4>
                                        <div className="flex gap-4">
                                            {order.status === 'DELIVERED' && (
                                                <button
                                                    onClick={async () => {
                                                        try {
                                                            await apiClient.post('/escrow/confirm-delivery', { orderId: order.id });
                                                            toast.success('Delivery confirmed! Funds released.');
                                                            setTimeout(() => window.location.reload(), 1500);
                                                        } catch (err) {
                                                            toast.error('Failed to confirm delivery');
                                                        }
                                                    }}
                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-lg text-xs font-bold hover:bg-emerald-600 transition-colors"
                                                >
                                                    Confirm Delivery & Release Funds
                                                </button>
                                            )}
                                            <button
                                                onClick={() => {
                                                    // Simple prompt for now, ideally a modal
                                                    const reason = prompt('Please enter reason for refund/dispute:');
                                                    if (reason) {
                                                        apiClient.post('/escrow/request-refund', { orderId: order.id, reason })
                                                            .then(() => {
                                                                toast.success('Dispute raised. Admin will review.');
                                                                setTimeout(() => window.location.reload(), 1500);
                                                            })
                                                            .catch(() => toast.error('Failed to raise dispute'));
                                                    }
                                                }}
                                                className="px-4 py-2 bg-white border border-rose-200 text-rose-500 rounded-lg text-xs font-bold hover:bg-rose-50 transition-colors"
                                            >
                                                Report Issue / Request Refund
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Timeline / Journey */}
                    <div className="bg-white rounded-[10px] p-8 shadow-xl shadow-blue-600/5 border border-slate-100">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-lg font-black text-slate-800 flex items-center gap-2">
                                <FaTruck className="text-primary" /> Delivery Journey
                            </h2>
                            {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                                <button
                                    onClick={async () => {
                                        await apiClient.post(`/orders/${order.id}/simulate-tracking`, {});
                                        toast.info('Tracking simulation started!');
                                        setTimeout(() => window.location.reload(), 2000);
                                    }}
                                    className="text-[10px] font-black uppercase tracking-widest bg-slate-900 text-white px-4 py-2 rounded-[10px] hover:bg-black transition-all"
                                >
                                    Simulate Journey
                                </button>
                            )}
                        </div>

                        <div className="relative space-y-10 pl-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                            {order.timeline && order.timeline.length > 0 ? (
                                [...order.timeline].reverse().map((event: any, idx: number) => (
                                    <div key={event.id} className="relative">
                                        <div className={`absolute -left-[30px] top-1 w-6 h-6 rounded-full border-4 border-white shadow-md flex items-center justify-center ${idx === 0 ? 'bg-primary' : 'bg-slate-200'}`}>
                                            <div className="w-1.5 h-1.5 rounded-full bg-white" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-black text-slate-800 flex items-center gap-2">
                                                {event.toState}
                                                <span className="text-[10px] font-bold text-slate-400 ml-auto">
                                                    {new Date(event.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </h4>
                                            <p className="text-xs text-slate-500 mt-1 font-medium">{event.reason}</p>
                                            {event.metadata && Object.keys(event.metadata).length > 0 && (
                                                <div className="mt-3 p-4 bg-slate-50 rounded-[10px] border border-slate-100">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {Object.entries(event.metadata).map(([key, val]: [string, any]) => (
                                                            <div key={key}>
                                                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{key}</p>
                                                                <p className="text-xs font-bold text-slate-800">{val}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-xs font-bold text-slate-400 italic">No tracking updates yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Dealer Info */}
                    <div className="bg-white rounded-[10px] p-8 shadow-xl shadow-blue-600/5 border border-slate-100">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Sold By</h3>
                            {order.status === 'DELIVERED' && (
                                <button
                                    onClick={() => router.push(`/orders/${order.id}/review`)}
                                    className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-amber-600 flex items-center gap-1"
                                >
                                    <FaStar /> Rate Seller
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <FaStore />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800">{order.dealer?.businessName || 'Dealer Name'}</p>
                                <p className="text-xs text-slate-500">Verified Seller</p>
                            </div>
                        </div>

                        {/* Chat Widget integrated/Button */}
                        <div className="relative z-50">
                            <ChatWidget
                                productId={order.id}
                                dealerId={order.dealer?.userId || 'dealer-id'}
                                dealerName={order.dealer?.businessName || 'Seller'}
                                contextType="ORDER"
                            />
                        </div>
                    </div>

                    {/* Shipping Info */}
                    <div className="bg-white rounded-[10px] p-8 shadow-xl shadow-blue-600/5 border border-slate-100">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Shipping Details</h3>
                        <div className="space-y-4">
                            <div className="flex gap-3">
                                <FaMapMarkerAlt className="text-slate-400 mt-1" />
                                <div>
                                    <p className="font-bold text-slate-800">Delivery Address</p>
                                    <p className="text-sm text-slate-500 mt-1 leading-relaxed">
                                        {order.shippingAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
