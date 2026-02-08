'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt, FaStar, FaTruck, FaClock, FaUndo, FaCheckCircle, FaMinus, FaPlus, FaShoppingCart, FaBolt, FaQuestionCircle, FaAward, FaStore } from 'react-icons/fa';
import ChatWidget from '../../../../client/components/features/chat/ChatWidget';
import Breadcrumb from '../../../../client/components/ui/Breadcrumb';
import { useAuth } from '../../../../client/hooks/useAuth';
import { useCart } from '../../../../client/context/CartContext';
import { useSnackbar } from '../../../../client/context/SnackbarContext';
import { productService } from '../../../../lib/api/services/product.service';
import Link from 'next/link';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('description');
    const { showSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const data = await productService.getProductById(id as string);
                setProduct(data);
            } catch (error) {
                console.error('Failed to fetch product:', error);
                showSnackbar('Failed to load product details', 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    const handleAction = async (action: 'cart' | 'buy') => {
        // Find inventory record
        const inventory = product.inventory?.[0];
        if (!inventory) {
            showSnackbar('This product is currently unavailable', 'error');
            return;
        }

        try {
            await addToCart({
                inventoryId: inventory.id,
                productId: product.id,
                name: product.name,
                price: parseFloat(inventory.price),
                image: product.images[0],
                quantity,
                sellerId: inventory.dealer?.id,
                sellerName: inventory.dealer?.businessName,
                region: inventory.region,
                stock: inventory.stock
            });

            if (action === 'buy') {
                router.push('/checkout');
            } else {
                showSnackbar('Added to Cart successfully!', 'success');
            }
        } catch (error: any) {
            showSnackbar(error.message || 'Failed to add item to cart', 'error');
        }
    };

    if (isLoading) {
        return <div className="min-h-screen pt-32 flex justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div></div>;
    }

    if (!product) {
        return <div className="min-h-screen pt-32 text-center text-slate-500">Product not found.</div>;
    }

    // Determine primary seller (Buy Box) - Logic: First available dealer
    // In future: logic based on price, rating, location
    const primarySeller = product.inventory?.[0]?.dealer;
    const stock = product.inventory?.[0]?.stock || 0;
    const currentPrice = parseFloat(product.inventory?.[0]?.price || product.basePrice);
    const discount = product.inventory?.[0]?.discount;

    return (
        <div className="min-h-screen pt-28 pb-20 bg-slate-50/30">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <Breadcrumb
                    items={[
                        { label: 'Products', href: '/products' },
                        { label: product.category, href: `/products?cat=${product.category}` },
                        { label: product.name }
                    ]}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-8">
                    {/* Left: Product Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-[4/3] bg-white rounded-[3rem] border border-slate-100 overflow-hidden relative group shadow-sm">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-contain p-12"
                            />
                            {product.manufacturer?.isVerified && (
                                <div className="absolute top-8 left-8 bg-[#10367D] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-[#10367D]/20">
                                    <FaShieldAlt className="w-4 h-4" />
                                    Verified Quality
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                            {product.images?.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-24 h-24 rounded-2xl bg-white border-2 transition-all p-2 flex-shrink-0 ${selectedImage === idx ? 'border-[#10367D] shadow-md' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                >
                                    <img src={img} className="w-full h-full object-contain" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Product Details */}
                    <div className="flex flex-col">
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                {primarySeller && (
                                    <Link href={`/sellers/${primarySeller.id}`} className="bg-[#10367D]/5 text-[#10367D] px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest border border-[#10367D]/10 hover:bg-[#10367D]/10 transition-colors flex items-center gap-1">
                                        <FaStore className="w-3 h-3" />
                                        Sold by {primarySeller.businessName}
                                    </Link>
                                )}
                                <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-xl">
                                    <FaStar className="w-3 h-3 fill-current" />
                                    <span className="text-xs font-black">{product.averageRating?.toFixed(1) || 'New'}</span>
                                    <span className="text-[10px] font-bold text-amber-600/60 ml-1">({product.reviewCount || 0} reviews)</span>
                                </div>
                            </div>
                            <h1 className="text-4xl lg:text-5xl font-black text-[#1E293B] tracking-tight mb-6 leading-tight">
                                {product.name}
                            </h1>

                            {/* Price Breakdown */}
                            <div className="bg-white border border-[#10367D]/10 rounded-3xl p-6 mb-8 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaStar className="w-24 h-24 text-[#10367D]" />
                                </div>

                                <div className="relative z-10 flex flex-col gap-2">
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest line-through">
                                            MRP: ₹{Math.round(currentPrice * 1.25).toLocaleString()}
                                        </span>
                                        <div className="bg-emerald-100 text-emerald-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-200">
                                            <FaCheckCircle className="w-3 h-3" />
                                            <span>Save ₹{Math.round(currentPrice * 0.25).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-baseline gap-4">
                                        <span className="text-5xl lg:text-6xl font-black text-[#10367D] tracking-tighter">
                                            ₹{currentPrice.toLocaleString()}
                                        </span>
                                        <div className="flex flex-col mb-1">
                                            <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded uppercase tracking-widest border border-rose-100 mb-0.5">
                                                Limited Time Deal
                                            </span>
                                            <span className="text-[10px] font-bold text-slate-400 text-right">Inclusive of all taxes</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-slate-500 mb-6 line-clamp-3">{product.description}</p>
                        </div>

                        {/* Seller Card & Features */}
                        {primarySeller && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <Link href={`/sellers/${primarySeller.id}`} className="block group">
                                    <div className="p-6 rounded-[2rem] bg-white border border-[#10367D]/5 shadow-sm space-y-4 hover:shadow-md transition-shadow">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Distributor</span>
                                            {primarySeller.isVerified && (
                                                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full border border-emerald-100 italic">
                                                    <FaCheckCircle className="w-2.5 h-2.5" />
                                                    <span className="text-[8px] font-black uppercase">Verified Chain</span>
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-black text-[#1E293B] italic group-hover:text-[#10367D] transition-colors">{primarySeller.businessName}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex items-center gap-1 text-amber-500 text-xs">
                                                    <FaStar className="w-3 h-3 fill-current" />
                                                    <span className="font-bold">{primarySeller.averageRating?.toFixed(1) || 'N/A'}</span>
                                                </div>
                                                <div className="w-1 h-1 rounded-full bg-slate-200" />
                                                <span className="text-[10px] font-black text-[#10367D] uppercase">View Profile</span>
                                            </div>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Manufacturer Traceability</p>
                                            <p className="text-[10px] font-black text-[#1E293B]">{product.manufacturer?.companyName} <span className="text-slate-300 ml-1">| Original Seal</span></p>
                                        </div>
                                    </div>
                                </Link>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-[#1E293B]/60">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#10367D]">
                                            <FaTruck className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black">Dealer-Direct Fulfillment</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Tracked via Nova-Escrow Path</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-[#1E293B]/60">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[#10367D]">
                                            <FaAward className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black">15-Point Quality Audit</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Platform Governance Approved</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Quantity & CTA */}
                        {primarySeller && (
                            <div className="mb-10">
                                <div className="flex items-center gap-6 mb-8 bg-white/50 backdrop-blur-xl border border-[#10367D]/5 p-6 rounded-[2rem]">
                                    <div className="flex items-center gap-4">
                                        <button
                                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                            className="w-10 h-10 rounded-xl border border-[#10367D]/10 flex items-center justify-center hover:bg-[#10367D]/5"
                                        >
                                            <FaMinus className="w-3 h-3 text-[#10367D]" />
                                        </button>
                                        <span className="text-lg font-black text-[#1E293B] w-6 text-center">{quantity}</span>
                                        <button
                                            onClick={() => setQuantity(quantity + 1)}
                                            className="w-10 h-10 rounded-xl border border-[#10367D]/10 flex items-center justify-center hover:bg-[#10367D]/5"
                                        >
                                            <FaPlus className="w-3 h-3 text-[#10367D]" />
                                        </button>
                                    </div>
                                    <div className="text-sm font-bold text-slate-400">
                                        {stock > 0 ? (
                                            <>Only <span className="text-[#10367D]">{stock} items</span> left in stock!</>
                                        ) : (
                                            <span className="text-red-500">Out of Stock</span>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <button
                                        onClick={() => handleAction('cart')}
                                        disabled={stock <= 0}
                                        className="w-full py-5 bg-white border-2 border-[#10367D] text-[#10367D] font-black text-sm rounded-2xl shadow-xl shadow-[#10367D]/5 hover:bg-[#10367D]/5 transition-all uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaShoppingCart className="w-4 h-4" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() => handleAction('buy')}
                                        disabled={stock <= 0}
                                        className="w-full py-5 bg-[#10367D] text-white font-black text-sm rounded-2xl shadow-xl shadow-[#10367D]/20 hover:scale-[1.02] transition-all uppercase tracking-widest flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <FaBolt className="w-4 h-4" />
                                        Secure Buy now
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Trust-Controlled Chat Widget */}
                        {primarySeller && (
                            <ChatWidget
                                productId={id as string}
                                dealerId={primarySeller.id} // Passing Profile ID? Check ChatWidget props
                                dealerName={primarySeller.businessName}
                            />
                        )}

                        {/* Tabs */}
                        <div className="border-t border-[#10367D]/5 pt-8">
                            <div className="flex gap-8 mb-8 border-b border-[#10367D]/5">
                                {['description', 'specifications', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${activeTab === tab ? 'text-[#10367D]' : 'text-slate-400'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div layoutId="tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#10367D]" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="min-h-[200px]">
                                {activeTab === 'specifications' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {product.specifications && Object.entries(product.specifications).map(([key, val]) => (
                                            <div key={key} className="flex justify-between p-4 bg-white rounded-2xl border border-slate-50">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{key}</span>
                                                <span className="text-xs font-bold text-[#1E293B]">{String(val)}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : activeTab === 'reviews' ? (
                                    <div className="space-y-4">
                                        {product.reviews?.length > 0 ? (
                                            product.reviews.map((review: any, idx: number) => (
                                                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-100">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="flex text-amber-500">
                                                            {[...Array(5)].map((_, i) => (
                                                                <FaStar key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                                            ))}
                                                        </div>
                                                        <span className="text-xs font-bold text-slate-700">{review.customer.name}</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600">{review.comment}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-500 italic">No reviews yet.</p>
                                        )}
                                    </div>
                                ) : (
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed italic">
                                        {product.description}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
