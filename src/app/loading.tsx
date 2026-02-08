'use strict';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="relative w-16 h-16">
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary/20 rounded-full"></div>
                <div className="absolute top-0 left-0 w-full h-full border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
            </div>
        </div>
    );
}
