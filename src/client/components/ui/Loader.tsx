import React from 'react';
import { cn } from "@/lib/utils";

interface LoaderProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    variant?: 'primary' | 'white' | 'slate';
}

export default function Loader({ className, size = 'md', variant = 'primary' }: LoaderProps) {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-[3px]',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4'
    };

    const variantClasses = {
        primary: 'border-slate-900/10 border-t-slate-900', // Black/Dark loader
        white: 'border-white/20 border-t-white',
        slate: 'border-slate-200 border-t-slate-600'
    };

    return (
        <div className={cn("inline-block animate-spin rounded-full", sizeClasses[size], variantClasses[variant], className)} role="status">
            <span className="sr-only">Loading...</span>
        </div>
    );
}
