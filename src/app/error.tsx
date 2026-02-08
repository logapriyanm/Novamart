'use client';

import { useEffect } from 'react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-4">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                {/* Icon or illustration for error */}
            </div>
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <p className="text-foreground/60 mb-8 max-w-md">
                We apologize for the inconvenience. An unexpected error has occurred.
            </p>
            <button
                onClick={() => reset()}
                className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20"
            >
                Try again
            </button>
        </div>
    );
}
