'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Package, ShieldCheck, Mail, ArrowLeft, Send, CheckCircle, Clock, XCircle, ChevronRight, Eye, ShoppingCart, X, Layers, IndianRupee, Tag, Info, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';

interface Product {
    _id: string;
    name: string;
    basePrice: number;
    images: string[];
    category: string;
    moq: number;
    description?: string;
    specifications?: Record<string, string>;
    allocation?: {
        status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'NONE';
        stock: number;
    } | null;
}


interface ManufacturerDetails {
    _id: string;
    companyName: string;
    factoryAddress: string;
    logo?: string;
    gstNumber?: string;
    userId: {
        email: string;
        status: string;
    };
    products: Product[];
    requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
}

interface ManufacturerDetails {
    _id: string;
    companyName: string;
    factoryAddress: string;
    logo?: string;
    gstNumber?: string;
    userId: {
        email: string;
        status: string;
    };
    products: Product[];
    requestStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
}

export default function ManufacturerProfilePage() {
    const router = useRouter();
    const params = useParams();
    const [manufacturer, setManufacturer] = useState<ManufacturerDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);

    // Product Detail Modal
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [activeImageIndex, setActiveImageIndex] = useState(0);

    // Source Product Modal
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [sourceProduct, setSourceProduct] = useState<Product | null>(null);
    const [sourceForm, setSourceForm] = useState({ region: '', stock: '', price: '' });
    const [sourcing, setSourcing] = useState(false);

    // Request Form State
    const [requestForm, setRequestForm] = useState({
        message: '',
        expectedQuantity: '',
        region: '',
        priceExpectation: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // Negotiation Modal
    const [showNegotiateModal, setShowNegotiateModal] = useState(false);
    const [negotiateProduct, setNegotiateProduct] = useState<Product | null>(null);
    const [negotiateForm, setNegotiateForm] = useState({ quantity: '', initialOffer: '' });
    const [creatingNegotiation, setCreatingNegotiation] = useState(false);

    useEffect(() => {
        if (params.id) {
            fetchDetails();
        }
    }, [params.id]);

    const fetchDetails = async () => {
        try {
            const data = await apiClient.get<ManufacturerDetails>(`/seller/manufacturers/${params.id}`);
            if (data) {
                setManufacturer(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await apiClient.post('/seller/request-access', {
                manufacturerId: manufacturer?._id,
                ...requestForm,
                expectedQuantity: Number(requestForm.expectedQuantity)
            });
            setShowRequestModal(false);
            fetchDetails();
        } catch (error: any) {
            alert(error.message || 'Failed to send request');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSourceProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!sourceProduct) return;
        setSourcing(true);
        try {
            const response = await apiClient.post<any>('/seller/source', {
                productId: sourceProduct._id,
                region: sourceForm.region,
                stock: Number(sourceForm.stock),
                price: Number(sourceForm.price)
            });

            setShowSourceModal(false);
            setSourceProduct(null);
            setSourceForm({ region: '', stock: '', price: '' });

            if (response?.message === 'REQUEST_PENDING') {
                alert('Request sent successfully! Waiting for manufacturer approval.');
            } else {
                alert('Product sourced successfully! Check your inventory.');
            }
            // Refresh to show updated status
            fetchDetails();
        } catch (error: any) {
            alert(error.message || 'Failed to source product');
            // If error is about pending request, maybe refresh?
            if (error.message?.includes('PENDING')) fetchDetails();
        } finally {
            setSourcing(false);
        }
    };

    const handleCreateNegotiation = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!negotiateProduct) return;
        setCreatingNegotiation(true);
        try {
            const response = await apiClient.post<any>('/negotiation/create', {
                productId: negotiateProduct._id,
                quantity: Number(negotiateForm.quantity),
                initialOffer: Number(negotiateForm.initialOffer)
            });

            setShowNegotiateModal(false);
            setNegotiateProduct(null);
            setNegotiateForm({ quantity: '', initialOffer: '' });

            // Redirect to the new negotiation chat
            if (response?._id) {
                router.push(`/seller/negotiations/${response._id}`);
            } else {
                toast.success('Negotiation started successfully!');
                router.push('/seller/negotiations');
            }
        } catch (error: any) {
            alert(error.message || 'Failed to start negotiation');
        } finally {
            setCreatingNegotiation(false);
        }
    };

    const openNegotiateModal = (product: Product) => {
        setNegotiateProduct(product);
        setNegotiateForm({ quantity: String(product.moq), initialOffer: String(product.basePrice) });
        setShowNegotiateModal(true);
    };

    const openProductDetail = (product: Product) => {
        setSelectedProduct(product);
        setActiveImageIndex(0);
    };

    const openSourceModal = (product: Product) => {
        setSourceProduct(product);
        setSourceForm({ region: '', stock: '', price: String(product.basePrice) });
        setShowSourceModal(true);
    };

    if (loading) return <div className="p-10 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" /></div>;
    if (!manufacturer) return <div className="p-10 text-center">Manufacturer not found</div>;

    const StatusBadge = ({ status }: { status: string }) => {
        switch (status) {
            case 'APPROVED':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Partnered</span>;
            case 'PENDING':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" /> Request Sent</span>;
            case 'REJECTED':
                return <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"><XCircle className="w-3 h-3 mr-1" /> Declined</span>;
            default:
                return null;
        }
    };

    const isPartner = manufacturer.requestStatus === 'APPROVED';

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            {/* Hero Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <button onClick={() => router.back()} className="flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Discovery
                    </button>

                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                        <div className="flex items-start gap-6">
                            <div className="h-24 w-24 bg-gray-100 rounded-2xl border border-gray-200 overflow-hidden flex-shrink-0">
                                {manufacturer.logo ? (
                                    <img src={manufacturer.logo} alt={manufacturer.companyName} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gray-900 text-white font-bold text-2xl">
                                        {manufacturer.companyName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{manufacturer.companyName}</h1>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center"><MapPin className="h-4 w-4 mr-1" /> {manufacturer.factoryAddress}</div>
                                    <div className="flex items-center"><ShieldCheck className="h-4 w-4 mr-1" /> GST: {manufacturer.gstNumber}</div>
                                    <div className="flex items-center"><Mail className="h-4 w-4 mr-1" /> {manufacturer.userId.email}</div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                            {manufacturer.requestStatus ? (
                                <div className="flex flex-col items-end">
                                    <StatusBadge status={manufacturer.requestStatus} />
                                    {manufacturer.requestStatus === 'APPROVED' && (
                                        <button
                                            onClick={() => {
                                                document.getElementById('product-catalog')?.scrollIntoView({ behavior: 'smooth' });
                                                toast.info('Please select a product to negotiate');
                                            }}
                                            className="mt-3 px-6 py-2 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center shadow-lg shadow-black/10"
                                        >
                                            Start Negotiation
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowRequestModal(true)}
                                    className="px-6 py-2.5 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center shadow-lg shadow-black/10"
                                >
                                    <Send className="h-4 w-4 mr-2" />
                                    Request Access
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Product Catalog */}
            <div id="product-catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                    <Package className="h-5 w-5 mr-2" />
                    Product Catalog ({manufacturer.products.length})
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {manufacturer.products.map((product) => (
                        <motion.div
                            key={product._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-lg transition-all group"
                        >
                            {/* Product Image */}
                            <div
                                className="h-48 bg-gray-100 relative overflow-hidden cursor-pointer"
                                onClick={() => openProductDetail(product)}
                            >
                                {product.images?.[0] ? (
                                    <img src={product.images[0]} alt={product.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-400">
                                        <ImageIcon className="h-12 w-12" />
                                    </div>
                                )}
                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-medium shadow-sm">
                                    MOQ: {product.moq}
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-4">
                                <p className="text-[10px] text-amber-600 font-black mb-2 uppercase tracking-widest truncate">{product.category}</p>
                                <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
                                {product.description && (
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-3 h-8">{product.description}</p>
                                )}
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-sm text-gray-500 font-medium">Base Price</span>
                                    <span className="font-black text-lg">₹{product.basePrice?.toLocaleString()}</span>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => openProductDetail(product)}
                                        className="flex-1 h-10 text-xs font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 border border-transparent hover:border-gray-200"
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        Details
                                    </button>
                                    {isPartner && (
                                        <button
                                            onClick={() => {
                                                if (product.allocation?.status === 'PENDING') return;
                                                openSourceModal(product);
                                            }}
                                            disabled={product.allocation?.status === 'PENDING'}
                                            className={`flex-1 h-10 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md ${product.allocation?.status === 'PENDING'
                                                ? 'bg-amber-100 text-amber-700 cursor-not-allowed shadow-none'
                                                : product.allocation?.status === 'APPROVED'
                                                    ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                                    : 'bg-black text-white hover:bg-gray-800'
                                                }`}
                                        >
                                            {product.allocation?.status === 'PENDING' ? (
                                                <>
                                                    <Clock className="h-3.5 w-3.5" />
                                                    Pending
                                                </>
                                            ) : product.allocation?.status === 'APPROVED' ? (
                                                <>
                                                    <CheckCircle className="h-3.5 w-3.5" />
                                                    Sourced
                                                </>
                                            ) : (
                                                <>
                                                    <ShoppingCart className="h-3.5 w-3.5" />
                                                    Source
                                                </>
                                            )}
                                        </button>
                                    )}
                                    {/* Negotiation Button */}
                                    {isPartner && !product.allocation && (
                                        <button
                                            onClick={() => openNegotiateModal(product)}
                                            className="h-10 w-10 text-xs font-bold text-gray-600 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center border border-transparent hover:border-gray-200"
                                            title="Negotiate Price"
                                        >
                                            <IndianRupee className="h-3.5 w-3.5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {manufacturer.products.length === 0 && (
                    <div className="py-20 text-center bg-white rounded-xl border border-dashed border-gray-200">
                        <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-gray-900 font-medium">No Products Available</h3>
                        <p className="text-gray-500 text-sm mt-1">This manufacturer hasn&apos;t listed any products yet.</p>
                    </div>
                )}
            </div>

            {/* ==================== PRODUCT DETAIL MODAL ==================== */}
            <AnimatePresence>
                {selectedProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedProduct(null)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-5 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Product Details</h3>
                                <button onClick={() => setSelectedProduct(null)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="overflow-y-auto flex-1 p-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Image Gallery */}
                                    <div>
                                        <div className="h-64 bg-gray-100 rounded-xl overflow-hidden mb-3">
                                            {selectedProduct.images?.[activeImageIndex] ? (
                                                <img
                                                    src={selectedProduct.images[activeImageIndex]}
                                                    alt={selectedProduct.name}
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">
                                                    <ImageIcon className="h-16 w-16" />
                                                </div>
                                            )}
                                        </div>
                                        {selectedProduct.images?.length > 1 && (
                                            <div className="flex gap-2 overflow-x-auto pb-1">
                                                {selectedProduct.images.map((img, idx) => (
                                                    <button
                                                        key={idx}
                                                        onClick={() => setActiveImageIndex(idx)}
                                                        className={`h-16 w-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${activeImageIndex === idx ? 'border-black shadow-md' : 'border-gray-200 opacity-60 hover:opacity-100'}`}
                                                    >
                                                        <img src={img} alt="" className="h-full w-full object-cover" />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Product Info */}
                                    <div className="space-y-5">
                                        <div>
                                            <span className="text-xs text-amber-600 font-semibold uppercase tracking-wider">{selectedProduct.category}</span>
                                            <h2 className="text-2xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>
                                        </div>

                                        {/* Price & MOQ Badges */}
                                        <div className="flex gap-3">
                                            <div className="bg-gray-50 rounded-xl px-4 py-3 flex-1 border border-gray-100">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                                    <IndianRupee className="h-3 w-3" /> Base Price
                                                </div>
                                                <p className="text-xl font-bold text-gray-900">₹{selectedProduct.basePrice?.toLocaleString()}</p>
                                            </div>
                                            <div className="bg-gray-50 rounded-xl px-4 py-3 flex-1 border border-gray-100">
                                                <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                                                    <Layers className="h-3 w-3" /> Min Order Qty
                                                </div>
                                                <p className="text-xl font-bold text-gray-900">{selectedProduct.moq}</p>
                                            </div>
                                        </div>

                                        {/* Description */}
                                        {selectedProduct.description && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                                                    <Info className="h-4 w-4" /> Description
                                                </h4>
                                                <p className="text-sm text-gray-600 leading-relaxed">{selectedProduct.description}</p>
                                            </div>
                                        )}

                                        {/* Specifications */}
                                        {selectedProduct.specifications && Object.keys(selectedProduct.specifications).length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-900 mb-2 flex items-center gap-1.5">
                                                    <Tag className="h-4 w-4" /> Specifications
                                                </h4>
                                                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden divide-y divide-gray-100">
                                                    {Object.entries(selectedProduct.specifications).map(([key, value]) => (
                                                        <div key={key} className="flex justify-between px-4 py-2.5 text-sm">
                                                            <span className="text-gray-500 capitalize">{key.replace(/_/g, ' ')}</span>
                                                            <span className="font-medium text-gray-900">{value}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Manufacturer info */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                                            <p className="text-xs text-gray-500 mb-1">Manufactured by</p>
                                            <p className="font-semibold text-gray-900">{manufacturer.companyName}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{manufacturer.factoryAddress}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Modal Footer */}
                            <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex gap-3">
                                <button
                                    onClick={() => setSelectedProduct(null)}
                                    className="flex-1 py-3 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                                {isPartner ? (
                                    <button
                                        onClick={() => { setSelectedProduct(null); openSourceModal(selectedProduct); }}
                                        className="flex-1 py-3 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                                    >
                                        <ShoppingCart className="h-4 w-4" />
                                        Source This Product
                                    </button>
                                ) : !manufacturer.requestStatus ? (
                                    <button
                                        onClick={() => { setSelectedProduct(null); setShowRequestModal(true); }}
                                        className="flex-1 py-3 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-black/10"
                                    >
                                        <Send className="h-4 w-4" />
                                        Request Partnership
                                    </button>
                                ) : null}
                                {isPartner && !selectedProduct?.allocation && (
                                    <button
                                        onClick={() => { setSelectedProduct(null); openNegotiateModal(selectedProduct); }}
                                        className="flex-1 py-3 text-sm font-medium text-gray-900 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <IndianRupee className="h-4 w-4" />
                                        Negotiate Price
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ==================== SOURCE PRODUCT MODAL ==================== */}
            <AnimatePresence>
                {showSourceModal && sourceProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowSourceModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">Source Product</h3>
                                        <p className="text-sm text-gray-500 mt-0.5">{sourceProduct.name}</p>
                                    </div>
                                    <button onClick={() => setShowSourceModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                        <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                </div>

                                {/* Product preview */}
                                <div className="mt-4 flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                                    <div className="h-14 w-14 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                                        {sourceProduct.images?.[0] ? (
                                            <img src={sourceProduct.images[0]} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center text-gray-400"><ImageIcon className="h-6 w-6" /></div>
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 text-sm truncate">{sourceProduct.name}</p>
                                        <p className="text-xs text-gray-500">Base: ₹{sourceProduct.basePrice?.toLocaleString()} · MOQ: {sourceProduct.moq}</p>
                                    </div>
                                </div>
                            </div>

                            <form onSubmit={handleSourceProduct} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Region</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                        placeholder="e.g. Mumbai, Delhi NCR"
                                        value={sourceForm.region}
                                        onChange={e => setSourceForm({ ...sourceForm, region: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Initial Stock</label>
                                        <input
                                            type="number"
                                            required
                                            min={sourceProduct.moq}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            placeholder={`Min: ${sourceProduct.moq}`}
                                            value={sourceForm.stock}
                                            onChange={e => setSourceForm({ ...sourceForm, stock: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Min order: {sourceProduct.moq}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Retail Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            placeholder={`Base: ₹${sourceProduct.basePrice}`}
                                            value={sourceForm.price}
                                            onChange={e => setSourceForm({ ...sourceForm, price: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Base: ₹{sourceProduct.basePrice?.toLocaleString()}</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={sourcing}
                                    className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-black/10"
                                >
                                    {sourcing ? (
                                        <>
                                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                                            Sourcing...
                                        </>
                                    ) : (
                                        <>
                                            <ShoppingCart className="h-4 w-4" />
                                            Source Product
                                        </>
                                    )}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ==================== REQUEST PARTNERSHIP MODAL ==================== */}
            <AnimatePresence>
                {showRequestModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowRequestModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-lg font-bold text-gray-900">Request Partnership</h3>
                                <button onClick={() => setShowRequestModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleSendRequest} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message to Manufacturer</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                        placeholder="Introduce your business and why you want to partner..."
                                        value={requestForm.message}
                                        onChange={e => setRequestForm({ ...requestForm, message: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Expected Monthly Qty</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                            placeholder="e.g. 500"
                                            value={requestForm.expectedQuantity}
                                            onChange={e => setRequestForm({ ...requestForm, expectedQuantity: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Region</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5"
                                            placeholder="e.g. Mumbai"
                                            value={requestForm.region}
                                            onChange={e => setRequestForm({ ...requestForm, region: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                                >
                                    {submitting ? 'Sending Request...' : 'Send Request'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ==================== NEGOTIATION MODAL ==================== */}
            <AnimatePresence>
                {showNegotiateModal && negotiateProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowNegotiateModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">Start Negotiation</h3>
                                    <p className="text-sm text-gray-500 mt-0.5">{negotiateProduct.name}</p>
                                </div>
                                <button onClick={() => setShowNegotiateModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                    <X className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>

                            <form onSubmit={handleCreateNegotiation} className="p-6 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                        <input
                                            type="number"
                                            required
                                            min={negotiateProduct.moq}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            placeholder={`Min: ${negotiateProduct.moq}`}
                                            value={negotiateForm.quantity}
                                            onChange={e => setNegotiateForm({ ...negotiateForm, quantity: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">MOQ: {negotiateProduct.moq}</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Target Price (₹)</label>
                                        <input
                                            type="number"
                                            required
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                                            placeholder="Offer Price"
                                            value={negotiateForm.initialOffer}
                                            onChange={e => setNegotiateForm({ ...negotiateForm, initialOffer: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Base: ₹{negotiateProduct.basePrice}</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={creatingNegotiation}
                                    className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-4 shadow-lg shadow-black/10"
                                >
                                    {creatingNegotiation ? 'Starting Chat...' : 'Start Negotiation'}
                                    {!creatingNegotiation && <ChevronRight className="h-4 w-4" />}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
