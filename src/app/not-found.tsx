'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center flex-col bg-background text-foreground">
            <h1 className="text-9xl font-black text-primary/20">404</h1>
            <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
            <p className="text-foreground/60 mb-8 max-w-md">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-black text-white font-bold rounded-[10px] hover:bg-black/90 transition-all shadow-lg"
            >
                Return Home
            </Link>
        </div>
    );
}
