'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
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
    FaStar,
    FaStore
} from 'react-icons/fa';
import { WhiteCard, TrackingBadge, StatusBadge, Stepper } from '@/client/components/features/dashboard/DashboardUI';
import Loader from '@/client/components/ui/Loader';

import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

export default function MyOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [isTrackingOpen, setIsTrackingOpen] = useState(false);
    const [isDisputeOpen, setIsDisputeOpen] = useState(false);
    const [isReviewOpen, setIsReviewOpen] = useState(false);
    const [disputeReason, setDisputeReason] = useState('');
    const [isSubmittingDispute, setIsSubmittingDispute] = useState(false);
    const router = useRouter();

    const handleOpenReview = (order: any) => {
        setSelectedOrder(order);
        setIsReviewOpen(true);
    };

    const fetchOrders = async () => {
        try {
            const data = await apiClient.get<any[]>('/orders/my');
            const ordersList = Array.isArray(data) ? data : [];

            const mappedOrders = ordersList.map((order: any) => {
                try {
                    const orderId = order._id || order.id;
                    const items = Array.isArray(order.items) ? order.items.map((item: any) => ({
                        id: item.linkedProduct?._id || item.productId,
                        name: item.linkedProduct?.name || item.product?.name || 'Product',
                        image: item.linkedProduct?.images?.[0] || item.product?.images?.[0] || '/placeholder.png',
                        quantity: item.quantity || 1,
                        price: item.price || 0,
                        variant: item.variant || 'Standard Edition' // Placeholder if variant not available
                    })) : [];

                    return {
                        id: orderId,
                        displayId: `NM-${(orderId || '').slice(0, 5).toUpperCase()}`,
                        seller: typeof order.seller === 'string' ? order.seller : (order.seller?.businessName || 'Unknown Seller'),
                        sellerId: order.sellerId,
                        total: Number(order.totalAmount || 0),
                        status: typeof order.status === 'string' ? order.status : 'PENDING',
                        currentStep: getStepFromStatus(order.status),
                        items: items, // structured items
                        rawItems: items, // keeping for backward compat if needed (though items is now structured)
                        date: new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    };
                } catch (err) {
                    console.error('Error mapping order:', order, err);
                    return null;
                }
            }).filter(Boolean);

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
                console.log('Tracking Order Data:', res);
                // Ensure ID is mapped correctly for UI
                const data = { ...res, id: res._id || res.id };
                setSelectedOrder(data);
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

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <Loader size="lg" variant="primary" />
        </div>
    );

    return (
        <div className="space-y-10 pb-20 animate-fade-in font-sans">
            {/* Modal Components - kept as is */}
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
                            className="relative w-full max-w-lg bg-white rounded-[10px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Live Tracking</h3>
                                    <p className="text-sm font-black text-slate-400 mt-1">Package NM-{(selectedOrder.id || '').toUpperCase().slice(0, 5)}</p>
                                </div>
                                <button onClick={() => setIsTrackingOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <Stepper currentStep={getStepFromStatus(selectedOrder.status)} />

                                {selectedOrder.shipmentTracking && (
                                    <div className="p-6 bg-[#1212A1]/5 rounded-[10px] border border-[#1212A1]/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-black text-[#1212A1]/60 mb-1">Carrier: {selectedOrder.shipmentTracking.carrier}</p>
                                            <p className="text-sm font-black text-slate-800 tracking-tight">ID: {selectedOrder.shipmentTracking.trackingNumber}</p>
                                        </div>
                                        <Truck className="text-[#1212A1] w-6 h-6" />
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <h4 className="text-sm font-black text-slate-400">Journey Timeline</h4>
                                    <div className="space-y-6 relative ml-4 border-l-2 border-slate-50 pl-8">
                                        {selectedOrder.timeline?.map((event: any, i: number) => (
                                            <div key={i} className="relative">
                                                <div className="absolute -left-[41px] top-1 w-4 h-4 rounded-full bg-white border-4 border-[#1212A1] shadow-sm" />
                                                <p className="text-sm font-black text-slate-400 mb-1">{new Date(event.createdAt).toLocaleString()}</p>
                                                <p className="text-sm font-black text-slate-800 tracking-tight italic">{event.toState.replace(/_/g, ' ')}</p>
                                                <p className="text-sm font-bold text-slate-500 mt-1">{event.reason}</p>
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
                            className="relative w-full max-w-lg bg-white rounded-[10px] shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">Return Request</h3>
                                    <p className="text-sm font-black text-slate-400 mt-1">Order NM-{(selectedOrder.id || '').toUpperCase().slice(0, 5)}</p>
// ... (inside Return Modal)

                                    // ... (in ReviewModal)
                                    <p className="text-sm font-black text-slate-400 mt-1">Order NM-{(selectedOrder.id || '').toUpperCase().slice(0, 5)}</p>
                                </div>
                                <button onClick={() => setIsDisputeOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                    <FaTimes />
                                </button>
                            </div>
                            <div className="p-8 space-y-6">
                                <div className="p-6 bg-amber-50 rounded-[10px] border border-amber-100 flex items-start gap-4">
                                    <FaInfoCircle className="text-amber-600 shrink-0 mt-1" />
                                    <p className="text-sm font-bold text-amber-700 leading-relaxed">
                                        Submitting a return request will freeze the payment in escrow. Our team will review your reason and evidence to process the refund.
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-black text-slate-400 pl-2 mb-2 block">Reason for Return</label>
                                    <textarea
                                        value={disputeReason}
                                        onChange={(e) => setDisputeReason(e.target.value)}
                                        placeholder="Please describe why you want to return this product (e.g. wrong item, damaged, not as described)..."
                                        className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[10px] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1212A1]/10 focus:bg-white min-h-[150px] transition-all"
                                    />
                                </div>
                                <button
                                    onClick={submitDispute}
                                    disabled={isSubmittingDispute}
                                    className="w-full py-5 bg-black text-white rounded-[10px] text-sm font-black shadow-xl shadow-black/10 hover:bg-[#1212A1] active:scale-95 transition-all disabled:opacity-50"
                                >
                                    {isSubmittingDispute ? 'Submitting...' : 'Submit Return Request'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}

                {/* Review & Rating Modal */}
                {isReviewOpen && selectedOrder && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setIsReviewOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <ReviewModal
                            order={selectedOrder}
                            onClose={() => setIsReviewOpen(false)}
                            onSuccess={() => {
                                setIsReviewOpen(false);
                                fetchOrders();
                            }}
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Header & Breadcrumbs - REFINED */}
            <div className="bg-white p-6 rounded-[10px] shadow-sm border border-slate-100/50">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase italic mb-2">My Orders</h1>
                <p className="text-slate-500 font-medium text-sm">
                    Track your orders, request returns, and manage your purchase history.
                </p>
            </div>

            {/* Filter Bar - UPDATED DESIGN */}
            <div className="bg-white p-4 rounded-[10px] shadow-sm border border-slate-100/50 flex flex-wrap items-center gap-4">
                <div className="flex-1 min-w-[300px] relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search by Order ID, Product..."
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 border border-slate-200 rounded-[8px] text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#1212A1] transition-all placeholder:text-slate-400"
                    />
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-100 transition-all">
                            <option>All Statuses</option>
                            <option>Delivered</option>
                            <option>In Transit</option>
                            <option>Pending</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select className="appearance-none pl-4 pr-10 py-2.5 bg-slate-50/50 border border-slate-200 rounded-[8px] text-sm font-bold text-slate-700 focus:outline-none cursor-pointer hover:bg-slate-100 transition-all">
                            <option>Last 30 Days</option>
                            <option>Last 3 Months</option>
                            <option>2023</option>
                        </select>
                        <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                    </div>
                    <button className="w-10 h-10 bg-slate-900 text-white rounded-[8px] flex items-center justify-center hover:bg-black transition-all">
                        <Filter className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Orders List - REDESIGNED */}
            <div className="space-y-6">
                {orders.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-slate-100 rounded-[10px] shadow-sm">
                        <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Package className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black text-slate-800 mb-1">No Orders Found</h3>
                        <p className="text-slate-400 text-sm font-bold mb-6">Looks like you haven't placed any orders yet.</p>
                        <button onClick={() => router.push('/')} className="px-6 py-2.5 bg-[#1212A1] text-white rounded-[8px] text-sm font-bold shadow-lg shadow-[#1212A1]/20 hover:bg-[#0e0e81] transition-all">
                            Start Shopping
                        </button>
                    </div>
                ) : orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-[10px] shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                        {/* Order Header */}
                        <div className="p-6 border-b border-slate-50 bg-slate-50/30 flex flex-wrap justify-between items-start gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-1">
                                    <h3 className="text-base font-black text-slate-800">Order #{order.displayId}</h3>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-600' :
                                        order.status === 'SHIPPED' ? 'bg-[#1212A1]/10 text-[#1212A1]' :
                                            order.status === 'CANCELLED' ? 'bg-red-100 text-red-600' :
                                                'bg-slate-100 text-slate-600'
                                        }`}>
                                        {order.status}
                                    </span>
                                </div>
                                <p className="text-xs font-bold text-slate-500">
                                    Seller: <span className="text-slate-700">{order.seller}</span> <span className="mx-2 text-slate-300 text-[10px]">|</span> Date: {order.date}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Total Amount</p>
                                <p className="text-lg font-black text-slate-800">₹{order.total.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Stepper (Only active orders) */}
                        {order.status !== 'CANCELLED' && order.status !== 'DISPUTED' && (
                            <div className="px-8 py-6 border-b border-slate-50">
                                <Stepper currentStep={order.currentStep} />
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="divide-y divide-slate-50">
                            {order.items.map((item: any, idx: number) => (
                                <div key={idx} className="p-6 flex flex-col md:flex-row gap-6 items-center">
                                    {/* Product Image */}
                                    <div className="w-20 h-20 bg-slate-50 rounded-[8px] border border-slate-100 flex-shrink-0 overflow-hidden">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover mix-blend-multiply"
                                            onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/80x80/f1f5f9/94a3b8?text=No+Img' }}
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="flex-1 text-center md:text-left">
                                        <h4 className="font-bold text-slate-800 text-sm mb-1 line-clamp-1">{item.name}</h4>
                                        <p className="text-xs font-medium text-slate-500">
                                            Quantity: {item.quantity} <span className="mx-1">|</span> {item.variant}
                                        </p>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-3">
                                        <button className="px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all flex items-center gap-2">
                                            <Invoice className="w-3 h-3" /> Invoice
                                        </button>
                                        <button
                                            onClick={() => router.push(`/product/${item.id}`)}
                                            className="px-4 py-2 bg-white border border-slate-200 rounded-[6px] text-xs font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition-all"
                                        >
                                            View Details
                                        </button>

                                        {/* Primary Action Button Logic */}
                                        {order.status === 'DELIVERED' ? (
                                            <button
                                                onClick={() => handleTrackOrder(order.id)} // Used for re-order or review logically, but keeping basic for now or changing to Review if implemented
                                                className="px-5 py-2 bg-slate-900 text-white rounded-[6px] text-xs font-bold hover:bg-black transition-all flex items-center gap-2"
                                            >
                                                <ArrowRight className="w-3 h-3" /> Buy Again
                                            </button>
                                        ) : order.status === 'CANCELLED' ? (
                                            <button className="px-5 py-2 bg-slate-100 text-slate-400 rounded-[6px] text-xs font-bold cursor-not-allowed">
                                                Canceled
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleTrackOrder(order.id)}
                                                className="px-5 py-2 bg-[#1212A1] text-white rounded-[6px] text-xs font-bold shadow-lg shadow-[#1212A1]/20 hover:bg-[#0e0e81] transition-all flex items-center gap-2"
                                            >
                                                <Truck className="w-3 h-3" /> Track Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Footer / Meta Actions */}
                        {order.status === 'DELIVERED' && (
                            <div className="bg-slate-50/50 p-4 border-t border-slate-50 flex justify-end gap-3">
                                <button onClick={() => handleOpenReview(order)} className="text-xs font-bold text-[#1212A1] hover:underline">Write a Review</button>
                                <span className="text-slate-300">|</span>
                                <button onClick={() => handleOpenDispute(order)} className="text-xs font-bold text-amber-600 hover:underline">Return / Report Issue</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

function ReviewModal({ order, onClose, onSuccess }: { order: any, onClose: () => void, onSuccess: () => void }) {
    const [step, setStep] = useState(1); // 1: Products, 2: Seller
    const [ratings, setRatings] = useState<any>({});
    const [sellerRating, setSellerRating] = useState({ rating: 5, delivery: 5, packaging: 5, communication: 5, comment: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            // 1. Submit Product Reviews
            const productReviewPromises = order.rawItems.map((item: any, i: number) => {
                if (!ratings[i]?.rating) return null;
                return apiClient.post('/reviews/product', {
                    productId: item.id,
                    orderId: order.id,
                    rating: ratings[i].rating,
                    comment: ratings[i].comment
                });
            }).filter(Boolean);

            // 2. Submit Seller Review
            const sellerReviewPromise = apiClient.post('/reviews/seller', {
                orderId: order.id,
                sellerId: order.sellerId,
                rating: sellerRating.rating,
                delivery: sellerRating.delivery,
                packaging: sellerRating.packaging,
                communication: sellerRating.communication,
                comment: sellerRating.comment
            });

            await Promise.all([...productReviewPromises, sellerReviewPromise]);

            toast.success('Thank you for your feedback!');
            onSuccess();
        } catch (error) {
            toast.error('Failed to submit reviews');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[10px] shadow-2xl overflow-hidden"
        >
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-slate-800 tracking-tight italic uppercase">
                        {step === 1 ? 'Rate Products' : `Rate ${order.seller}`}
                    </h3>
                    <p className="text-sm font-black text-slate-400 mt-1">Order NM-{order.id.slice(0, 5).toUpperCase()}</p>
                </div>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                    <FaTimes />
                </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                {step === 1 ? (
                    <div className="space-y-8">
                        {order.items.map((item: string, i: number) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-[10px] border border-slate-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm font-black text-slate-800 italic uppercase">{item}</p>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => setRatings({ ...ratings, [i]: { ...ratings[i], rating: star } })}
                                                className={`w-8 h-8 rounded-[10px] flex items-center justify-center transition-all ${ratings[i]?.rating >= star ? 'bg-amber-400 text-white shadow-md' : 'bg-white text-slate-200'}`}
                                            >
                                                <FaStar className="w-3 h-3" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <textarea
                                    placeholder="What did you like or dislike about this item?"
                                    onChange={(e) => setRatings({ ...ratings, [i]: { ...ratings[i], comment: e.target.value } })}
                                    className="w-full p-4 bg-white border border-slate-100 rounded-[10px] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1212A1]/10 min-h-[80px]"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <h4 className="text-sm font-black text-slate-400 text-center">Overall Experience</h4>
                            <div className="flex justify-center gap-4">
                                {[1, 2, 3, 4, 5].map(star => (
                                    <button
                                        key={star}
                                        onClick={() => setSellerRating({ ...sellerRating, rating: star })}
                                        className={`w-14 h-14 rounded-[10px] flex items-center justify-center transition-all ${sellerRating.rating >= star ? 'bg-[#1212A1] text-white scale-110 shadow-xl' : 'bg-slate-50 text-slate-200'}`}
                                    >
                                        <FaStar className="w-6 h-6" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { label: 'Delivery', key: 'delivery' },
                                { label: 'Packaging', key: 'packaging' },
                                { label: 'Support', key: 'communication' }
                            ].map(sub => (
                                <div key={sub.key} className="p-5 bg-slate-50 rounded-[10px] border border-slate-100 space-y-3">
                                    <p className="text-sm font-black text-slate-400 text-center">{sub.label}</p>
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                key={star}
                                                onClick={() => setSellerRating({ ...sellerRating, [sub.key]: star })}
                                                className={`transition-colors ${sellerRating[sub.key] >= star ? 'text-emerald-500' : 'text-slate-200'}`}
                                            >
                                                <FaStar className="w-3 h-3" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <textarea
                            placeholder="Share your experience with the delivery and service..."
                            value={sellerRating.comment}
                            onChange={(e) => setSellerRating({ ...sellerRating, comment: e.target.value })}
                            className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[10px] text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#1212A1]/10 focus:bg-white min-h-[120px] transition-all"
                        />
                    </div>
                )}
            </div>

            <div className="p-8 border-t border-slate-50 flex gap-4">
                {step === 2 && (
                    <button
                        onClick={() => setStep(1)}
                        className="px-8 py-4 bg-slate-100 text-slate-600 rounded-[10px] text-sm font-black hover:bg-slate-200 transition-all"
                    >
                        Back
                    </button>
                )}
                <button
                    onClick={step === 1 ? () => setStep(2) : handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-4 bg-black text-white rounded-[10px] text-sm font-black shadow-xl hover:bg-[#1212A1] active:scale-95 transition-all disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : step === 1 ? 'Next: Rate Seller' : 'Submit Review'}
                </button>
            </div>
        </motion.div>
    );
}
