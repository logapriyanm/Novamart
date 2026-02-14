'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Clock, CheckCircle, XCircle, ArrowRight, Building2, MessageSquare, Handshake } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiClient } from '@/lib/api/client';

interface Request {
    _id: string;
    manufacturerId: {
        _id: string;
        companyName: string;
        factoryAddress: string;
        logo?: string;
    };
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    createdAt: string;
    message?: string;
}

export default function SellerNetworkPage() {
    const router = useRouter();
    const [requests, setRequests] = useState<Request[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'PARTNERS' | 'PENDING'>('PARTNERS');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const data = await apiClient.get<Request[]>('/seller/my-requests');
            if (data) {
                setRequests(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const activePartners = requests.filter(r => r.status === 'APPROVED');
    const pendingRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'REJECTED');



    return (
        <div className="p-6 space-y-6 min-h-screen bg-gray-50/50">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Network</h1>
                <p className="text-gray-500 mt-1">Manage your manufacturer partnerships and negotiation status</p>
            </div>

            {/* Tabs */}
            <div className="flex bg-white rounded-xl p-1 border border-gray-100 w-fit">
                <button
                    onClick={() => setActiveTab('PARTNERS')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'PARTNERS' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <CheckCircle className="h-4 w-4" />
                    Active Partners ({activePartners.length})
                </button>
                <button
                    onClick={() => setActiveTab('PENDING')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'PENDING' ? 'bg-black text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
                >
                    <Clock className="h-4 w-4" />
                    Requests ({pendingRequests.length})
                </button>
            </div>

            {/* Content */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white rounded-xl border border-gray-100 animate-pulse" />)}
                </div>
            ) : (
                <div className="space-y-4">
                    {(activeTab === 'PARTNERS' ? activePartners : pendingRequests).length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-200">
                            <Users className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                            <h3 className="text-gray-900 font-medium">No {activeTab.toLowerCase()} found</h3>
                            <p className="text-gray-500 text-sm mt-1 mb-4">You haven't connected with any manufacturers yet.</p>
                            <button
                                onClick={() => router.push('/seller/discovery')}
                                className="text-black text-sm font-medium hover:underline"
                            >
                                Browse Manufacturers
                            </button>
                        </div>
                    ) : (
                        (activeTab === 'PARTNERS' ? activePartners : pendingRequests).map((req) => (
                            <motion.div
                                key={req._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        {req.manufacturerId.logo ? (
                                            <img src={req.manufacturerId.logo} alt="" className="h-full w-full object-cover rounded-lg" />
                                        ) : (
                                            <Building2 className="h-6 w-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{req.manufacturerId.companyName}</h3>
                                        <div className="flex items-center text-xs text-gray-500 mt-1">
                                            <Clock className="h-3 w-3 mr-1" />
                                            Sent {new Date(req.createdAt).toLocaleDateString()}
                                        </div>
                                        {req.status === 'REJECTED' && (
                                            <p className="text-xs text-red-600 mt-1">Request Declined</p>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {req.status === 'APPROVED' ? (
                                        <>
                                            <button
                                                onClick={() => router.push(`/seller/discovery/${req.manufacturerId._id}`)}
                                                className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-black hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                                            >
                                                View Profile
                                            </button>
                                            <button
                                                onClick={() => router.push(`/seller/discovery/${req.manufacturerId._id}`)}
                                                className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors flex items-center shadow-lg shadow-black/10"
                                            >
                                                <ArrowRight className="h-4 w-4 mr-2" />
                                                Browse Catalog
                                            </button>
                                        </>
                                    ) : (
                                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${req.status === 'PENDING' ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'
                                            }`}>
                                            {req.status}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
