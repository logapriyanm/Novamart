'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HiOutlineLockClosed,
    HiOutlineShieldCheck,
    HiOutlineCreditCard,
    HiOutlineLibrary,
    HiOutlineCheckCircle,
    HiOutlineArrowRight,
    HiOutlineTruck,
} from 'react-icons/hi';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api/client';
import { useCart } from '@/client/context/CartContext';
import { useAuth } from '@/client/hooks/useAuth';
import { orderService } from '@/lib/api/services/order.service';
import { customerService } from '@/lib/api/services/customer.service';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

const DeliveryMap = dynamic(() => import('@/client/components/features/checkout/DeliveryMap'), { ssr: false });
const AddressSelectorMap = dynamic(() => import('@/client/components/features/checkout/AddressSelectorMap'), { ssr: false });

export default function CheckoutPage() {
    const { cart, total, subtotal, totalSavings, clearCart } = useCart();
    const { isAuthenticated, isLoading: authLoading, user } = useAuth();
    const router = useRouter();
    const [step, setStep] = useState(2);
    const [isProcessing, setIsProcessing] = useState(false);

    // Payment method state
    const [paymentMethod, setPaymentMethod] = useState('razorpay');

    // Address form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [saveAddress, setSaveAddress] = useState(false);
    const [profileAddressLoaded, setProfileAddressLoaded] = useState(false);
    const [hasProfileAddress, setHasProfileAddress] = useState(false);
    const [useProfileAddress, setUseProfileAddress] = useState(false);
    const [profileAddresses, setProfileAddresses] = useState<any[]>([]);

    // Guest protection
    React.useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            toast.error('Please login to proceed with checkout');
            router.push(`/auth/login?redirect=/checkout`);
        }
    }, [isAuthenticated, authLoading, router]);

    // Load profile address on mount
    React.useEffect(() => {
        if (isAuthenticated && !profileAddressLoaded) {
            const loadProfile = async () => {
                try {
                    const profile = await customerService.getProfile();
                    if (profile) {
                        // Pre-fill name from profile
                        if (profile.name) {
                            const nameParts = profile.name.split(' ');
                            setFirstName(nameParts[0] || '');
                            setLastName(nameParts.slice(1).join(' ') || '');
                        }

                        if (profile.addresses && profile.addresses.length > 0) {
                            setProfileAddresses(profile.addresses);
                            setHasProfileAddress(true);
                            // Auto-fill the first/default address
                            const defaultAddr = profile.addresses.find((a: any) => a.isDefault) || profile.addresses[0];
                            if (defaultAddr) {
                                setAddressLine1(defaultAddr.line1 || '');
                                setCity(defaultAddr.city || '');
                                setState(defaultAddr.state || '');
                                setZipCode(defaultAddr.zip || '');
                                setUseProfileAddress(true);
                            }
                        }
                    }
                    setProfileAddressLoaded(true);
                } catch (error) {
                    console.error('Failed to load profile', error);
                    setProfileAddressLoaded(true);
                }
            };
            loadProfile();
        }
    }, [isAuthenticated, profileAddressLoaded]);

    const taxEstimate = subtotal * 0.08;
    const finalTotal = subtotal + taxEstimate;

    const handleCreateOrder = async () => {
        if (!firstName.trim() || !lastName.trim() || !addressLine1.trim() || !city.trim() || !zipCode.trim()) {
            toast.error('Please fill in all required address fields');
            return;
        }

        const shippingAddress = {
            name: `${firstName} ${lastName}`.trim(),
            line1: addressLine1,
            city,
            state,
            zip: zipCode,
            label: 'Checkout Address',
            type: 'home'
        };

        // Save address to profile if user opted in
        if (saveAddress && !useProfileAddress) {
            try {
                await customerService.addAddress(shippingAddress);
                toast.success('Address saved to your profile!');
            } catch (err) {
                console.error('Failed to save address', err);
            }
        }

        setIsProcessing(true);
        try {
            const payload = {
                items: cart.map(item => ({
                    productId: item.productId,
                    quantity: item.quantity,
                    inventoryId: item.inventoryId,
                    sellerId: item.sellerId,
                    manufacturerId: item.manufacturerId,
                    price: item.price
                })),
                shippingAddress,
                paymentMethod
            };

            if (paymentMethod === 'cod') {
                // For Cash on Delivery, create order directly
                const orderRes: any = await apiClient.post('/orders/checkout/initiate', payload);
                if (orderRes.success || orderRes.orderId || orderRes.razorpayOrderId) {
                    await clearCart();
                    toast.success('Order placed successfully! You will pay on delivery.');
                    router.push(`/checkout/success?method=cod`);
                } else {
                    toast.error(orderRes.error || 'Failed to place order');
                }
            } else {
                // Razorpay or Wire Transfer
                const initiateRes: any = await apiClient.post('/orders/checkout/initiate', payload);
                if (initiateRes.success && initiateRes.razorpayOrderId) {
                    toast.success('Checkout initiated successfully!');
                    router.push(`/checkout/payment?razorpay_order_id=${initiateRes.razorpayOrderId}`);
                } else if (initiateRes.razorpayOrderId) {
                    router.push(`/checkout/payment?razorpay_order_id=${initiateRes.razorpayOrderId}`);
                } else {
                    toast.error(initiateRes.error || 'Failed to initiate checkout.');
                }
            }
        } catch (error: any) {
            console.error('Checkout Error:', error);
            toast.error(error.message || 'Failed to create order. Please try again.');
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
        <div className="min-h-screen pt-20 pb-16 bg-gray-50">
            <div className="max-w-[1100px] mx-auto px-4 sm:px-6">
                {/* Buyer Protection Banner */}
                <div className="bg-white border border-gray-200 rounded-lg p-4 mb-8 flex items-start gap-3">
                    <HiOutlineShieldCheck className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                        <h4 className="text-sm font-bold text-gray-900">Buyer Protection</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Your purchase is protected from click to delivery. Full refund if item is not as described.</p>
                        <Link href="/support" className="text-xs font-semibold text-primary hover:underline mt-1 inline-block">Learn More →</Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Side: Forms */}
                    <div className="lg:col-span-7 space-y-8">

                        {/* Shipping Address Section */}
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <span className="text-lg">📦</span>
                                <h3 className="text-lg font-bold text-gray-900">Shipping Address</h3>
                            </div>

                            {/* Profile Address Notice */}
                            {hasProfileAddress && useProfileAddress && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-5 flex items-center justify-between">
                                    <p className="text-xs text-blue-700">Using your saved profile address.</p>
                                    <button
                                        onClick={() => {
                                            setUseProfileAddress(false);
                                            setAddressLine1('');
                                            setCity('');
                                            setState('');
                                            setZipCode('');
                                        }}
                                        className="text-xs font-semibold text-blue-700 hover:underline"
                                    >
                                        Enter new address
                                    </button>
                                </div>
                            )}

                            {/* Profile Address Selection */}
                            {hasProfileAddress && !useProfileAddress && profileAddresses.length > 0 && (
                                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-5">
                                    <p className="text-xs text-gray-600 mb-2 font-medium">Use a saved address:</p>
                                    <div className="space-y-2">
                                        {profileAddresses.map((addr: any) => (
                                            <button
                                                key={addr._id}
                                                onClick={() => {
                                                    setAddressLine1(addr.line1 || '');
                                                    setCity(addr.city || '');
                                                    setState(addr.state || '');
                                                    setZipCode(addr.zip || '');
                                                    if (addr.name) {
                                                        const parts = addr.name.split(' ');
                                                        setFirstName(parts[0] || '');
                                                        setLastName(parts.slice(1).join(' ') || '');
                                                    }
                                                    setUseProfileAddress(true);
                                                }}
                                                className="w-full text-left p-2 rounded-lg border border-gray-200 hover:border-primary hover:bg-white transition-all text-xs text-gray-700"
                                            >
                                                <span className="font-semibold">{addr.label || 'Address'}</span> — {addr.line1}, {addr.city} {addr.zip}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">First Name</label>
                                        <input
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="John"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary transition-colors bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Last Name</label>
                                        <input
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Doe"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary transition-colors bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Address Line 1</label>
                                    <input
                                        type="text"
                                        value={addressLine1}
                                        onChange={(e) => setAddressLine1(e.target.value)}
                                        placeholder="123 Shopping Lane"
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary transition-colors bg-white"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">City</label>
                                        <input
                                            type="text"
                                            value={city}
                                            onChange={(e) => setCity(e.target.value)}
                                            placeholder="New York"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary transition-colors bg-white"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">Zip Code</label>
                                        <input
                                            type="text"
                                            value={zipCode}
                                            onChange={(e) => setZipCode(e.target.value)}
                                            placeholder="10001"
                                            className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary transition-colors bg-white"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5 block">State</label>
                                    <input
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="State"
                                        className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:border-primary transition-colors bg-white"
                                    />
                                </div>

                                {/* Save Address Checkbox (only show if not using profile address) */}
                                {!useProfileAddress && (
                                    <label className="flex items-center gap-2 cursor-pointer mt-2">
                                        <input
                                            type="checkbox"
                                            checked={saveAddress}
                                            onChange={(e) => setSaveAddress(e.target.checked)}
                                            className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <span className="text-xs text-gray-600">Save this address to my profile</span>
                                    </label>
                                )}

                                {/* Embedded Map for Address Selection */}
                                <div className="mt-6 border-t border-gray-100 pt-4">
                                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <span className="text-base">📍</span> Pinpoint Location
                                    </p>
                                    <AddressSelectorMap
                                        onAddressSelect={(addr: any) => {
                                            setAddressLine1(addr.line1 || '');
                                            setCity(addr.city || '');
                                            setState(addr.state || '');
                                            setZipCode(addr.zip || '');
                                            setUseProfileAddress(false);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Security Badges */}
                        <div className="flex items-center justify-center gap-6 py-4">
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <HiOutlineLockClosed className="w-4 h-4" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">SSL Secured</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-gray-400">
                                <HiOutlineShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-semibold uppercase tracking-wider">PCI Compliant</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Order Summary */}
                    <aside className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">
                        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Structured Commerce. Trusted Connections.</p>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Cart Items */}
                                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                                    {cart.map((item) => (
                                        <div key={item.id} className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-gray-50 rounded-lg p-1.5 flex-shrink-0 flex items-center justify-center border border-gray-100">
                                                <img
                                                    src={item.image || '/placeholder.png'}
                                                    alt={item.name}
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        const target = e.target as HTMLImageElement;
                                                        target.src = '/placeholder.png';
                                                    }}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="text-sm font-semibold text-gray-900 truncate">{item.name}</h4>
                                                <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                                                <p className="text-sm font-bold text-primary">₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-gray-100 pt-4 space-y-2.5">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Subtotal</span>
                                        <span className="font-semibold text-gray-900">₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                    {totalSavings > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-green-600">Savings</span>
                                            <span className="font-semibold text-green-600">-₹{totalSavings.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Shipping</span>
                                        <span className="font-bold text-green-500">FREE</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Tax</span>
                                        <span className="font-semibold text-gray-900">₹{taxEstimate.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-base font-bold text-gray-900">Total</span>
                                        <span className="text-2xl font-black text-gray-900">₹{finalTotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method - Moved to Right Side */}
                        <div className="p-6 border-t border-gray-100 bg-gray-50/50">
                            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <HiOutlineCreditCard className="w-4 h-4 text-primary" />
                                Payment Method
                            </h3>

                            <div className="space-y-3 mb-6">
                                {/* Razorpay */}
                                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'razorpay' ? 'border-primary bg-white shadow-sm ring-1 ring-primary/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <input type="radio" name="payment-side" value="razorpay" checked={paymentMethod === 'razorpay'} onChange={() => setPaymentMethod('razorpay')} className="w-4 h-4 text-primary focus:ring-primary" />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Online Payment</span>
                                </label>

                                {/* COD */}
                                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-primary bg-white shadow-sm ring-1 ring-primary/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <input type="radio" name="payment-side" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-primary focus:ring-primary" />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Cash on Delivery</span>
                                </label>

                                {/* Wire */}
                                <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${paymentMethod === 'wire' ? 'border-primary bg-white shadow-sm ring-1 ring-primary/20' : 'border-gray-200 bg-white hover:border-gray-300'}`}>
                                    <input type="radio" name="payment-side" value="wire" checked={paymentMethod === 'wire'} onChange={() => setPaymentMethod('wire')} className="w-4 h-4 text-primary focus:ring-primary" />
                                    <span className="ml-3 text-sm font-medium text-gray-700">Wire Transfer</span>
                                </label>
                            </div>

                            <button
                                onClick={handleCreateOrder}
                                disabled={isProcessing || cart.length === 0}
                                className="w-full py-4 bg-black text-white font-bold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-3 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-black/5"
                            >
                                {isProcessing ? 'Processing...' : 'Place Order'}
                                <HiOutlineArrowRight className="w-4 h-4" />
                            </button>
                            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-3">Secure Encrypted Checkout</p>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
