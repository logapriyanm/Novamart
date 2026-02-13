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
    FaFileAlt,
    FaCommentAlt
} from 'react-icons/fa';
import ChatWidget from '@/client/components/features/chat/ChatWidget';
import { useAuth } from '@/client/hooks/useAuth';
import { useCart } from '@/client/context/CartContext';
import { toast } from 'sonner';
import { productService } from '@/lib/api/services/product.service';
import Link from 'next/link';
import Loader from '@/client/components/ui/Loader';
import CustomerProductCard from '@/client/components/ui/CustomerProductCard';
import ReviewList from '@/client/components/features/reviews/ReviewList';

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
                        limit: 4,
                        status: 'APPROVED'
                    });

                    const adaptedRelated = related.products
                        .filter((p: any) => p.id !== id)
                        .map((p: any) => ({
                            id: p.id,
                            inventoryId: p.inventory?.[0]?._id,
                            name: p.name,
                            price: p.inventory?.[0]?.price || p.basePrice,
                            originalPrice: p.inventory?.[0]?.originalPrice || p.basePrice,
                            image: p.images?.[0] || 'https://placehold.co/400x400?text=No+Image',
                            brand: p.manufacturer?.companyName || 'NovaMart',
                            spec: p.category,
                            subCategory: p.specifications?.subCategory,
                            rating: p.averageRating || 0,
                            reviewsCount: p.reviewCount || 0,
                            seller: {
                                id: p.inventory?.[0]?.dealerId?._id,
                                name: p.inventory?.[0]?.dealerId?.businessName || p.manufacturer?.companyName || 'Verified Seller',
                                isVerified: p.manufacturer?.isVerified || false
                            },
                            inStock: (p.inventory?.[0]?.stock || 0) > 0,
                            colors: p.colors || [],
                            sizes: p.sizes || [],
                            highlights: {
                                freeDelivery: p.basePrice > 2000,
                                installation: p.category?.toLowerCase() === 'machinery',
                                warranty: p.specifications?.warranty || '1 Year'
                            },
                            description: p.description,
                            stockStatus: (p.inventory?.[0]?.stock || 0) > 10 ? 'IN_STOCK' : (p.inventory?.[0]?.stock || 0) > 0 ? 'LOW_STOCK' : 'OUT_OF_STOCK'
                        }));

                    setRelatedProducts(adaptedRelated);
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
                <Loader size="lg" variant="primary" />
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
    const highlights = product.highlights || {};

    return (
        <div className="min-h-screen pt-32 pb-20 bg-white">
            <div className="max-w-[1400px] mx-auto px-4 xs:px-6">
                {/* Breadcrumbs */}
                <nav className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-8">
                    <Link href="/" className="hover:text-primary transition-colors">Home</Link>
                    <FaChevronRight className="w-2 h-2 opacity-30" />
                    <Link href="/products" className="hover:text-primary transition-colors">Products</Link>
                    <FaChevronRight className="w-2 h-2 opacity-30" />
                    <Link href={`/products?cat=${product.category}`} className="hover:text-primary transition-colors">{product.category}</Link>
                    <FaChevronRight className="w-2 h-2 opacity-30" />
                    <span className="text-foreground">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
                    {/* LEFT: Gallery */}
                    <div className="space-y-6">
                        <div className="aspect-square bg-slate-50 border border-slate-100 rounded-[20px] p-8 flex items-center justify-center relative overflow-hidden group">
                            <motion.img
                                key={selectedImage}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                src={product.images[selectedImage]}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                            />
                            <div className="absolute top-4 right-4 flex flex-col gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center text-muted-foreground hover:text-primary transition-colors">
                                    <FaSearchPlus className="w-4 h-4" />
                                </button>
                            </div>
                            {highlights?.freeDelivery && (
                                <div className="absolute top-4 left-4 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold border border-emerald-100">
                                    Free Shipping
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                            {product.images?.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`w-20 h-20 rounded-[12px] bg-muted/20 border-2 flex-shrink-0 p-2 ${selectedImage === idx ? 'border-primary' : 'border-border hover:border-foreground/30'} transition-all`}
                                >
                                    <img src={img} className="w-full h-full object-contain mix-blend-multiply" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Info */}
                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Link href={`/sellers/${primarySeller?.id}`} className="text-xs font-bold text-primary hover:underline">
                                    {primarySeller?.businessName || 'NovaMart Official'}
                                </Link>
                                {primarySeller?.isVerified && (
                                    <FaCheckCircle className="w-3.5 h-3.5 text-primary" title="Verified Seller" />
                                )}
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight mb-4">
                                {product.name}
                            </h1>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-[6px] border border-amber-100">
                                    <span className="text-sm font-bold text-slate-900">{product.averageRating?.toFixed(1) || '0.0'}</span>
                                    <FaStar className="w-3.5 h-3.5 text-amber-400" />
                                </div>
                                <span className="text-xs font-medium text-slate-400">
                                    {product.reviewCount || 0} Ratings & Reviews
                                </span>
                            </div>
                        </div>

                        <div className="p-6 bg-muted/20 rounded-[16px] border border-border mb-8">
                            <div className="flex items-end gap-3 mb-2">
                                <span className="text-4xl font-bold text-foreground">₹{currentPrice.toLocaleString()}</span>
                                {product.basePrice > currentPrice && (
                                    <>
                                        <span className="text-lg text-muted-foreground line-through font-medium mb-1.5">₹{product.basePrice.toLocaleString()}</span>
                                        <span className="mb-2 bg-emerald-100 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-[4px]">
                                            -{Math.round(((product.basePrice - currentPrice) / product.basePrice) * 100)}% OFF
                                        </span>
                                    </>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">Inclusive of all taxes</p>
                        </div>

                        <div className="space-y-4 mb-8">
                            {primarySeller && (
                                <div className="flex items-center gap-4 p-4 border border-border rounded-[12px] hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer group" onClick={() => router.push(`/sellers/${primarySeller.id}`)}>
                                    <div className="w-12 h-12 bg-muted/20 rounded-full flex items-center justify-center text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                        <FaStore className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">Sold by {primarySeller.businessName}</p>
                                            {primarySeller.isVerified && <FaCheckCircle className="w-3 h-3 text-primary" />}
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs font-bold text-muted-foreground">{primarySeller.averageRating?.toFixed(1) || 'N/A'}</span>
                                                <FaStar className="w-2.5 h-2.5 text-amber-400" />
                                            </div>
                                            <p className="text-xs text-muted-foreground font-medium">
                                                {primarySeller.city || 'Verified Location'}
                                            </p>
                                        </div>
                                    </div>
                                    <FaChevronRight className="w-3 h-3 text-muted-foreground/50 group-hover:text-primary" />
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 border border-border rounded-[10px] flex items-center gap-3">
                                    <FaTruck className="w-4 h-4 text-primary" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-foreground">Free Delivery</span>
                                        <span className="text-xs font-medium text-muted-foreground">By {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="p-3 border border-border rounded-[10px] flex items-center gap-3">
                                    <FaShieldAlt className="w-4 h-4 text-emerald-500" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-foreground">Warranty</span>
                                        <span className="text-xs font-medium text-muted-foreground">1 Year Coverage</span>
                                    </div>
                                </div>
                                <div className="p-3 border border-border rounded-[10px] flex items-center gap-3 col-span-2">
                                    <FaUndo className="w-4 h-4 text-emerald-500" />
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-foreground">Return Policy</span>
                                        <span className="text-xs font-medium text-muted-foreground">7-Day Replacement for Damages</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-auto space-y-4">
                            <button
                                onClick={() => handleAction('buy')}
                                className="w-full py-4 bg-primary text-white rounded-[10px] font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                            >
                                Proceed to Checkout
                            </button>
                            <button
                                onClick={() => handleAction('cart')}
                                className="w-full py-4 bg-white text-foreground border border-border rounded-[10px] font-bold text-sm hover:bg-muted/20 transition-all active:scale-95"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>

                {/* TABS SECTION */}
                <div className="border-t border-slate-100 pt-10">
                    <div className="flex border-b border-slate-100 mb-8 overflow-x-auto scrollbar-hide">
                        {['Description', 'Specifications', 'Reviews'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-8 py-4 text-sm font-medium relative transition-colors whitespace-nowrap ${activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                {tab}
                                {activeTab === tab && (
                                    <motion.div layoutId="activeTabProduct" className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary" />
                                )}
                            </button>
                        ))}
                    </div>

                    <div className="min-h-[300px]">
                        {activeTab === 'Description' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-4xl">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{product.name} - Overview</h3>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                            </div>
                        )}

                        {activeTab === 'Specifications' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 max-w-5xl">
                                {product.specifications && Object.entries(product.specifications).map(([key, val], idx) => (
                                    <div key={key} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-2 rounded transition-colors">
                                        <span className="text-sm font-medium text-slate-400">{key}</span>
                                        <span className="text-sm font-bold text-slate-800">{String(val)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {activeTab === 'Reviews' && (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                <div className="flex flex-col md:flex-row gap-10">
                                    <div className="md:w-64 shrink-0 space-y-6">
                                        <div className="bg-slate-50 rounded-[16px] p-6 text-center border border-slate-100">
                                            <p className="text-5xl font-bold text-slate-900 mb-2">{product.averageRating?.toFixed(1) || '0.0'}</p>
                                            <div className="flex justify-center gap-1 text-amber-400 mb-2">
                                                {[...Array(5)].map((_, i) => (
                                                    <FaStar key={i} className={`w-4 h-4 ${i < Math.round(product.averageRating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                                                ))}
                                            </div>
                                            <p className="text-xs font-medium text-slate-400">{product.reviewCount || 0} Reviews</p>
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (!isAuthenticated) {
                                                    router.push(`/auth/login?redirect=/products/${id}`);
                                                    return;
                                                }
                                                // Redirect to orders page as API requires orderItemId
                                                toast.info('Please select the item from your Orders to review.');
                                                router.push('/orders');
                                            }}
                                            className="btn-primary w-full"
                                        >
                                            Write a Review
                                        </button>
                                    </div>

                                    <div className="flex-1 space-y-8">
                                        <ReviewList type="PRODUCT" targetId={id} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Widget */}
                {primarySeller && (
                    <ChatWidget
                        productId={id as string}
                        sellerId={primarySeller.id}
                        sellerName={primarySeller.businessName}
                    />
                )}

                {/* RELATED PRODUCTS */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20 border-t border-border pt-16">
                        <div className="flex items-center gap-2 mb-8">
                            <FaBolt className="w-5 h-5 text-primary" />
                            <h2 className="text-2xl font-bold text-foreground">Similar Equipment</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relatedProducts.map(p => (
                                <CustomerProductCard key={p.id} {...p} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <style jsx>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
                .scrollbar-hide {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    );
}
