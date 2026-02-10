'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch as Search,
    FaFilter as Filter,
    FaChevronDown as ChevronDown,
    FaBox as Package,
    FaFileInvoice as Invoice,
    FaTruck as Truck,
    FaShieldAlt as Shield,
    FaUndo as Undo,
    FaHeadset as Support,
    FaArrowRight as ArrowRight,
    FaTimes,
    FaCheckCircle,
    FaInfoCircle,
} from 'react-icons/fa';
import { WhiteCard, TrackingBadge, StatusBadge, Stepper } from '@/client/components/features/dashboard/DashboardUI';

import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export default function MyOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [isDisputeOpen, setIsDisputeOpen] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
    // const { showSnackbar } = useSnackbar();

    const fetchOrders = async () => {
        try {
            const data = await apiClient.get<any[]>('/orders/my');
            const ordersList = data || [];

            const mappedOrders = ordersList.map((order: any) => ({
                id: order.id,
                displayId: `NM-${order.id.slice(0, 5).toUpperCase()}`,
                dealer: order.dealer?.businessName || 'Unknown Dealer',
                dealerId: order.dealerId,
                total: Number(order.totalAmount),
                status: order.status,
                currentStep: getStepFromStatus(order.status),
                items: order.items.map((item: any) => `${item.linkedProduct?.name || 'Product'} (${item.quantity})`),
                date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
            }));

            setOrders(mappedOrders);
        } catch (error) {
            console.error('Failed to fetch orders:', error);
            toast.error('Could not load your orders.');
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchOrders();
    }, []);

    const getStepFromStatus = (status: string) => {
        switch (status) {
            case 'CREATED': return 1;
            case 'PAID': return 2;
            case 'PACKED': return 2;
            case 'SHIPPED': return 3;
            case 'DELIVERED': return 4;
            default: return -1;
        }
    };

    const handleTrackOrder = async (orderId: string) => {
        try {
            const res = await apiClient.get<any>(`/orders/${orderId}`);
            if (res) {
                setSelectedOrder(res);
                setIsTrackingOpen(true);
            }
        } catch (error) {
            toast.error('Failed to fetch tracking details');
        }
    };

    const handleOpenDispute = (order: any) => {
        setSelectedOrder(order);
        setIsDisputeOpen(true);
    };

    const submitDispute = async () => {
        if (!disputeReason.trim()) {
            toast.error('Please provide a reason for the return.');
            return;
        }

        try {
            setIsSubmittingDispute(true);
            await apiClient.post(`/orders/${selectedOrder.id}/dispute`, { reason: disputeReason });
            toast.success('Return request submitted successfully.');
            setIsDisputeOpen(false);
            setDisputeReason('');
            fetchOrders();
        } catch (error) {
            toast.error('Failed to submit return request.');
        } finally {
            setIsSubmittingDispute(false);
        }
    };

    if (loading) return <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Orders...</div>;

    return (
        <div className="space-y-10 pb-20 animate-fade-in">
            {/* Modal Components */}
            <AnimatePresence>
                {/* Tracking Modal */}
                {isTrackingOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsTrackingOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Live Tracking</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Package NM-{selectedOrder.id.slice(0, 5).toUpperCase()}</p>
                                </div>
                                <button onClick={() => setIsTrackingOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <Stepper currentStep={getStepFromStatus(selectedOrder.status)} />

                                {selectedOrder.shipmentTracking && (
                                    <div className="p-6 bg-blue-50/50 rounded-2xl border border-blue-100/50 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">Carrier: {selectedOrder.shipmentTracking.carrier}</p>
                                            <p className="text-sm font-black text-slate-800 tracking-tight">ID: {selectedOrder.shipmentTracking.trackingNumber}</p>
                                        </div>
                                        <Truck className="text-blue-600 w-6 h-6" />
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Journey Timeline</h4>
                                    <div className="space-y-6 relative ml-4 border-l-2 border-slate-50 pl-8">
                                        {selectedOrder.timeline?.map((event: any, i: number) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-600 shadow-sm" />
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{new Date(event.createdAt).toLocaleString()}</p>
                                                <p className="text-xs font-black text-slate-800 tracking-tight uppercase italic">{event.toState.replace(/_/g, ' ')}</p>
                                                <p className="text-xs font-bold text-slate-500 mt-1">{event.reason}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Return Request Modal */}
                {isDisputeOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsDisputeOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white rounded-[2rem] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Return Request</h3>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Order NM-{selectedOrder.id.slice(0, 5).toUpperCase()}</p>
                                </div>
                                <button onClick={() => setIsDisputeOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-4">
                                    <FaInfoCircle className="text-amber-600 shrink-0 mt-1" />
                                    <p className="text-xs font-bold text-amber-700 leading-relaxed">
                                        Submitting a return request will freeze the payment in escrow. Our team will review your reason and evidence to process the refund.
                                    </p>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-2 block">Reason for Return</label>
                                    <textarea
                                        value={disputeReason}
                                        onChange={(e) => setDisputeReason(e.target.value)}
                                        placeholder="Please describe why you want to return this product (e.g. wrong item, damaged, not as described)..."
                                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white min-h-[150px] transition-all"
                                    />
                                </div>
                                <button
                                    onClick={submitDispute}
                                    disabled={isSubmittingDispute}
                                    className="w-full py-5 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-black/10 hover:bg-[#0F6CBD] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmittingDispute ? 'Submitting...' : 'Submit Return Request'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Header & Breadcrumbs */}
            <div>
                <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">
                    <span>Dashboard</span>
                    <ChevronDown className="w-2.5 h-2.5 -rotate-90" />
                    <span className="text-blue-600">My Orders</span>
                </nav>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">My Orders</h1>
                <p className="text-slate-400 font-bold mt-2">
                    Manage and track your <span className="text-slate-800">recent purchases</span> from various dealers.
                </p>
            </div>

            {/* Filter Bar */}
            <WhiteCard className="p-4 flex flex-wrap items-center gap-4 border-none shadow-xl shadow-blue-600/2">
                <div className="flex-1 min-w-[240px] relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-600 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search by Order ID or Item..."
                        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-xs font-bold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/10 focus:bg-white transition-all"
                    />
                </div>
                {[
                    { label: 'Status: All' },
                    { label: 'Date: Last 30 Days' },
                    { label: 'Dealer: All Dealers' },
                ].map((filter, i) => (
                    <button key={i} className="px-5 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex items-center gap-3 text-xs font-black text-slate-600 hover:bg-white hover:shadow-sm transition-all">
                        {filter.label}
                        <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>
                ))}
                <button className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-black transition-all">
                    <Filter className="w-4 h-4" />
                </button>
            </WhiteCard>

            {/* Orders List */}
            <div className="space-y-8">
                {orders.length === 0 ? (
                    <div className="p-10 text-center text-slate-400 font-bold uppercase tracking-widest text-xs border border-slate-100 rounded-3xl">No orders found. Start shopping!</div>
                ) : orders.map((order) => (
                    <WhiteCard key={order.id} className="p-0 border-none shadow-xl shadow-blue-600/5 overflow-hidden">
                        <div className="p-8 space-y-8">
                            {/* Card Header */}
                            <div className="flex flex-wrap justify-between items-start gap-6">
                                <div className="flex items-center gap-5">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${order.status === 'CANCELLED' ? 'bg-slate-100' : 'bg-blue-50'} border border-slate-100`}>
                                        <Package className={`w-6 h-6 ${order.status === 'CANCELLED' ? 'text-slate-400' : 'text-blue-600'}`} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Order #{order.displayId}</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                                            Dealer: <span className="text-blue-600 font-black">{order.dealer}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    {order.status !== 'CANCELLED' ? (
                                        <>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Amount</p>
                                            <p className="text-xl font-black text-blue-600 tracking-tight">₹{order.total.toLocaleString()}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Refund Status</p>
                                            <p className="text-sm font-black text-slate-800">{order.refundStatus || 'Processed'}</p>
                                        </>
                                    )}
                                    <div className="mt-2">
                                        <TrackingBadge status={order.status} />
                                    </div>
                                </div>
                            </div>

                            {/* Tracking Stepper */}
                            {order.status !== 'CANCELLED' && (
                                <div className="py-4 border-y border-slate-50">
                                    <Stepper currentStep={order.currentStep} />
                                </div>
                            )}

                            {order.status === 'CANCELLED' && (
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <p className="text-[11px] font-bold text-slate-500 italic">Canceled on {order.date}</p>
                                    <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">Re-order Items</button>
                                </div>
                            )}

                            {/* Card Footer */}
                            <div className="flex flex-wrap items-center justify-between gap-6 pt-2">
                                <div className="space-y-2">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] leading-none mb-2">Items:</p>
                                    <p className="text-[11px] font-black text-slate-800 leading-relaxed max-w-sm">
                                        {order.items.join(', ')}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button className="px-6 py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2">
                                        <Invoice className="w-3 h-3" /> Invoice
                                    </button>
                                    <button onClick={() => handleTrackOrder(order.id)} className="px-6 py-3 border border-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all">
                                        View Details
                                    </button>
                                    {order.status !== 'CANCELLED' && order.status !== 'DISPUTED' && (
                                        <button
                                            onClick={order.status === 'DELIVERED' ? () => handleOpenDispute(order) : () => handleTrackOrder(order.id)}
                                            className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all"
                                        >
                                            {order.status === 'DELIVERED' ? 'Request Return' : 'Track Order'}
                                        </button>
                                    )}
                                    {order.status === 'DISPUTED' && (
                                        <div className="px-6 py-3 bg-amber-50 text-amber-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-amber-100">
                                            Return Requested
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </WhiteCard>
                ))}
            </div>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: 'Shipping Support', desc: 'Got questions about your delivery? Our team is 24/7 available.', icon: Support, link: 'Contact Support', color: 'bg-blue-50 text-blue-600' },
                    { title: 'Refund Policy', desc: 'You have 30 days from delivery to request a full refund for any item.', icon: Undo, link: 'View Policy', color: 'bg-slate-900 text-white dark-card' },
                    { title: 'Buyer Protection', desc: "Every purchase is secured by NovaMart's fraud protection program.", icon: Shield, link: 'Learn More', color: 'bg-amber-50 text-amber-700' },
                ].map((item, i) => (
                    <div key={i} className={`p-8 rounded-[2rem] border border-slate-100 shadow-xl shadow-blue-600/2 space-y-6 ${item.color.includes('dark-card') ? 'bg-slate-900 text-white' : item.color.split(' ')[0] + ' bg-opacity-50'}`}>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color.includes('dark-card') ? 'bg-white/10' : item.color}`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-base font-black tracking-tight">{item.title}</h4>
                            <p className={`text-[11px] font-bold leading-relaxed ${item.color.includes('dark-card') ? 'text-white/60' : 'text-slate-500'}`}>
                                {item.desc}
                            </p>
                        </div>
                        <button className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-2 group ${item.color.includes('dark-card') ? 'text-white' : 'text-blue-600'}`}>
                            {item.link}
                            <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
