import React from 'react';
import { FaShieldAlt } from 'react-icons/fa';

interface VerifiedBadgeProps {
    type: 'MANUFACTURER' | 'SELLER' | 'CUSTOMER';
    size?: 'sm' | 'md' | 'lg';
    showText?: boolean;
}

export default function VerifiedBadge({ type, size = 'md', showText = true }: VerifiedBadgeProps) {
    const config = {
        MANUFACTURER: {
            color: 'primary',
            bgColor: 'bg-primary/10',
            textColor: 'text-primary',
            borderColor: 'border-primary/20',
            label: 'Verified Manufacturer'
        },
        SELLER: {
            color: 'green',
            bgColor: 'bg-emerald-50',
            textColor: 'text-emerald-600',
            borderColor: 'border-emerald-200',
            label: 'Verified Seller'
        },
        CUSTOMER: {
            color: 'gray',
            bgColor: 'bg-slate-50',
            textColor: 'text-slate-600',
            borderColor: 'border-slate-200',
            label: 'Verified Customer'
        }
    };

    const sizeConfig = {
        sm: {
            container: 'px-2 py-0.5 text-[9px]',
            icon: 'w-2.5 h-2.5'
        },
        md: {
            container: 'px-3 py-1 text-[10px]',
            icon: 'w-3 h-3'
        },
        lg: {
            container: 'px-4 py-1.5 text-xs',
            icon: 'w-4 h-4'
        }
    };

    const badge = config[type];
    const sizing = sizeConfig[size];

    return (
        <span
            className={`
                inline-flex items-center gap-1.5 
                ${badge.bgColor} 
                ${badge.textColor} 
                ${badge.borderColor}
                ${sizing.container}
                border rounded-full font-black uppercase tracking-wider
            `}
            title={badge.label}
        >
            <FaShieldAlt className={sizing.icon} />
            {showText && <span>{type === 'MANUFACTURER' ? 'Verified MFG' : type === 'SELLER' ? 'Verified' : 'Verified'}</span>}
        </span>
    );
}
