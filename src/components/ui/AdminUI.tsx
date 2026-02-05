import React from 'react';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white/40 backdrop-blur-md border border-[#2772A0]/10 rounded-3xl p-6 ${className}`}>
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
                return 'bg-[#2772A0] text-[#CCDDEA] border-[#2772A0]';
            case 'PENDING':
            case 'UNDER_VERIFICATION':
                // Secondary border on Primary background
                return 'bg-[#CCDDEA] text-[#2772A0] border-[#2772A0]/30';
            case 'SUSPENDED':
            case 'REJECTED':
            case 'DISPUTED':
                // Secondary text with subtle Secondary tint
                return 'bg-[#2772A0]/5 text-[#2772A0] border-[#2772A0]/40 font-black';
            case 'HOLD':
                return 'bg-[#CCDDEA] text-[#2772A0]/60 border-[#2772A0]/10';
            default:
                return 'bg-white/50 text-[#2772A0]/40 border-[#2772A0]/10';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getStyles()}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};
