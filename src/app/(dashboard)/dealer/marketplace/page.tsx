'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaSearch, FaFilter, FaBoxOpen, FaIndustry, FaCheckCircle,
    FaHandshake, FaMapMarkerAlt, FaTimes, FaPaperPlane
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { useAuth } from '@/client/context/AuthContext';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DealerMarketplace() {
    const { user } = useAuth();
    // const { showSnackbar } = useSnackbar();
    const [manufacturers, setManufacturers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [selectedManufacturer, setSelectedManufacturer] = useState<any>(null);
    const fetchInProgress = useRef(false);

    const CATEGORIES = ['Electronics', 'Home Appliances', 'Furniture', 'Fashion'];

    useEffect(() => {
        fetchManufacturers();
    }, []);

    const fetchManufacturers = async () => {
        if (fetchInProgress.current) return;

        fetchInProgress.current = true;
        setLoading(true);
        try {
            const response = await apiClient.get<any>('/dealer/manufacturers');

            if (response && Array.isArray(response)) {
                setManufacturers(response);
            } else {
                setManufacturers([]);
            }
        } catch (error) {
            console.error('❌ Failed to fetch manufacturers:', error);
            toast.error('Failed to load manufacturers');
        } finally {
            setLoading(false);
            fetchInProgress.current = false;
        }
    };

    const handleRequestAccess = (manufacturer: any) => {
        setSelectedManufacturer(manufacturer);
        setShowRequestModal(true);
    };

    // Filter manufacturers based on search and category
    const filteredManufacturers = manufacturers.filter(mfr => {
        const matchesSearch = !searchQuery ||
            mfr.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            mfr.factoryAddress?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCategory = !selectedCategory ||
            mfr.categoriesProduced?.includes(selectedCategory) ||
            mfr.products?.some((p: any) => p.category === selectedCategory.toLowerCase().replace(/\s+/g, '-'));

        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">
                        Manufacturer <span className="text-[#0F6CBD]">Directory</span>
                    </h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
                        Browse verified manufacturers and request access to start partnerships
                    </p>
                </div>
                <Link href="/dealer/sourcing">
                    <button className="px-6 py-3 bg-[#0F6CBD] text-white rounded-[10px] font-black text-sm hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2">
                        <FaBoxOpen />
                        Go to Sourcing Terminal
                    </button>
                </Link>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 items-center bg-white p-4 rounded-[10px] shadow-sm border border-slate-100">
                <div className="flex-1 relative w-full">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search manufacturers by name or location..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]/20 focus:border-[#0F6CBD] transition-all font-medium text-sm"
                    />
                </div>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
                        className={`p-6 rounded-[10px] border shadow-sm hover:shadow-md transition-all cursor-pointer group text-left ${selectedCategory === cat
                            ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-500/20'
                            : 'bg-white border-slate-100'
                            }`}
                    >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform ${selectedCategory === cat ? 'bg-[#0F6CBD] text-white' : 'bg-blue-50 text-[#0F6CBD]'
                            }`}>
                            <FaBoxOpen />
                        </div>
                        <h3 className={`font-black ${selectedCategory === cat ? 'text-[#0F6CBD]' : 'text-slate-700'}`}>
                            {cat}
                        </h3>
                    </button>
                ))}
            </div>

            {/* Manufacturers Grid */}
            <div>
                <h2 className="text-lg font-black text-[#1E293B] mb-6 flex items-center gap-2">
                    <FaIndustry className="text-[#0F6CBD]" />
                    {loading ? 'Loading Manufacturers...' : `${filteredManufacturers.length} Manufacturers Found`}
                </h2>

                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="text-[#0F6CBD] text-4xl mb-4"
                        >
                            <FaIndustry />
                        </motion.div>
                        <p className="text-slate-400 font-bold text-sm">Loading manufacturer directory...</p>
                    </div>
                ) : filteredManufacturers.length === 0 ? (
                    <div className="py-12 flex flex-col items-center justify-center bg-white rounded-[10px] border border-dashed border-slate-200 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <FaIndustry className="w-6 h-6 text-slate-300" />
                        </div>
                        <h3 className="text-lg font-black text-slate-700">No Manufacturers Found</h3>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 max-w-md mx-auto">
                            Try adjusting your search or filters
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {filteredManufacturers.map((manufacturer) => (
                            <ManufacturerCard
                                key={manufacturer.id}
                                manufacturer={manufacturer}
                                onRequestAccess={handleRequestAccess}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Request Access Modal */}
            <AnimatePresence>
                {showRequestModal && selectedManufacturer && (
                    <RequestAccessModal
                        manufacturer={selectedManufacturer}
                        onClose={() => {
                            setShowRequestModal(false);
                            setSelectedManufacturer(null);
                        }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

function ManufacturerCard({ manufacturer, onRequestAccess }: { manufacturer: any; onRequestAccess: (mfr: any) => void }) {
    const productCount = manufacturer._count?.products || 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[10px] border border-slate-100 shadow-sm hover:shadow-lg transition-all overflow-hidden"
        >
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <div className="flex items-start gap-4">
                    {/* Logo */}
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-blue-100 rounded-[10px] flex items-center justify-center flex-shrink-0">
                        {manufacturer.logo ? (
                            <img src={manufacturer.logo} alt={manufacturer.companyName} className="w-full h-full object-cover rounded-[10px]" />
                        ) : (
                            <FaIndustry className="text-[#0F6CBD] text-2xl" />
                        )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-black text-slate-800 truncate">{manufacturer.companyName}</h3>
                            {manufacturer.isVerified && (
                                <FaCheckCircle className="text-green-500 flex-shrink-0" title="Verified Manufacturer" />
                            )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mb-2">
                            <FaMapMarkerAlt className="text-slate-400" />
                            {manufacturer.factoryAddress || 'Location not specified'}
                        </p>
                        <div className="flex items-center gap-4 text-xs font-bold text-slate-600">
                            <span className="flex items-center gap-1">
                                <FaBoxOpen className="text-[#0F6CBD]" />
                                {productCount} Products
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sample Products */}
            {manufacturer.products && manufacturer.products.length > 0 && (
                <div className="p-4 bg-slate-50">
                    <p className="text-xs font-black text-slate-600 uppercase tracking-wider mb-3">Sample Products</p>
                    <div className="grid grid-cols-3 gap-2">
                        {manufacturer.products.slice(0, 3).map((product: any) => (
                            <div key={product.id} className="bg-white rounded-[10px] p-2 border border-slate-100">
                                <div className="aspect-square bg-slate-100 rounded-md mb-2 overflow-hidden">
                                    {product.images?.[0] ? (
                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <FaBoxOpen className="text-slate-300" />
                                        </div>
                                    )}
                                </div>
                                <p className="text-[10px] font-bold text-slate-700 truncate">{product.name}</p>
                                <p className="text-[10px] text-[#0F6CBD] font-black">₹{product.basePrice}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="p-4">
                <button
                    onClick={() => onRequestAccess(manufacturer)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0F6CBD] text-white rounded-[10px] font-black text-sm uppercase tracking-wider hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20"
                >
                    <FaHandshake />
                    Request Access
                </button>
            </div>
        </motion.div>
    );
}

function RequestAccessModal({ manufacturer, onClose }: { manufacturer: any; onClose: () => void }) {
    // const { showSnackbar } = useSnackbar();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        message: '',
        expectedQuantity: '',
        region: '',
        priceExpectation: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await apiClient.post('/dealer/request-access', {
                manufacturerId: manufacturer.id,
                ...formData
            });

            toast.success('Access request sent successfully!');
            onClose();
        } catch (error: any) {
            const msg = error?.message || 'Failed to send request';

            if (msg.includes('already an approved dealer')) {
                toast.success('You have access! Redirecting to inventory...');
                onClose();
                // Optional: router.push('/dealer/inventory');
            } else if (msg.includes('Request already sent')) {
                toast.info('Request already pending approval.');
                onClose();
            } else {
                toast.error(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-[10px] shadow-2xl max-w-md w-full overflow-hidden"
            >
                {/* Header */}
                <div className="p-6 bg-gradient-to-r from-[#0F6CBD] to-blue-600 text-white">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-black">Request Access</h2>
                        <button onClick={onClose} className="text-white/80 hover:text-white">
                            <FaTimes />
                        </button>
                    </div>
                    <p className="text-sm text-white/80">{manufacturer.companyName}</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Expected Quantity
                        </label>
                        <input
                            type="number"
                            value={formData.expectedQuantity}
                            onChange={(e) => setFormData({ ...formData, expectedQuantity: e.target.value })}
                            className="w-full px-4 py-2 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]/20 focus:border-[#0F6CBD]"
                            placeholder="e.g., 100 units"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Region
                        </label>
                        <input
                            type="text"
                            value={formData.region}
                            onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]/20 focus:border-[#0F6CBD]"
                            placeholder="e.g., Mumbai, Maharashtra"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Price Expectation (₹)
                        </label>
                        <input
                            type="number"
                            value={formData.priceExpectation}
                            onChange={(e) => setFormData({ ...formData, priceExpectation: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]/20 focus:border-[#0F6CBD]"
                            placeholder="e.g., 5000"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Message (Optional)
                        </label>
                        <textarea
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full px-4 py-2 rounded-[10px] border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#0F6CBD]/20 focus:border-[#0F6CBD] h-24 resize-none"
                            placeholder="Tell the manufacturer about your business..."
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0F6CBD] text-white rounded-[10px] font-black text-sm uppercase tracking-wider hover:bg-[#0F6CBD]/90 transition-all shadow-lg disabled:opacity-50"
                    >
                        <FaPaperPlane />
                        {loading ? 'Sending...' : 'Send Request'}
                    </button>
                </form>
            </motion.div>
        </motion.div>
    );
}
