'use strict';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen fx-center flex-col bg-background text-foreground">
            <h1 className="text-9xl font-black text-primary/20">404</h1>
            <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
            <p className="text-foreground/60 mb-8 max-w-md">
                The page you are looking for might have been removed, had its name changed,
                or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
                Return Home
            </Link>
        </div>
    );
}
