'use client';

import React from 'react';
import { IconType } from 'react-icons';
import { FaChevronRight } from 'react-icons/fa';

interface QuickActionButtonProps {
    label: string;
    icon: IconType;
    variant?: 'primary' | 'dark' | 'outline';
    onClick?: () => void;
}

export default function QuickActionButton({ label, icon: Icon, variant = 'outline', onClick }: QuickActionButtonProps) {
    const styles = {
        primary: 'bg-primary text-background hover:bg-primary/90 shadow-primary/20',
        dark: 'bg-foreground text-background hover:bg-foreground/90 shadow-foreground/20',
        outline: 'bg-surface text-foreground border border-foreground/5 hover:bg-background shadow-sm',
    };

    return (
        <button
            onClick={onClick}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-sm transition-all shadow-lg active:scale-[0.98] ${styles[variant]}`}
        >
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${variant === 'outline' ? 'bg-background' : 'bg-background/10'}`}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="flex-1 text-left tracking-tight">{label}</span>
            <FaChevronRight className={`w-3 h-3 ${variant === 'outline' ? 'text-foreground/20' : 'text-background/40'}`} />
        </button>
    );
}
