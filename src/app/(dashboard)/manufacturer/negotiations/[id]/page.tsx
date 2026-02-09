'use client';

import ChatRoom from '@/client/components/features/negotiation/ChatRoom';

export default function ManufacturerNegotiationChatPage({ params }: { params: { id: string } }) {
    return <ChatRoom negotiationId={params.id} userRole="MANUFACTURER" />;
}
