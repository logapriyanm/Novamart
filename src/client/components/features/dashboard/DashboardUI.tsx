import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) => (
    <div className={`bg-surface border border-foreground/10 rounded-[10px] p-6 shadow-sm ${className}`} onClick={onClick}>
        {children}
    </div>
);

export const StatusBadge = ({ status }: { status: string }) => {
    const getStyles = () => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
            case 'APPROVED':
            case 'COMPLETED':
                // High emphasis Primary
                return 'bg-primary text-background border-primary';
            case 'PENDING':
            case 'UNDER_VERIFICATION':
                // Surface border on Primary background
                return 'bg-surface text-primary border-primary/30';
            case 'SUSPENDED':
            case 'REJECTED':
            case 'DISPUTED':
                // Primary text with subtle Primary tint
                return 'bg-primary/5 text-primary border-primary/40 font-black';
            case 'HOLD':
                return 'bg-surface text-primary/60 border-primary/10';
            default:
                return 'bg-surface/50 text-primary/40 border-primary/10';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-[10px] text-[10px] font-bold border uppercase tracking-wider ${getStyles()}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

export const WhiteCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-white rounded-[10px] border border-foreground/10 shadow-sm ${className}`}>
        {children}
    </div>
);

export const StatsCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string | number, colorClass: string }) => (
    <WhiteCard className="p-6">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-[10px] flex items-center justify-center ${colorClass} bg-opacity-10 shadow-sm`}>
                <Icon className={`w-5 h-5 ${colorClass.replace('bg-', 'text-')}`} />
            </div>
            <div>
                <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest">{label}</p>
                <p className="text-2xl font-black text-foreground tracking-tight">{value}</p>
            </div>
        </div>
    </WhiteCard>
);

export const TrackingBadge = ({ status }: { status: string }) => {
    const getColors = () => {
        switch (status.toUpperCase()) {
            case 'SHIPPED': return 'bg-emerald-500/10 text-emerald-500';
            case 'IN TRANSIT':
            case 'PROCESSING':
                return 'bg-primary/10 text-primary';
            case 'DELIVERED': return 'bg-foreground/5 text-foreground/60';
            default: return 'bg-foreground/5 text-foreground/40';
        }
    };
    return (
        <span className={`px-4 py-1.5 rounded-[10px] text-[9px] font-bold uppercase tracking-widest ${getColors()}`}>
            {status}
        </span>
    );
};

export const Stepper = ({ currentStep }: { currentStep: number }) => {
    const steps = ['Ordered', 'Processed', 'Shipped', 'In Delivery', 'Delivered'];
    return (
        <div className="relative flex justify-between items-center w-full px-4 mb-8">
            {/* Background Line */}
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-foreground/5 -translate-y-1/2" />
            {/* Active Line */}
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                className="absolute top-1/2 left-0 h-0.5 bg-black -translate-y-1/2"
            />

            {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                return (
                    <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                        <motion.div
                            initial={false}
                            animate={{
                                backgroundColor: isCompleted || isActive ? '#000000' : '#F8FAFC',
                                scale: isActive ? 1.1 : 1
                            }}
                            className={`w-3 h-3 rounded-[10px] flex items-center justify-center border-2 border-white shadow-sm`}
                        >
                            {isCompleted && <FaCheckCircle className="text-white w-2 h-2" />}
                        </motion.div>
                        <span className={`text-[9px] font-bold uppercase tracking-widest ${isActive ? 'text-black' : 'text-foreground/40'}`}>
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
