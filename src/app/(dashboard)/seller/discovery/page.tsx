'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Package, Star, ArrowRight, Building2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

interface Manufacturer {
    _id: string;
    id: string; // duplicate for convenience
    companyName: string;
    factoryAddress: string;
    logo?: string;
    _count?: {
        products: number;
    };
    products?: Array<{
        name: string;
        basePrice: number;
        images: string[];
        category: string;
    }>;
}

export default function ManufacturerDiscoveryPage() {
    const router = useRouter();
    const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
    const [filtered, setFiltered] = useState<Manufacturer[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchManufacturers();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFiltered(manufacturers);
        } else {
            const lower = searchQuery.toLowerCase();
            setFiltered(manufacturers.filter(m =>
                m.companyName?.toLowerCase().includes(lower) ||
                m.factoryAddress?.toLowerCase().includes(lower)
            ));
        }
    }, [searchQuery, manufacturers]);

    const fetchManufacturers = async () => {
        try {
            const data = await apiClient.get<any[]>('/seller/manufacturers');
            if (data) {
                const mans = data.map((m: any) => ({ ...m, id: m._id }));
                setManufacturers(mans);
                setFiltered(mans);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Discover Manufacturers</h1>
                    <p className="text-gray-500 mt-1">Connect with verified manufacturers and source premium products</p>
                </div>

                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search by company name or location..."
                        className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-64 bg-white rounded-[10px] border border-gray-100 animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((m, idx) => (
                        <motion.div
                            key={m.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="group bg-white rounded-[10px] border border-gray-100 overflow-hidden hover:shadow-lg hover:border-black/5 transition-all duration-300 cursor-pointer"
                            onClick={() => router.push(`/seller/discovery/${m.id}`)}
                        >
                            {/* Card Header / Cover */}
                            <div className="h-24 bg-gradient-to-r from-gray-900 to-gray-800 relative p-4">
                                <div className="absolute -bottom-6 left-6 w-16 h-16 bg-white rounded-[10px] border-2 border-white shadow-sm flex items-center justify-center overflow-hidden">
                                    {m.logo ? (
                                        <img src={m.logo} alt={m.companyName} className="w-full h-full object-cover" />
                                    ) : (
                                        <Building2 className="h-8 w-8 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            {/* Body */}
                            <div className="pt-8 px-6 pb-6">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors">
                                        {m.companyName}
                                    </h3>
                                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium">Verified</span>
                                </div>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin className="h-3.5 w-3.5 mr-2" />
                                        {m.factoryAddress || 'Global Location'}
                                    </div>
                                    <div className="flex items-center text-sm text-gray-500">
                                        <Package className="h-3.5 w-3.5 mr-2" />
                                        {m._count?.products || 0} Products Listed
                                    </div>
                                </div>

                                {/* Product Preview Strip */}
                                <div className="bg-gray-50 rounded-[10px] p-3 mb-6">
                                    <p className="text-xs font-medium text-gray-400 mb-2 uppercase tracking-wide">Top Products</p>
                                    <div className="flex gap-2">
                                        {m.products?.slice(0, 3).map((p, i) => (
                                            <div key={i} className="h-10 w-10 bg-white rounded border border-gray-100 overflow-hidden flex-shrink-0">
                                                {p.images?.[0] ? (
                                                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full bg-gray-100" />
                                                )}
                                            </div>
                                        ))}
                                        {(m.products?.length || 0) > 3 && (
                                            <div className="h-10 w-10 bg-white rounded border border-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                                                +{(m.products?.length || 0) - 3}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    className="w-full py-2.5 rounded-[10px] border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors flex items-center justify-center gap-2 group-hover:border-black group-hover:bg-black group-hover:text-white"
                                >
                                    View Profile
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
