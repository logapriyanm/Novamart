import React from 'react';
import DealerShell from './DealerShell';
import RoleGuard from '@/client/components/features/auth/RoleGuard';
import { Role } from '@/lib/api/contract';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Dealer Marketplace | NovaMart Enterprise',
    description: 'Grow your network, manage inventory, and optimize sales with NovaMart Dealer Portal.',
};

export default function DealerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={[Role.DEALER]}>
            <DealerShell>{children}</DealerShell>
        </RoleGuard>
    );
}
