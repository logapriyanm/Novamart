'use client';

import React from 'react';
import NegotiationList from '../../../../client/components/features/negotiation/NegotiationList';

export default function ManufacturerNegotiationsPage() {
    return (
        <div className="animate-fade-in pb-12">
            <h1 className="text-3xl font-black text-[#1E293B] tracking-tight mb-8">Deal <span className="text-[#10367D]">Requests</span></h1>
            <NegotiationList />
        </div>
    );
}
