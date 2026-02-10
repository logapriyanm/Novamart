import React from 'react';
import ManufacturerShell from './ManufacturerShell';
import RoleGuard from '@/client/components/features/auth/RoleGuard';
import { Role } from '@/lib/api/contract';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Manufacturing Operations | NovaMart Enterprise',
    description: 'Optimize your production flow, track inventory, and manage dealer requests with NovaMart Manufacturer Suite.',
};

export default function ManufacturerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={[Role.MANUFACTURER]}>
            <ManufacturerShell>{children}</ManufacturerShell>
        </RoleGuard>
    );
}

