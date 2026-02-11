'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { orderService } from '@/lib/api/services/order.service';
import { paymentService } from '@/lib/api/services/payment.service';
import { HiOutlineCreditCard, HiOutlineLockClosed, HiOutlineShieldCheck } from 'react-icons/hi';
import { toast } from 'sonner';

// Extend window for Razorpay types
declare global {
    interface Window {
        Razorpay: any;
    }
}

export default function PaymentPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    // const { showSnackbar } = useSnackbar();

    useEffect(() => {
        if (!orderId) {
            router.push('/checkout');
            return;
        }

        const fetchOrder = async () => {
            try {
                const res = await orderService.getOrderById(orderId);
                setOrder(res.data);
            } catch (err) {
                console.error('Failed to load order:', err);
                setError('Could not load order details.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();

        // Load Razorpay script
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, [orderId, router]);

    const handlePayment = async () => {
        if (!orderId) return;

        setIsProcessing(true);
        try {
            // 1. Create payment order on backend
            const paymentOrder = await paymentService.createPaymentOrder(orderId);

            if (!paymentOrder.success) {
                throw new Error('Failed to create payment order');
            }

            const { razorpayOrderId, amount, currency, key, isMock } = paymentOrder.data;

            // 2a. If mock mode, simulate payment
            if (isMock) {
                toast.info('Mock payment mode - auto-completing');

                setTimeout(async () => {
                    try {
                        const verifyRes = await paymentService.verifyPayment({
                            orderId,
                            razorpay_order_id: razorpayOrderId,
                            razorpay_payment_id: `mock_payment_${Date.now()}`,
                            razorpay_signature: 'mock_signature'
                        });

                        if (verifyRes.success) {
                            toast.success('Payment successful!');
                            router.push(`/checkout/success?id=${orderId}`);
                        } else {
                            throw new Error('Payment verification failed');
                        }
                    } catch (err: any) {
                        toast.error(err.message || 'Payment failed');
                    } finally {
                        setIsProcessing(false);
                    }
                }, 1500);

                return;
            }

            // 2b. Real Razorpay integration
            if (typeof window.Razorpay === 'undefined') {
                toast.error('Payment gateway not loaded. Please refresh.');
                setIsProcessing(false);
                return;
            }

            const options = {
                key,
                amount,
                currency,
                name: 'NovaMart',
                description: `Order #${orderId.slice(0, 8)}`,
                order_id: razorpayOrderId,
                handler: async function (response: any) {
                    try {
                        // Verify payment on backend
                        const verifyRes = await paymentService.verifyPayment({
                            orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.success) {
                            toast.success('Payment successful!');
                            router.push(`/checkout/success?id=${orderId}`);
                        } else {
                            toast.error('Payment verification failed');
                        }
                    } catch (err: any) {
                        console.error('Payment verification error:', err);
                        toast.error(err.message || 'Payment verification failed');
                    } finally {
                        setIsProcessing(false);
                    }
                },
                prefill: {
                    name: order.customer?.name || '',
                    email: order.customer?.email || '',
                    contact: order.customer?.phone || ''
                },
                theme: {
                    color: '#FF5733'
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.warning('Payment cancelled');
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response: any) {
                toast.error('Payment failed: ' + response.error.description);
                setIsProcessing(false);
            });

            rzp.open();

        } catch (err: any) {
            console.error('Payment Error:', err);
            toast.error(err.message || 'Payment processing failed');
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-background text-foreground/50 font-bold uppercase tracking-widest text-xs">Processing Secure Transaction...</div>;

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
            <p className="text-red-500 font-bold uppercase tracking-widest">{error}</p>
            <button onClick={() => window.location.reload()} className="text-primary underline font-bold text-xs uppercase tracking-widest">Try Again</button>
        </div>
    );

    return (
        <div className="min-h-screen pt-24 pb-24 bg-background">
            <div className="max-w-3xl mx-auto px-6 lg:px-12">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-black text-foreground tracking-tight mb-2 italic uppercase">Secure <span className="text-black">Payment</span></h1>
                    <p className="text-foreground/40 font-bold uppercase tracking-widest text-xs">Order ID: {orderId?.slice(0, 8)}</p>
                </header>

                <div className="bg-white rounded-[10px] border border-foreground/[0.03] shadow-xl shadow-foreground/[0.02] overflow-hidden p-8 lg:p-12">
                    {/* Order Summary */}
                    <div className="mb-10 text-center">
                        <p className="text-[10px] font-black text-foreground/30 uppercase tracking-[0.2em] mb-2">Total Amount Due</p>
                        <p className="text-5xl font-black text-black tracking-tighter italic">
                            ₹{Number(order?.totalAmount || 0).toLocaleString('en-IN')}
                        </p>
                    </div>

                    {/* Escrow Notice */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-[10px] p-6 mb-10 flex items-start gap-4">
                        <div className="w-10 h-10 bg-emerald-500/10 rounded-[10px] flex items-center justify-center text-emerald-600 shrink-0">
                            <HiOutlineShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black text-emerald-600 uppercase tracking-widest mb-1 italic">Escrow Protection Active</h4>
                            <p className="text-[10px] font-bold text-emerald-900/60 leading-relaxed uppercase tracking-widest">
                                Your payment will be held securely in escrow. The seller will not receive funds until you confirm delivery of your order.
                            </p>
                        </div>
                    </div>

                    {/* Payment Form */}
                    <div className="space-y-6">
                        <div className="flex flex-col gap-2">
                            <label className="text-[10px] font-black text-foreground/50 uppercase tracking-widest">Razorpay Secure Checkout</label>
                            <div className="grid grid-cols-1 gap-4">
                                <div className="border-2 border-black/20 bg-black/5 text-foreground rounded-[10px] p-4 flex items-center justify-center gap-2 font-black text-xs uppercase tracking-widest">
                                    <HiOutlineCreditCard className="w-4 h-4 text-black" />
                                    <span>Card / UPI / Net Banking / Wallet</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handlePayment}
                            disabled={isProcessing}
                            className="w-full bg-black text-white py-5 rounded-[10px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-black/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <HiOutlineLockClosed className="w-4 h-4" />
                            {isProcessing ? 'Processing...' : 'Pay Securely with Razorpay'}
                        </button>

                        <p className="text-center text-[9px] text-foreground/30 uppercase tracking-widest">
                            Powered by Razorpay • PCI DSS Compliant
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center text-[9px] font-bold text-foreground/20 uppercase tracking-widest">
                    Powered by NovaMart Secure Escrow • 256-Bit SSL Encryption
                </div>
            </div>
        </div>
    );
}
