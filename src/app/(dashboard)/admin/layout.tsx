import React from 'react';
import AdminShell from './AdminShell';
import RoleGuard from '@/client/components/features/auth/RoleGuard';
import { Role } from '@/lib/api/contract';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Admin Governance | NovaMart Enterprise',
    description: 'Centralized platform governance, audit logs, and verification management for NovaMart.',
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard allowedRoles={[Role.ADMIN]}>
            <AdminShell>{children}</AdminShell>
        </RoleGuard>
    );
}

