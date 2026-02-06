import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-md border border-[#10367D]/10 rounded-3xl p-6 ${className}`}>
        {children}
    </div>
);

export const StatusBadge = ({ status }: { status: string }) => {
    const getStyles = () => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
            case 'APPROVED':
            case 'COMPLETED':
                // High emphasis Secondary
                return 'bg-[#10367D] text-white border-[#10367D]';
            case 'PENDING':
            case 'UNDER_VERIFICATION':
                // Secondary border on Primary background
                return 'bg-[#EBEBEB] text-[#10367D] border-[#10367D]/30';
            case 'SUSPENDED':
            case 'REJECTED':
            case 'DISPUTED':
                // Secondary text with subtle Secondary tint
                return 'bg-[#10367D]/5 text-[#10367D] border-[#10367D]/40 font-black';
            case 'HOLD':
                return 'bg-[#EBEBEB] text-[#10367D]/60 border-[#10367D]/10';
            default:
                return 'bg-white/50 text-[#10367D]/40 border-[#10367D]/10';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getStyles()}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

