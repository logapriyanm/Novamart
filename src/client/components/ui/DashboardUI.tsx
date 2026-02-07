import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-surface border border-primary/5 rounded-3xl p-6 shadow-xl shadow-primary/5 ${className}`}>
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
        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getStyles()}`}>
            {status.replace(/_/g, ' ')}
        </span>
    );
};

export const WhiteCard = ({ children, className = '' }: { children: React.ReactNode, className?: string }) => (
    <div className={`bg-surface rounded-[2.5rem] border border-foreground/5 shadow-sm shadow-primary/5 ${className}`}>
        {children}
    </div>
);

export const StatsCard = ({ icon: Icon, label, value, colorClass }: { icon: any, label: string, value: string | number, colorClass: string }) => (
    <WhiteCard className="p-6">
        <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colorClass} bg-opacity-10 shadow-sm`}>
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
        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${getColors()}`}>
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
                className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2"
            />

            {steps.map((step, idx) => {
                const isCompleted = idx < currentStep;
                const isActive = idx === currentStep;
                return (
                    <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                        <motion.div
                            initial={false}
                            animate={{
                                backgroundColor: isCompleted || isActive ? 'var(--primary)' : 'var(--surface)',
                                scale: isActive ? 1.2 : 1
                            }}
                            className={`w-4 h-4 rounded-full flex items-center justify-center border-4 border-background shadow-sm`}
                        >
                            {isCompleted && <FaCheckCircle className="text-background w-2 h-2" />}
                        </motion.div>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${isActive ? 'text-primary' : 'text-foreground/40'}`}>
                            {step}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
