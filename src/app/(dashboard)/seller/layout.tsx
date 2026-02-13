import React from 'react';
import SellerShell from './SellerShell';
import RoleGuard from '@/client/components/features/auth/RoleGuard';
import { Role } from '@/lib/api/contract';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Seller Marketplace | NovaMart Enterprise',
    description: 'Grow your network, manage inventory, and optimize sales with NovaMart Seller Portal.',
};

export default function SellerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={[Role.SELLER]}>
            <SellerShell>{children}</SellerShell>
        </RoleGuard>
    );
}
