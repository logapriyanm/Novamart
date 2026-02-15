'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineLockClosed,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
    HiOutlineLibrary,
    HiOutlineTruck,
    HiOutlineCheckCircle,
    HiOutlineArrowLeft,
    HiOutlineArrowRight,
    HiOutlineInformationCircle,
    HiOutlineGlobeAlt,
    HiOutlineHome,
    HiOutlineOfficeBuilding,
    HiOutlinePlus,
    HiOutlineX
} from 'react-icons/hi';
import Link from 'next/link';
import Loader from '@/client/components/ui/Loader';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';

import { useCart } from '@/client/context/CartContext';
import { useAuth } from '@/client/hooks/useAuth';
import { orderService } from '@/lib/api/services/order.service';
import { wishlistService } from '@/lib/api/services/wishlist.service';
import { customerService } from '@/lib/api/services/customer.service';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const { cart, total, totalSavings, clearCart } = useCart();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(2);
    const [isProcessing, setIsProcessing] = useState(false);

    // Guest protection
    React.useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast.error('Please login to proceed with checkout');
            router.push(`/auth/login?redirect=/checkout`);
        }
    }, [isAuthenticated, authLoading, router]);

    // Address Management
    const [addresses, setAddresses] = useState<any[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState('');
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({ label: '', name: '', line1: '', city: '', state: '', zip: '', type: 'home' });

    // Fetch addresses on mount
    React.useEffect(() => {
        if (isAuthenticated) {
            const loadAddresses = async () => {
                try {
                    const profile = await customerService.getProfile();
                    if (profile && profile.addresses) {
                        setAddresses(profile.addresses);
                        const defaultAddr = profile.addresses.find((a: any) => a.isDefault);
                        if (defaultAddr) setSelectedAddressId(defaultAddr._id);
                    }
                } catch (error) {
                    console.error('Failed to load addresses', error);
                }
            };
            loadAddresses();
        }
    }, [isAuthenticated]);

    const handleAddAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const updatedProfile = await customerService.addAddress(newAddress);
            // The backend returns the updated info, let's assume it returns the new list of addresses or we fetch profile again.
            // My controller returns: res.json({ success: true, data: addresses }); where addresses is the updated array.
            if (updatedProfile) {
                setAddresses(updatedProfile);
                const newAddr = updatedProfile[updatedProfile.length - 1];
                if (newAddr) setSelectedAddressId(newAddr._id);
                toast.success('Address added successfully!');
                setShowAddressForm(false);
                setNewAddress({ label: '', name: '', line1: '', city: '', state: '', zip: '', type: 'home' });
            }
        } catch (error) {
            toast.error('Failed to save address');
        }
    };

    const handleCreateOrder = async () => {
        if (!selectedAddressId) {
            toast.error('Please select a shipping address');
            return;
        }

        const selectedAddress = addresses.find(a => a._id === selectedAddressId);
        if (!selectedAddress) {
            toast.error('Invalid address selected');
            return;
        }

        setIsProcessing(true);
        try {
            // PHASE 3: SECURE SERVER-SIDE BATCH CHECKOUT
            // We send all items and address to the backend.
            // Backend handles grouping, inventory locking, and order creation in a transaction.
            const payload = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    inventoryId: item.inventoryId,
                    sellerId: item.sellerId, // Important for grouping
                    manufacturerId: item.manufacturerId, // Fallback
                    price: item.price
                })),
                shippingAddress: selectedAddress
            };

            const initiateRes: any = await apiClient.post('/orders/checkout/initiate', payload);

            if (initiateRes.success && initiateRes.razorpayOrderId) {
                toast.success('Checkout initiated successfully!');
                // Redirect to payment page with razorpayOrderId (Batch Payment)
                // We use 'razorpay_order_id' query param to signal batch mode
                router.push(`/checkout/payment?razorpay_order_id=${initiateRes.razorpayOrderId}`);
            } else {
                toast.error(initiateRes.error || 'Failed to initiate checkout.');
            }

        } catch (error: any) {
            console.error('Checkout Error:', error);
            toast.error(error.response?.data?.error || 'Failed to create order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };
    const steps = [
        { id: 1, label: 'Cart' },
        { id: 2, label: 'Shipping' },
        { id: 3, label: 'Payment' },
        { id: 4, label: 'Confirm' }
    ];

    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-24 bg-background">
            <div className="container-responsive">

                {/* Step Progress Bar */}
                <div className="flex items-center justify-between max-w-4xl mx-auto mb-8 md:mb-12 relative px-2">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-foreground/5 -translate-y-1/2" />
                    <div
                        className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2 transition-all duration-500"
                        style={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((s) => (
                        <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 border-2 ${step >= s.id ? 'bg-black border-black text-white shadow-lg shadow-black/20' : 'bg-white border-foreground/10 text-foreground/20'
                                }`}>
                                {step > s.id ? <HiOutlineCheckCircle className="w-5 h-5 sm:w-6 sm:h-6" /> : s.id}
                            </div>
                            <span className={`text-xs font-medium uppercase ${step >= s.id ? 'text-black' : 'text-foreground/20'}`}>
                                {s.label}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
                    {/* Left Side: Checkout Form */}
                    <div className="lg:col-span-8 space-y-10">
                        <header>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight mb-4 italic uppercase leading-tight">Secure <span className="text-black">Escrow Checkout</span></h1>
                            <p className="text-foreground/40 font-bold uppercase tracking-widest text-sm sm:text-xs">Review your shipping details and proceed to secure escrow payment.</p>
                        </header>

                        {/* Buyer Protection Banner */}
                        <div className="bg-black/5 border border-foreground/10 rounded-[10px] p-6 xs:p-8 flex items-center gap-4 xs:gap-6 shadow-sm overflow-hidden relative group">
                            <div className="absolute right-0 top-0 w-32 h-32 bg-black/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
                            <div className="w-14 h-14 bg-black/10 rounded-[10px] flex items-center justify-center text-black shrink-0">
                                <HiOutlineShieldCheck className="w-8 h-8" />
                            </div>
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-black italic">Buyer Protection Enabled</h4>
                                <p className="text-sm font-medium text-foreground/60 leading-relaxed">
                                    Your payment is held in a <span className="text-black font-bold">Secure Escrow Account</span>. Funds are only released to the seller after you confirm receipt and inspection of your items.
                                </p>
                            </div>
                        </div>

                        {/* Step 2: Shipping Address */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 italic">
                                        <span className="text-black text-3xl italic">1.</span> Shipping Address
                                    </h3>
                                    <button
                                        onClick={() => setShowAddressForm(true)}
                                        className="text-sm font-bold text-black flex items-center gap-2 hover:opacity-70 transition-opacity"
                                    >
                                        <HiOutlinePlus className="w-4 h-4" /> Add New
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {addresses.map((addr) => (
                                        <div
                                            key={addr._id}
                                            onClick={() => setSelectedAddressId(addr._id)}
                                            className={`p-6 xs:p-8 rounded-[10px] border-2 transition-all cursor-pointer relative group ${selectedAddressId === addr._id ? 'border-black bg-white shadow-xl shadow-black/5' : 'border-foreground/5 bg-white/50 hover:border-black/20'
                                                }`}
                                        >
                                            <div className="flex items-start justify-between mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${selectedAddressId === addr._id ? 'bg-black text-white' : 'bg-surface text-foreground/20'}`}>
                                                        {addr.type === 'office' ? <HiOutlineOfficeBuilding className="w-6 h-6" /> : <HiOutlineHome className="w-6 h-6" />}
                                                    </div>
                                                    <span className="text-sm font-black text-foreground uppercase tracking-tight">{addr.label}</span>
                                                </div>
                                                {selectedAddressId === addr._id && <HiOutlineCheckCircle className="text-black w-6 h-6" />}
                                            </div>
                                            <div className="space-y-1.5 opacity-60">
                                                <p className="text-xs font-black text-foreground">{addr.name}</p>
                                                <p className="text-sm font-bold text-foreground uppercase tracking-widest leading-relaxed">
                                                    {addr.line1}<br />
                                                    {addr.city}, {addr.state} {addr.zip}
                                                </p>
                                            </div>
                                            <div className="mt-8 flex gap-4">
                                                <button className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em] hover:text-black transition-colors">Edit</button>
                                                <button
                                                    onClick={async (e) => {
                                                        e.stopPropagation();
                                                        if (confirm('Are you sure?')) {
                                                            try {
                                                                const updated = await customerService.removeAddress(addr._id);
                                                                setAddresses(updated);
                                                                if (selectedAddressId === addr._id) setSelectedAddressId('');
                                                                toast.success('Address removed');
                                                            } catch (err) {
                                                                toast.error('Failed to remove address');
                                                            }
                                                        }
                                                    }}
                                                    className="text-xs font-black text-foreground/30 uppercase tracking-[0.2em] hover:text-red-500 transition-colors"
                                                >Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </section>

                        {/* Step 3: Payment Method (Placeholder) */}
                        <section className="space-y-6">
                            <h3 className="text-2xl font-bold text-foreground flex items-center gap-3 italic">
                                <span className="text-black text-3xl italic">2.</span> Payment Method
                            </h3>
                            <div className="bg-surface rounded-[10px] p-6 xs:p-10 border border-foreground/5">
                                <p className="text-xs font-bold text-foreground/40 uppercase tracking-[0.3em] mb-4">Secure Payment Options</p>
                                <div className="flex items-center gap-4">
                                    <div className="bg-white p-4 rounded-[10px] border-2 border-black/20 flex items-center gap-3">
                                        <HiOutlineCreditCard className="text-black w-5 h-5" />
                                        <span className="text-sm font-medium">Razorpay Checkout</span>
                                    </div>
                                    <div className="opacity-30 grayscale pointer-events-none p-4 flex items-center gap-3">
                                        <HiOutlineLibrary className="w-5 h-5" />
                                        <span className="text-sm font-medium">Wire Transfer</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <div className="flex items-center justify-between pt-10 border-t border-foreground/5">
                            <button onClick={() => router.back()} className="text-sm font-bold text-foreground/30 flex items-center gap-2 hover:text-foreground transition-all">
                                <HiOutlineArrowLeft className="w-4 h-4" /> Back to Cart
                            </button>
                            <button
                                onClick={handleCreateOrder}
                                disabled={isProcessing || cart.length === 0}
                                className="bg-black text-white py-5 px-12 rounded-[10px] font-bold text-sm shadow-xl shadow-black/20 hover:scale-[1.05] transition-all flex items-center gap-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : 'Continue to Payment'}
                                <HiOutlineArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Right Side: Order Summary Sidebar */}
                    <aside className="lg:col-span-4 space-y-8">
                        <div className="bg-white rounded-[10px] border border-foreground/[0.03] shadow-xl shadow-foreground/[0.02] overflow-hidden">
                            <div className="p-6 xs:p-10 border-b border-foreground/[0.03]">
                                <h3 className="text-xl font-bold text-foreground italic tracking-tight">Order <span className="text-black">Summary</span></h3>
                            </div>

                            <div className="p-6 xs:p-10 space-y-8">
                                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-6 group">
                                            <div className="w-20 h-20 bg-background rounded-[10px] p-2 flex-shrink-0 flex items-center justify-center border border-foreground/5 group-hover:border-black/20 transition-all">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <h4 className="text-sm font-bold text-foreground line-clamp-2 leading-tight tracking-tight">{item.name}</h4>
                                                <div className="flex items-baseline justify-between pt-1">
                                                    <span className="text-xs font-medium text-foreground/40 italic">Qty: {item.quantity}</span>
                                                    <span className="text-sm font-bold text-foreground">₹{item.price.toLocaleString()}.00</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-4 pt-8 border-t border-foreground/[0.03]">
                                    <div className="flex justify-between text-sm font-medium text-foreground/40 leading-none">
                                        <span>Subtotal</span>
                                        <span className="text-foreground font-bold">₹{total.toLocaleString()}.00</span>
                                    </div>
                                    {totalSavings > 0 && (
                                        <div className="flex justify-between text-sm font-medium text-emerald-600 leading-none">
                                            <span>Total Savings</span>
                                            <span className="font-bold">-₹{totalSavings.toLocaleString()}.00</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-medium text-emerald-500 leading-none">
                                        <span>Shipping</span>
                                        <span className="font-bold">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-foreground/40 leading-none pb-4">
                                        <span>Estimated Tax</span>
                                        <span className="text-foreground font-bold">₹{(total * 0.08).toLocaleString()}.00</span>
                                    </div>

                                    <div className="pt-8 border-t border-foreground/[0.03] flex justify-between items-end">
                                        <div className="space-y-1">
                                            <p className="text-sm font-bold text-foreground/30 uppercase tracking-widest leading-none">Total Secure Payment</p>
                                            <p className="text-xs font-medium text-black italic leading-none">Includes buyer protection</p>
                                        </div>
                                        <p className="text-3xl font-bold text-black tracking-tight leading-none">
                                            ₹{(total * 1.08).toLocaleString()}.00
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Badges */}
                        <div className="flex items-center justify-center gap-8 opacity-20 grayscale hover:grayscale-0 transition-all">
                            <div className="flex items-center gap-2"><HiOutlineLockClosed className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-widest">SSL SECURED</span></div>
                            <div className="flex items-center gap-2"><HiOutlineShieldCheck className="w-4 h-4" /><span className="text-xs font-bold uppercase tracking-widest">PCI COMPLIANT</span></div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* Address Modal */}
            <AnimatePresence>
                {showAddressForm && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowAddressForm(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-xl bg-white rounded-[10px] p-6 xs:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <div className="flex justify-between items-center mb-6 xs:mb-10">
                                <div>
                                    <h2 className="text-xl xs:text-2xl font-bold text-foreground italic">Add New <span className="text-black">Address</span></h2>
                                    <p className="text-xs font-medium text-foreground/40 mt-1">Shipping destination details</p>
                                </div>
                                <button onClick={() => setShowAddressForm(false)} className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-surface flex items-center justify-center text-foreground hover:bg-black hover:text-white transition-all">
                                    <HiOutlineX className="w-4 h-4 xs:w-5 xs:h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleAddAddress} className="space-y-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 xs:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/40 ml-4">Address Label</label>
                                        <input
                                            required
                                            value={newAddress.label}
                                            onChange={e => setNewAddress({ ...newAddress, label: e.target.value })}
                                            placeholder="Home / Office / Warehouse"
                                            className="w-full bg-surface border border-foreground/5 rounded-[10px] px-4 xs:px-6 py-3 xs:py-4 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/40 ml-4">Recipient Name</label>
                                        <input
                                            required
                                            value={newAddress.name}
                                            onChange={e => setNewAddress({ ...newAddress, name: e.target.value })}
                                            placeholder="Full Name"
                                            className="w-full bg-surface border border-foreground/5 rounded-[10px] px-4 xs:px-6 py-3 xs:py-4 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-foreground/40 ml-4">Street Address</label>
                                    <input
                                        required
                                        value={newAddress.line1}
                                        onChange={e => setNewAddress({ ...newAddress, line1: e.target.value })}
                                        placeholder="123 Street name, suite..."
                                        className="w-full bg-surface border border-foreground/5 rounded-[10px] px-6 py-4 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 xs:gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/40 ml-4">City</label>
                                        <input
                                            required
                                            value={newAddress.city}
                                            onChange={e => setNewAddress({ ...newAddress, city: e.target.value })}
                                            placeholder="City"
                                            className="w-full bg-surface border border-foreground/5 rounded-[10px] px-4 xs:px-6 py-3 xs:py-4 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/40 ml-4">State</label>
                                        <input
                                            required
                                            value={newAddress.state}
                                            onChange={e => setNewAddress({ ...newAddress, state: e.target.value })}
                                            placeholder="State"
                                            className="w-full bg-surface border border-foreground/5 rounded-[10px] px-4 xs:px-6 py-3 xs:py-4 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-foreground/40 ml-4">Zip Code</label>
                                        <input
                                            required
                                            value={newAddress.zip}
                                            onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })}
                                            placeholder="123456"
                                            className="w-full bg-surface border border-foreground/5 rounded-[10px] px-4 xs:px-6 py-3 xs:py-4 text-sm font-medium focus:outline-none focus:border-black transition-all"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-black text-white py-5 rounded-[10px] font-bold text-sm shadow-xl shadow-black/20 hover:scale-[1.02] transition-all mt-4"
                                >
                                    Save Address
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.2);
                }
            `}</style>
        </div>
    );
}
