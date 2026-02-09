import React from 'react';
import LoginForm from '../../../client/components/features/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Login | NovaMart Secure Portal',
    description: 'Access the NovaMart B2B2C governance platform.',
    robots: {
        index: false,
        follow: true,
    }
};

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-md">
               

                <LoginForm />
            </div>
        </div>
    );
}

