'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaUser,
    FaBox,
    FaHeadset,
    FaStar,
    FaComments,
    FaSignOutAlt,
    FaMapMarkerAlt,
    FaCheckCircle,
    FaClock,
    FaChevronRight,
    FaEdit,
    FaHeart,
    FaBell,
    FaBars,
    FaCamera,
    FaSync
} from 'react-icons/fa';
import { Card, WhiteCard, StatusBadge } from '@/client/components/features/dashboard/DashboardUI';
import { useAuth } from '@/client/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { mediaService } from '@/lib/api/services/media.service';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

function ProfileContent() {
    const { user, logout, isAuthenticated, checkAuth } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialTab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(initialTab);
    // const { showSnackbar } = useSnackbar();

    const [orders, setOrders] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (!isAuthenticated) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                if (activeTab === 'orders') {
                    const data = await apiClient.get<any[]>('/orders/my');
                    if (data) setOrders(data);
                } else if (activeTab === 'reviews') {
                    const data = await apiClient.get<any[]>('/reviews/my-reviews');
                    if (data) setReviews(data);
                }
            } catch (error) {
                console.error('Failed to fetch data:', error);
                toast.error('Failed to load data');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab, isAuthenticated]);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab) setActiveTab(tab);
    }, [searchParams]);

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setUploading(true);
        try {
            const urls = await mediaService.uploadImages([file]);
            if (urls && urls.length > 0) {
                await apiClient.put('/customer/profile', { section: 'account', data: { avatar: urls[0] } });
                await checkAuth();
                toast.success('Profile image updated');
            }
        } catch (error) {
            toast.error('Failed to upload image');
        } finally {
            setUploading(false);
        }
    };

    if (!isAuthenticated) return null;

    const renderContent = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <Card className="p-8 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[10px]">
                        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-50 bg-slate-100 flex items-center justify-center shadow-inner">
                                    {user?.avatar ? (
                                        <img src={user.avatar} className="w-full h-full object-cover" alt="Profile" />
                                    ) : (
                                        <FaUser className="w-10 h-10 text-slate-300" />
                                    )}
                                </div>
                                <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-all shadow-lg border-2 border-white">
                                    <FaCamera className="w-3 h-3" />
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                                </label>
                                {uploading && (
                                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-full">
                                        <FaSync className="w-4 h-4 animate-spin text-blue-600" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-between mb-4">
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Personal Information</h3>
                                    <button className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-[10px] text-[10px] font-black tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all">
                                        <FaEdit className="w-3 h-3" /> Edit Profile
                                    </button>
                                </div>
                                <p className="text-slate-400 text-xs font-bold tracking-widest">{user?.role} ACCOUNT · ID: {user?.id?.slice(0, 8)}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {[
                                { label: 'Full Name', value: user?.name, icon: FaUser },
                                { label: 'Email Address', value: user?.email, icon: FaBell },
                                { label: 'Phone Number', value: user?.phone || '+91 98765 43210', icon: FaComments },
                                { label: 'Primary Address', value: user?.address || '123 Enterprise Way, Tech City, 560001', icon: FaMapMarkerAlt },
                            ].map((field, idx) => (
                                <div key={idx} className="space-y-2 p-6 bg-slate-50/50 rounded-[10px] border border-slate-100">
                                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 tracking-widest">
                                        <field.icon className="w-3 h-3 text-blue-600" />
                                        {field.label}
                                    </div>
                                    <p className="text-sm font-bold text-slate-800">{field.value}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                );
            case 'orders':
                return (
                    <div className="space-y-4">
                        {loading ? (
                            <div className="p-10 text-center text-slate-400 font-bold tracking-widest text-xs">Loading Orders...</div>
                        ) : orders.length === 0 ? (
                            <div className="p-10 text-center text-slate-400 font-bold tracking-widest text-xs border border-slate-100 rounded-[10px]">No orders found.</div>
                        ) : (
                            orders.map((order: any, idx: number) => (
                                <Card key={order.id || idx} className="p-6 border-none shadow-lg shadow-blue-600/5 bg-white rounded-[10px] flex items-center gap-6 group hover:translate-x-2 transition-all duration-300 cursor-pointer" onClick={() => router.push(`/customer/orders`)}>
                                    <div className="w-20 h-20 bg-slate-50 rounded-[10px] p-2 shrink-0 border border-slate-100 flex items-center justify-center">
                                        <FaBox className="w-8 h-8 text-slate-300" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-slate-400 tracking-widest leading-none mb-1">{order.id ? `NM-${order.id.slice(0, 5).toUpperCase()}` : 'ORDER'}</p>
                                        <h4 className="font-black text-slate-800 mb-2">{order.items?.[0]?.linkedProduct?.name || `Order #${order.id.slice(0, 5)}`} {order.items?.length > 1 && `+ ${order.items.length - 1} more`}</h4>
                                        <span className={`px-3 py-1 rounded-[10px] text-[9px] font-black tracking-widest ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className="text-right pr-4">
                                        <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1">Total</p>
                                        <p className="text-sm font-black text-slate-800">₹{Number(order.totalAmount).toLocaleString()}</p>
                                    </div>
                                </Card>
                            ))
                        )}
                    </div>
                );
            case 'complaints':
                return (
                    <Card className="p-12 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[10px] text-center space-y-6">
                        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                            <FaHeadset className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Need Assistance?</h3>
                            <p className="text-slate-400 text-sm font-bold mt-2">Our technical experts are available 24/7 to resolve your issues.</p>
                        </div>
                        <button className="px-10 py-4 bg-blue-600 text-white rounded-[10px] text-[11px] font-black tracking-widest shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all transform active:scale-95">
                            Open New Support Ticket
                        </button>
                    </Card>
                );
            case 'reviews':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {loading ? (
                            <div className="col-span-2 p-10 text-center text-slate-400 font-bold tracking-widest text-xs">Loading Reviews...</div>
                        ) : reviews.length === 0 ? (
                            <div className="col-span-2 p-10 text-center text-slate-400 font-bold tracking-widest text-xs border border-slate-100 rounded-[10px]">No reviews found.</div>
                        ) : (
                            reviews.map((review: any, i: number) => (
                                <Card key={review.id || i} className="p-6 border-none shadow-lg shadow-blue-600/5 bg-white rounded-[10px] space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-slate-50 rounded-[10px] overflow-hidden">
                                            {review.product?.images?.[0] && <img src={review.product.images[0]} className="w-full h-full object-cover" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-black text-slate-800 line-clamp-1">{review.product?.name || 'Product Review'}</p>
                                            <div className="flex gap-1 mt-1">
                                                {[1, 2, 3, 4, 5].map(s => <FaStar key={s} className={`w-2 h-2 ${s <= review.rating ? 'text-amber-500' : 'text-slate-200'}`} />)}
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-xs text-slate-500 font-bold leading-relaxed italic border-l-2 border-slate-100 pl-4">"{review.comment}"</p>
                                </Card>
                            ))
                        )}
                    </div>
                );
            case 'wishlist':
                return (
                    <Card className="p-12 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[10px] text-center space-y-4">
                        <div className="w-20 h-20 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FaHeart className="w-8 h-8" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800">Wishlist Coming Soon!</h3>
                        <p className="text-slate-400 text-sm font-bold">We are building a personalized wishlist experience for you. Stay tuned!</p>
                    </Card>
                );
            case 'billing':
                return (
                    <div className="space-y-6">
                        <Card className="p-8 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[10px]">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-[10px] flex items-center justify-center">
                                    <FaMapMarkerAlt className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Shipping Address</h3>
                                    <p className="text-xs font-bold text-slate-400 tracking-widest">Manage your delivery location</p>
                                </div>
                            </div>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setLoading(true);
                                const formData = new FormData(e.currentTarget);
                                const address = formData.get('address') as string;
                                try {
                                    await apiClient.put('/customer/profile', { section: 'account', data: { address } });
                                    toast.success('Address updated successfully');
                                    // Optionally refresh user context here
                                    window.location.reload();
                                } catch (err) {
                                    toast.error('Failed to update address');
                                } finally {
                                    setLoading(false);
                                }
                            }}>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-400 tracking-widest pl-1 mb-1 block">Primary Address</label>
                                        <textarea
                                            name="address"
                                            defaultValue={user?.address}
                                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-[10px] text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 min-h-[100px]"
                                            placeholder="Enter your full shipping address..."
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="px-8 py-3 bg-slate-900 text-white rounded-[10px] text-[10px] font-black tracking-widest shadow-lg hover:bg-black transition-all disabled:opacity-50"
                                        >
                                            {loading ? 'Saving...' : 'Update Address'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </Card>

                        <Card className="p-8 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[10px] opacity-60">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-[10px] flex items-center justify-center">
                                    <FaCheckCircle className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-800 tracking-tight">Payment Methods</h3>
                                    <p className="text-xs font-bold text-slate-400 tracking-widest">Secured by Razorpay</p>
                                </div>
                            </div>
                            <p className="text-sm font-bold text-slate-500 italic">
                                Saved cards and UPI IDs are managed securely via our payment gateway during checkout.
                                We do not store sensitive payment information on our servers.
                            </p>
                        </Card>
                    </div>
                );
            case 'chats':
                return (
                    <Card className="p-12 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[10px] text-center">
                        <FaComments className="w-16 h-16 text-slate-200 mx-auto mb-6" />
                        <h3 className="text-xl font-black text-slate-800 tracking-tighter">No Active Conversations</h3>
                        <p className="text-slate-400 text-sm font-bold mt-2">Start a chat with a dealer to discuss bulk orders.</p>
                    </Card>
                );
            default:
                return (
                    <Card className="p-12 text-center text-slate-400 font-bold">
                        Select a section from the sidebar to view details.
                    </Card>
                );
        }
    };

    return (
        <div className="min-h-screen bg-transparent">
            <main className="max-w-6xl mx-auto py-8 relative z-20">
                <div className="flex flex-col gap-8">
                    {/* Main Content Area - Full Width */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {renderContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}

export default function ProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-50 font-black text-[#10367D] tracking-[0.3em] animate-pulse">
                Decrypting Profile Data...
            </div>
        }>
            <ProfileContent />
        </Suspense>
    );
}
