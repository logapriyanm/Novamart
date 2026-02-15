'use client';

import React from 'react';
import UnifiedChat from '@/client/components/features/chat/UnifiedChat';
import { useAuth } from '@/client/hooks/useAuth';
import Loader from '@/client/components/ui/Loader';

export default function CustomerMessagesPage() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center">
                <Loader size="lg" variant="primary" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="flex h-[calc(100vh-100px)] items-center justify-center text-slate-500">
                Please log in to view messages.
            </div>
        );
    }

    return (
        <div className="h-full">
            <h1 className="text-2xl font-bold text-slate-800 mb-6 px-1">My Messages</h1>
            <UnifiedChat
                currentUserRole="CUSTOMER"
                currentUserId={user.id}
            />
        </div>
    );
}
