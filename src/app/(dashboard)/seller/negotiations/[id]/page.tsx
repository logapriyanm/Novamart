'use client';

import { use } from 'react';
import ChatRoom from '@/client/components/features/negotiation/ChatRoom';
import { useAuth } from '@/client/context/AuthContext';


export default function SellerNegotiationChatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { user } = useAuth();

    return <ChatRoom negotiationId={id} userRole="SELLER" />;
}

