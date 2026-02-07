'use client';

import React from 'react';
import { DealerProductGrid } from '../../../../client/components/dashboard/DealerProductGrid';

export default function ProductsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-1 mb-8">
                <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">PRODUCT GRID</h1>
                <p className="text-[#1E293B]/60 text-xs font-bold uppercase tracking-widest">Manage your retail inventory and sales performance.</p>
            </div>

            <DealerProductGrid />
        </div>
    );
}

