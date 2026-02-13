import React, { useEffect, useState } from 'react';
import { FaCheck, FaArrowRight, FaTimes } from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    action?: {
        label: string;
        href: string;
    };
}

interface OnboardingChecklistProps {
    role: 'CUSTOMER' | 'SELLER' | 'MANUFACTURER';
}

export default function OnboardingChecklist({ role }: OnboardingChecklistProps) {
    const [steps, setSteps] = useState<OnboardingStep[]>([]);
    const [dismissed, setDismissed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchOnboardingStatus();
    }, []);

    const fetchOnboardingStatus = async () => {
        try {
            const res = await apiClient.get<any>('/users/onboarding-status');
            if (res.success) {
                setDismissed(res.data.dismissed);
                setSteps(getStepsForRole(role, res.data.steps));
            }
        } catch (error) {
            console.error('Failed to fetch onboarding status');
        } finally {
            setLoading(false);
        }
    };

    const getStepsForRole = (role: string, completedSteps: any) => {
        const baseSteps: Record<string, OnboardingStep[]> = {
            CUSTOMER: [
                {
                    id: 'profile',
                    title: 'Complete your profile',
                    description: 'Add your shipping address and contact details',
                    completed: completedSteps?.profileCompleted || false,
                    action: { label: 'Go to Profile', href: '/customer/profile' }
                },
                {
                    id: 'browse',
                    title: 'Browse products',
                    description: 'Explore our marketplace and find what you need',
                    completed: completedSteps?.firstActionTaken || false,
                    action: { label: 'Browse Marketplace', href: '/marketplace' }
                },
                {
                    id: 'order',
                    title: 'Place your first order',
                    description: 'Experience our secure checkout and escrow system',
                    completed: false,
                    action: { label: 'View Products', href: '/marketplace' }
                }
            ],
            SELLER: [
                {
                    id: 'profile',
                    title: 'Complete business profile',
                    description: 'Add GST number and business verification documents',
                    completed: completedSteps?.profileCompleted || false,
                    action: { label: 'Complete Profile', href: '/seller/profile' }
                },
                {
                    id: 'verify',
                    title: 'Get verified',
                    description: 'Verification unlocks manufacturer access and wholesale pricing',
                    completed: completedSteps?.verificationCompleted || false,
                    action: { label: 'Upload Documents', href: '/seller/profile' }
                },
                {
                    id: 'subscription',
                    title: 'Explore subscription tiers',
                    description: 'Unlock collaboration and custom manufacturing features',
                    completed: completedSteps?.featuresExplored || false,
                    action: { label: 'View Plans', href: '/seller/subscription' }
                },
                {
                    id: 'manufacturer',
                    title: 'Request manufacturer access',
                    description: 'Connect with manufacturers to start ordering',
                    completed: completedSteps?.firstActionTaken || false,
                    action: { label: 'Find Manufacturers', href: '/seller/manufacturers' }
                }
            ],
            MANUFACTURER: [
                {
                    id: 'profile',
                    title: 'Complete company profile',
                    description: 'Add company details and verification documents',
                    completed: completedSteps?.profileCompleted || false,
                    action: { label: 'Complete Profile', href: '/manufacturer/profile' }
                },
                {
                    id: 'verify',
                    title: 'Get verified',
                    description: 'Verification builds trust with sellers',
                    completed: completedSteps?.verificationCompleted || false,
                    action: { label: 'Upload Documents', href: '/manufacturer/profile' }
                },
                {
                    id: 'product',
                    title: 'Add your first product',
                    description: 'List products for sellers to discover',
                    completed: completedSteps?.firstActionTaken || false,
                    action: { label: 'Add Product', href: '/manufacturer/products/create' }
                },
                {
                    id: 'pricing',
                    title: 'Set wholesale pricing',
                    description: 'Configure seller pricing and minimum order quantities',
                    completed: false,
                    action: { label: 'Manage Products', href: '/manufacturer/products' }
                }
            ]
        };

        return baseSteps[role] || [];
    };

    const handleDismiss = async () => {
        try {
            await apiClient.post('/users/dismiss-onboarding', {});
            setDismissed(true);
        } catch (error) {
            console.error('Failed to dismiss onboarding');
        }
    };

    if (loading || dismissed) return null;

    const completedCount = steps.filter(s => s.completed).length;
    const progress = (completedCount / steps.length) * 100;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[20px] p-6 border border-slate-200 shadow-lg mb-6"
            >
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-black text-[#1E293B] mb-1">
                            Welcome to NovaMart! 👋
                        </h3>
                        <p className="text-sm font-bold text-slate-500">
                            Complete these steps to get started
                        </p>
                    </div>
                    <button
                        onClick={handleDismiss}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <FaTimes className="w-4 h-4" />
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
                            Progress
                        </span>
                        <span className="text-xs font-black text-primary">
                            {completedCount} of {steps.length} completed
                        </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                            className="h-full bg-gradient-to-r from-primary to-blue-500"
                        />
                    </div>
                </div>

                {/* Steps */}
                <div className="space-y-3">
                    {steps.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex items-start gap-4 p-4 rounded-[15px] transition-all ${step.completed
                                ? 'bg-green-50 border border-green-200'
                                : 'bg-slate-50 border border-slate-200'
                                }`}
                        >
                            {/* Step Number / Check */}
                            <div className={`w-8 h-8 rounded-[10px] flex items-center justify-center shrink-0 ${step.completed
                                ? 'bg-green-500'
                                : 'bg-slate-200'
                                }`}>
                                {step.completed ? (
                                    <FaCheck className="w-4 h-4 text-white" />
                                ) : (
                                    <span className="text-sm font-black text-slate-600">{index + 1}</span>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1">
                                <h4 className={`text-sm font-black mb-1 ${step.completed ? 'text-green-800' : 'text-slate-800'
                                    }`}>
                                    {step.title}
                                </h4>
                                <p className="text-xs font-bold text-slate-600 mb-2">
                                    {step.description}
                                </p>
                                {!step.completed && step.action && (
                                    <a
                                        href={step.action.href}
                                        className="inline-flex items-center gap-2 text-xs font-black text-primary hover:text-blue-700 transition-colors"
                                    >
                                        {step.action.label}
                                        <FaArrowRight className="w-3 h-3" />
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Celebration */}
                {completedCount === steps.length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-4 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-[15px] p-4 text-center"
                    >
                        <p className="text-sm font-black mb-1">🎉 Congratulations!</p>
                        <p className="text-xs font-bold">You're all set up and ready to go!</p>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    );
}
