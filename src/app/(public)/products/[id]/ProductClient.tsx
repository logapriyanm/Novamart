'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaShieldAlt,
    FaStar,
    FaTruck,
    FaClock,
    FaUndo,
    FaCheckCircle,
    FaMinus,
    FaPlus,
    FaShoppingCart,
    FaBolt,
    FaQuestionCircle,
    FaAward,
    FaStore,
    FaHandshake,
    FaSyncAlt,
    FaBriefcase,
    FaSearchPlus,
    FaChevronRight,
    FaBoxOpen,
    FaFileAlt
} from 'react-icons/fa';
import ChatWidget from '@/client/components/features/chat/ChatWidget';
import { useAuth } from '@/client/hooks/useAuth';
import { useCart } from '@/client/context/CartContext';
import { toast } from 'sonner';
import { productService } from '@/lib/api/services/product.service';
import Link from 'next/link';

interface ProductClientProps {
    id: string;
    initialData?: any;
}

export default function ProductClient({ id, initialData }: ProductClientProps) {
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const { addToCart } = useCart();
    const [product, setProduct] = useState<any>(initialData || null);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState('Specifications');
    const [isLoading, setIsLoading] = useState(!initialData);

    useEffect(() => {
        const fetchProductData = async () => {
            if (!id) return;
            try {
                const data = await productService.getProductById(id);
                setProduct(data);

                // Fetch related products (same category) for the bundle section
                if (data.category) {
                    const related = await productService.getAllProducts({
                        category: data.category,
                        limit: 3,
                        status: 'APPROVED'
                    });
                    setRelatedProducts(related.products.filter(p => p.id !== id));
                }
            } catch (error) {
                console.error('Failed to fetch product:', error);
                toast.error('Failed to load product details');
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductData();
    }, [id]);

    const handleAction = async (action: 'cart' | 'buy') => {
        const inventory = product.inventory?.[0];
        if (!inventory) {
            toast.error('This product is currently unavailable');
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
                toast.success('Added to Cart successfully!');
            }
        } catch (error: any) {
            toast.error(error.message || 'Failed to add item to cart');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen pt-32 flex justify-center bg-[#F9FAFB]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen pt-32 text-center text-slate-500 bg-[#F9FAFB]">
                Product not found.
            </div>
        );
    }

    const primarySeller = product.inventory?.[0]?.dealer;
    const stock = product.inventory?.[0]?.stock || 0;
    const currentPrice = parseFloat(product.inventory?.[0]?.price || product.basePrice);

    return (
        <div className="min-h-screen py-32 sm:py-42 pb-20 bg-[#F9FAFB]">
            <div className="max-w-[1400px] mx-auto px-4 xs:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-[9px] xs:text-[11px] font-black text-slate-400 uppercase tracking-widest mb-6 sm:mb-10 overflow-x-auto no-scrollbar whitespace-nowrap">
                    <Link href="/" className="hover:text-black transition-colors">Home</Link>
                    <FaChevronRight className="w-1.5 h-1.5 xs:w-2 xs:h-2" />
                    <Link href="/products" className="hover:text-black transition-colors">Products</Link>
                    <FaChevronRight className="w-1.5 h-1.5 xs:w-2 xs:h-2" />
                    <Link href={`/products?cat=${product.category}`} className="hover:text-black transition-colors">{product.category}</Link>
                    <FaChevronRight className="w-1.5 h-1.5 xs:w-2 xs:h-2" />
                    <span className="text-slate-300">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT COLUMN: Gallery & Specs */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* 1. Main Gallery */}
                        <div className="space-y-4 xs:space-y-6">
                            <div className="aspect-square sm:aspect-[16/10] bg-white rounded-[10px] border border-slate-200 overflow-hidden relative group shadow-sm flex items-center justify-center p-4 xs:p-8 bg-gradient-to-br from-white to-slate-50/50">
                                <motion.img
                                    key={selectedImage}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    src={product.images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-contain mix-blend-multiply"
                                />
                                <div className="absolute top-4 right-4 xs:top-6 xs:right-6 flex flex-col gap-2 xs:gap-3">
                                    <button className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-center hover:bg-white transition-all hover:scale-110 active:scale-95">
                                        <FaSearchPlus className="w-3 h-3 xs:w-4 xs:h-4 text-slate-600" />
                                    </button>
                                    <button className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-center hover:bg-white transition-all hover:scale-110 active:scale-95">
                                        <FaSyncAlt className="w-3 h-3 xs:w-4 xs:h-4 text-slate-600" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex gap-2 xs:gap-4 overflow-x-auto no-scrollbar py-2">
                                {product.images?.map((img: string, idx: number) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedImage(idx)}
                                        className={`w-16 h-16 xs:w-24 xs:h-24 rounded-[10px] bg-white border-2 transition-all p-1 xs:p-2 flex-shrink-0 flex items-center justify-center ${selectedImage === idx ? 'border-primary shadow-lg scale-105' : 'border-slate-100 opacity-60 hover:opacity-100 hover:border-slate-200'}`}
                                    >
                                        <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. Content Tabs */}
                        <div className="bg-white rounded-[10px] border border-slate-200 overflow-hidden shadow-sm">
                            <div className="flex border-b border-slate-100 bg-slate-50/30 overflow-x-auto no-scrollbar">
                                {['Specifications', 'Warranty & Manuals', 'In the Box'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`px-4 sm:px-10 py-4 sm:py-5 text-[9px] xs:text-[11px] font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap flex-1 lg:flex-none ${activeTab === tab ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                                    >
                                        {tab}
                                        {activeTab === tab && (
                                            <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
                                        )}
                                    </button>
                                ))}
                            </div>
                            <div className="p-6 xs:p-10">
                                {activeTab === 'Specifications' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                        <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-8 italic">Technical Specifications</h3>
                                        <div className="space-y-1">
                                            {product.specifications && Object.entries(product.specifications).map(([key, val], idx) => (
                                                <div key={key} className={`flex items-center py-4 px-6 ${idx % 2 === 0 ? 'bg-[#F9FAFB]' : 'bg-white'} rounded-[10px] transition-colors hover:bg-slate-50`}>
                                                    <span className="w-1/3 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">{key}</span>
                                                    <span className="flex-1 text-sm font-bold text-slate-800">{String(val)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'Warranty & Manuals' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 flex flex-col items-center justify-center py-12 text-center space-y-4">
                                        <FaFileAlt className="w-12 h-12 text-slate-200" />
                                        <div>
                                            <p className="font-black text-slate-900 uppercase italic">Manufacturer Documents</p>
                                            <p className="text-sm text-slate-400 mt-1">Download product manuals and warranty certificates.</p>
                                        </div>
                                        <button className="px-6 py-3 border-2 border-slate-200 rounded-[10px] text-[10px] font-black uppercase tracking-widest hover:border-black transition-all">Request PDF</button>
                                    </div>
                                )}
                                {activeTab === 'In the Box' && (
                                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-2 sm:grid-cols-4 gap-6">
                                        {['Main Unit', 'Power Cable', 'User Manual', 'Warranty Card'].map((item, i) => (
                                            <div key={i} className="bg-slate-50 p-4 rounded-[10px] border border-slate-100 flex flex-col items-center gap-3 text-center">
                                                <FaBoxOpen className="w-6 h-6 text-slate-300" />
                                                <span className="text-[10px] font-black text-slate-700 uppercase">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 3. FREQUENTLY BOUGHT TOGETHER */}
                        {relatedProducts.length > 0 && (
                            <div className="bg-white rounded-[10px] border border-slate-200 p-6 xs:p-10 shadow-sm relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-2 h-full bg-primary/10" />
                                <h3 className="text-lg xs:text-xl font-black text-slate-900 uppercase tracking-tight mb-8 sm:mb-10 italic">Frequently Bought Together</h3>
                                <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
                                    <div className="flex items-center justify-center gap-4 xs:gap-6 w-full md:w-auto">
                                        <div className="w-20 h-20 xs:w-28 xs:h-28 rounded-[10px] bg-slate-50 border border-slate-100 p-3 xs:p-4 shadow-inner shrink-0">
                                            <img src={product.images[0]} className="w-full h-full object-contain mix-blend-multiply" />
                                        </div>
                                        {relatedProducts.slice(0, 1).map((rp, idx) => (
                                            <React.Fragment key={rp.id}>
                                                <FaPlus className="w-3 h-3 text-slate-300 shrink-0" />
                                                <div className="w-20 h-20 xs:w-28 xs:h-28 rounded-[10px] bg-slate-50 border border-slate-100 p-3 xs:p-4 relative shadow-inner shrink-0">
                                                    <img src={rp.images[0]} className="w-full h-full object-contain mix-blend-multiply" />
                                                    <div className="absolute -top-1 -right-1 xs:-top-2 xs:-right-2 bg-primary text-white w-5 h-5 xs:w-6 xs:h-6 rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                                                        <FaCheckCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5" />
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        ))}
                                    </div>
                                    <div className="flex-1 w-full md:border-l md:border-slate-100 md:pl-12 text-center md:text-left space-y-2">
                                        <p className="text-[10px] xs:text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Bundle Price (2 items)</p>
                                        <div className="flex items-baseline gap-3 justify-center md:justify-start">
                                            <p className="text-3xl xs:text-4xl font-black text-slate-900 italic tracking-tighter">
                                                ₹{(currentPrice + relatedProducts[0]?.basePrice || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <button className="w-full sm:w-auto mt-6 px-6 sm:px-8 py-4 bg-primary text-white font-black text-[11px] xs:text-[12px] uppercase tracking-[0.1em] rounded-[10px] hover:shadow-xl hover:shadow-primary/20 transition-all hover:scale-[1.03] active:scale-95">
                                            Add Bundle to Cart
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* 4. CUSTOMER REVIEWS */}
                        <div className="bg-white rounded-[10px] border border-slate-200 p-6 xs:p-10 shadow-sm">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12">
                                <h3 className="text-lg xs:text-xl font-black text-slate-900 uppercase tracking-tight italic">Customer Reviews</h3>
                                <button className="w-full sm:w-auto text-[10px] xs:text-[11px] font-black uppercase tracking-widest text-primary border-2 border-primary/10 bg-primary/5 px-6 py-3 rounded-[10px] hover:bg-primary hover:text-white transition-all active:scale-95 shadow-sm">Write a Review</button>
                            </div>
                            <div className="flex flex-col md:flex-row gap-16">
                                <div className="md:w-1/3 space-y-2">
                                    <div className="flex items-baseline gap-4">
                                        <p className="text-7xl font-black text-slate-900 tracking-tighter italic">
                                            {product.averageRating?.toFixed(1) || '0.0'}
                                        </p>
                                        <div className="space-y-1">
                                            <div className="flex text-amber-400 gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={`w-5 h-5 ${i < Math.round(product.averageRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Score</p>
                                        </div>
                                    </div>
                                    <p className="text-[11px] font-bold text-slate-400 mt-4 leading-relaxed uppercase">
                                        Verified performance aggregate based on {product.reviewCount || 0} individual reviews.
                                    </p>
                                </div>
                                <div className="flex-1 space-y-4">
                                    {[5, 4, 3, 2, 1].map((star) => {
                                        const count = product.reviews?.filter((r: any) => Math.round(r.rating) === star).length || 0;
                                        const perc = product.reviewCount > 0 ? (count / product.reviewCount) * 100 : 0;
                                        return (
                                            <div key={star} className="flex items-center gap-6 group cursor-default">
                                                <span className="text-[11px] font-black text-slate-400 w-12 uppercase tracking-widest group-hover:text-slate-900 transition-colors">{star} Star</span>
                                                <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${perc}%` }}
                                                        transition={{ duration: 1, delay: 0.2 }}
                                                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
                                                    />
                                                </div>
                                                <span className="text-[11px] font-black text-slate-400 w-10 text-right uppercase tracking-widest group-hover:text-slate-900 transition-colors">
                                                    {Math.round(perc)}%
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-16 space-y-10 pt-10 border-t border-slate-100">
                                {product.reviews?.length > 0 ? (
                                    product.reviews.map((review: any, idx: number) => (
                                        <div key={idx} className="space-y-6 animate-in fade-in duration-700">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-slate-200 to-slate-100 flex items-center justify-center text-[11px] font-black text-slate-500 border border-white shadow-sm uppercase">
                                                        {review.customer?.name?.substring(0, 2) || 'U'}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-black text-slate-900 uppercase italic">
                                                            {review.customer?.name} <span className="text-[9px] font-black text-emerald-500 ml-3 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 not-italic tracking-[0.1em]">Verified Purchase</span>
                                                        </p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter space-x-2">
                                                            <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex text-amber-400 gap-1 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100/50">
                                                    {[...Array(5)].map((_, i) => (
                                                        <FaStar key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-200'}`} />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="pl-16 space-y-4">
                                                <p className="text-sm text-slate-500 leading-bold font-medium max-w-2xl">
                                                    {review.comment}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-slate-400 text-sm italic py-10">No reviews yet for this product.</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Buy Box & Sidebar */}
                    <div className="lg:col-span-4 space-y-8">
                        {/* 1. Buying Section */}
                        <div className="bg-white rounded-[10px] border border-slate-200 p-6 xs:p-10 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full pointer-events-none" />

                            <div className="pb-6 xs:pb-8 border-b border-slate-100 mb-6 xs:mb-8 space-y-4 xs:space-y-6">
                                <div className="flex items-center justify-between gap-4">
                                    <span className="bg-primary text-white text-[8px] xs:text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.2em] shadow-lg shadow-primary/20 italic">Authorised Seller</span>
                                    <span className="text-[9px] xs:text-[10px] font-black text-slate-300 uppercase tracking-widest break-all">SKU: {product.sku || product.id?.substring(0, 8).toUpperCase()}</span>
                                </div>
                                <h1 className="text-2xl xs:text-3xl sm:text-4xl font-black text-slate-900 leading-[1.1] mb-2 uppercase italic tracking-tighter">
                                    {product.name}
                                </h1>
                                <div className="flex items-center gap-3">
                                    <div className="flex text-amber-400 gap-0.5">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.averageRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                        ))}
                                    </div>
                                    <span className="text-xs font-black text-slate-900 italic tracking-tight">
                                        {product.averageRating?.toFixed(1) || '0.0'}
                                        <span className="text-slate-300 not-italic ml-1">({product.reviewCount || 0} reviews)</span>
                                    </span>
                                    {/* Removed Compare Dealers button */}
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="flex flex-col xs:flex-row items-center justify-between gap-6 xs:gap-0">
                                    <div className="space-y-3 xs:space-y-4 text-center xs:text-left">
                                        <div className="bg-emerald-500 text-white text-[9px] xs:text-[10px] font-black px-3 py-1.5 rounded-[10px] uppercase tracking-[0.1em] shadow-lg shadow-emerald-500/20 mb-1 flex items-center gap-2 w-fit mx-auto xs:mx-0 italic">
                                            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                                            Lowest Price
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-4xl xs:text-5xl sm:text-6xl font-black text-slate-900 tracking-tighter leading-none italic">₹{currentPrice.toLocaleString()}</span>
                                            <p className="text-[10px] xs:text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-2 xs:mt-3">List Price: <span className="line-through">₹{(currentPrice * 1.25).toLocaleString()}</span></p>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end gap-1">
                                        <div className={`px-3 py-1 rounded-full border ${stock > 0 ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
                                            <p className={`text-[11px] font-black ${stock > 0 ? 'text-emerald-600' : 'text-rose-600'} uppercase tracking-wider`}>
                                                {stock > 0 ? 'In Stock' : 'Out of Stock'}
                                            </p>
                                        </div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter italic">
                                            {stock > 0 ? 'Ready to ship' : 'Unavailable'}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-5 pt-8 border-t border-slate-50">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                                            <FaTruck className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight leading-tight">Free Express Shipping</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-0.5">Delivery in 2-3 Business Days</p>
                                        </div>
                                    </div>
                                    {primarySeller && (
                                        <div className="flex items-start gap-4 p-5 bg-slate-50/50 rounded-[10px] border border-slate-100/50 hover:bg-white hover:border-primary/20 transition-all group">
                                            <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-all">
                                                <FaStore className="w-6 h-6 text-primary" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Link href={`/sellers/${primarySeller.id}`} className="text-[11px] font-black text-slate-900 uppercase italic tracking-tight leading-tight hover:text-primary transition-colors">
                                                        Sold by <span className="underline underline-offset-2">{primarySeller.businessName}</span>
                                                    </Link>
                                                    {primarySeller.isVerified && (
                                                        <FaCheckCircle className="w-3 h-3 text-emerald-500" title="Verified Seller" />
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className="flex text-amber-400 gap-0.5">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className={`w-2.5 h-2.5 ${i < Math.round(primarySeller.averageRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">({primarySeller.averageRating?.toFixed(1) || 'N/A'})</span>
                                                </div>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1 italic">
                                                    {primarySeller.city || 'Regional Outlet'}, {primarySeller.state || 'India'}
                                                </p>
                                                <Link href={`/sellers/${primarySeller.id}`} className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mt-3 block hover:translate-x-1 transition-transform">
                                                    Visit Store Profile →
                                                </Link>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-4 pt-6">
                                    <button
                                        onClick={() => handleAction('cart')}
                                        className="w-full bg-primary text-white py-5 rounded-[10px] font-black text-[13px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 flex items-center justify-center gap-4 hover:scale-[1.03] transition-all active:scale-95 group overflow-hidden relative"
                                    >
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 slant" />
                                        <FaShoppingCart className="w-5 h-5" />
                                        Add to Cart
                                    </button>
                                    {/* Removed Request Bulk Quote button */}
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-8">
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[10px] border border-slate-100/50">
                                        <FaShieldAlt className="w-5 h-5 text-slate-300" />
                                        <div className="text-left leading-tight">
                                            <p className="text-[10px] font-black text-slate-900 uppercase italic">2 Year Warranty</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Full Coverage</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-[10px] border border-slate-100/50">
                                        <FaUndo className="w-5 h-5 text-slate-300" />
                                        <div className="text-left leading-tight">
                                            <p className="text-[10px] font-black text-slate-900 uppercase italic">30-Day Returns</p>
                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Hassle Free</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Removed Compare Dealers Widget */}

                        {/* 3. Business Benefits Widget */}
                        <div className="bg-[#10367D] rounded-[10px] p-8 shadow-xl shadow-blue-900/10 text-white relative overflow-hidden">
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-[10px] bg-white/10 flex items-center justify-center backdrop-blur-md">
                                    <FaBriefcase className="w-5 h-5 text-blue-100" />
                                </div>
                                <h3 className="text-[12px] font-black uppercase tracking-[0.2em] italic">Business Benefits</h3>
                            </div>
                            <ul className="space-y-5">
                                {[
                                    'Eligible for tax exemption for business accounts',
                                    'Net-30 payment terms available on approval',
                                    'Dedicated account manager for orders over $10K'
                                ].map((benefit, i) => (
                                    <li key={i} className="flex gap-4 group cursor-default">
                                        <div className="w-2 h-2 rounded-full bg-blue-300 mt-2 shrink-0 group-hover:scale-125 transition-transform" />
                                        <p className="text-[11px] font-bold text-blue-100 leading-relaxed uppercase tracking-tight">{benefit}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Float Menu or Chat Widget */}
            {primarySeller && (
                <ChatWidget
                    productId={id as string}
                    dealerId={primarySeller.id}
                    dealerName={primarySeller.businessName}
                />
            )}

            <style jsx>{`
                .slant {
                    transform: skewX(-20deg);
                }
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
