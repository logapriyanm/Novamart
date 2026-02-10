'use client';

import { use } from 'react';
import ChatRoom from '@/client/components/features/negotiation/ChatRoom';


export default function ManufacturerNegotiationChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    return <ChatRoom negotiationId={id} userRole="MANUFACTURER" />;
}

