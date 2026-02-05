'use client';

import React from 'react';
import { StatusBadge } from '../../../../src/components/ui/AdminUI';
import {
    Check,
    X,
    ExternalLink,
    FileText,
    AlertCircle
} from 'lucide-react';

const products = [
    {
        id: 'P-101',
        name: 'Industrial Grade Steel Bearings',
        manufacturer: 'SteelCorp Global',
        category: 'Hardware',
        price: '$45.00',
        moq: 50,
        status: 'PENDING'
    },
    {
        id: 'P-102',
        name: 'Precision Logic Controllers V4',
        manufacturer: 'TechSystems SA',
        category: 'Electronics',
        price: '$1,200.00',
        moq: 1,
        status: 'PENDING'
    },
    {
        id: 'P-103',
        name: 'Eco-Friendly Insulation Rolls',
        manufacturer: 'GreenBuild Ltd.',
        category: 'Construction',
        price: '$89.00',
        moq: 200,
        status: 'PENDING'
    },
];

const ProductApproval = () => {
    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold text-white">Product Approval Queue</h1>
                <p className="text-slate-400 text-sm">Review safety, compliance, and pricing before listing products to the marketplace.</p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {products.map((product) => (
                    <div key={product.id} className="glass p-6 flex items-center gap-8 group hover:border-indigo-500/20 transition-all">
                        <div className="w-24 h-24 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center text-slate-700">
                            <FileText className="w-8 h-8" />
                        </div>

                        <div className="flex-1 flex flex-col gap-1">
                            <div className="flex items-center gap-3">
                                <span className="text-lg font-bold text-slate-100">{product.name}</span>
                                <StatusBadge status={product.status} />
                            </div>
                            <div className="flex items-center gap-4 text-xs font-medium">
                                <span className="text-indigo-400">{product.manufacturer}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-400">{product.category}</span>
                                <span className="text-slate-600">•</span>
                                <span className="text-slate-400">ID: {product.id}</span>
                            </div>
                            <div className="mt-4 flex gap-8">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-600 uppercase font-black">Base Price</span>
                                    <span className="text-sm font-bold text-slate-300">{product.price}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-slate-600 uppercase font-black">MOQ</span>
                                    <span className="text-sm font-bold text-slate-300">{product.moq} units</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                                <Check className="w-4 h-4" />
                                Approve
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all">
                                <X className="w-4 h-4" />
                                Reject
                            </button>
                        </div>

                        <div className="w-px h-16 bg-white/5 mr-2" />

                        <button className="flex flex-col items-center justify-center gap-2 p-4 text-slate-500 hover:text-indigo-400 transition-colors">
                            <ExternalLink className="w-5 h-5" />
                            <span className="text-[10px] uppercase font-black">Details</span>
                        </button>
                    </div>
                ))}

                {products.length === 0 && (
                    <div className="glass p-20 flex flex-col items-center justify-center text-center opacity-50">
                        <Check className="w-16 h-16 text-emerald-500 mb-4" />
                        <h2 className="text-xl font-bold text-white">All Clear!</h2>
                        <p className="text-slate-400 text-sm">No pending products in the approval queue.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductApproval;
