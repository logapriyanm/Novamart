'use client';

import ChatRoom from '@/client/components/features/negotiation/ChatRoom';
import { useAuth } from '@/client/context/AuthContext';

export default function DealerNegotiationChatPage({ params }: { params: { id: string } }) {
    const { user } = useAuth();

    return <ChatRoom negotiationId={params.id} userRole="DEALER" />;
}
