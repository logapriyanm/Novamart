'use client';

import React, { useState } from 'react';
import {
    FaArrowLeft, FaCheckCircle, FaRocket,
    FaCheck
} from 'react-icons/fa';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import StepMedia from '../../../../../client/components/dashboard/manufacturer/product-form/StepMedia';
import StepGeneral from '../../../../../client/components/dashboard/manufacturer/product-form/StepGeneral';
import StepPricing from '../../../../../client/components/dashboard/manufacturer/product-form/StepPricing';
import StepSpecs from '../../../../../client/components/dashboard/manufacturer/product-form/StepSpecs';
import StepCompliance from '../../../../../client/components/dashboard/manufacturer/product-form/StepCompliance';
import StepReview from '../../../../../client/components/dashboard/manufacturer/product-form/StepReview';
import { ProductFormProvider, useProductForm } from '../../../../../client/context/ProductFormContext';

export default function ManufacturerAddProductPage() {
    return (
        <ProductFormProvider>
            <ProductFormContent />
        </ProductFormProvider>
    );
}

function ProductFormContent() {
    const [currentStep, setCurrentStep] = useState(1);
    const { submitProduct, isSubmitting } = useProductForm();

    const steps = [
        { id: 1, name: 'General Info' },
        { id: 2, name: 'Specs' },
        { id: 3, name: 'Pricing' },
        { id: 4, name: 'Media' },
        { id: 5, name: 'Compliance' },
        { id: 6, name: 'Review' }
    ];

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async (status: 'DRAFT' | 'PENDING' = 'PENDING') => {
        try {
            await submitProduct({ status });
            // Handle success (e.g. redirect or show success modal)
            alert(status === 'DRAFT' ? 'Draft Saved!' : 'Product Submitted Successfully!');
            if (status === 'PENDING') {
                // Redirect or reset
                // router.push('/manufacturer/products');
            }
        } catch (error) {
            alert('Failed to save product');
        }
    };

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-32 animate-fade-in relative min-h-screen">
            {/* Header */}
            <div className="flex flex-col gap-1">
                <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                    <Link href="/manufacturer/products" className="hover:text-[#0F6CBD]">Products</Link>
                    <span>/</span>
                    <span className="text-[#1E293B]">Add New Product</span>
                </nav>
                <div className="flex justify-between items-end">
                    <h1 className="text-3xl font-black tracking-tight text-[#1E293B]">Create New Product</h1>
                </div>
            </div>

            {/* Stepper (Image 1 Style) */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm p-8 sticky top-20 z-20">
                <div className="flex items-center justify-between px-12 relative">
                    {/* Progress Lines */}
                    <div className="absolute left-16 right-16 top-5 h-1 bg-slate-100 -z-10">
                        <motion.div
                            className="h-full bg-[#0F6CBD]"
                            initial={{ width: '0%' }}
                            animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                        />
                    </div>

                    {steps.map((step) => (
                        <div key={step.id} className="flex flex-col items-center gap-3 cursor-pointer group" onClick={() => setCurrentStep(step.id)}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black transition-all border-4 ${currentStep > step.id
                                ? 'bg-[#0F6CBD] text-white border-[#0F6CBD]'
                                : currentStep === step.id
                                    ? 'bg-[#0F6CBD] text-white border-blue-100 shadow-xl shadow-blue-500/30 scale-110'
                                    : 'bg-slate-50 text-slate-400 border-white'
                                }`}>
                                {currentStep > step.id ? <FaCheck className="w-3 h-3" /> : step.id}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${currentStep >= step.id ? 'text-[#1E293B]' : 'text-slate-300'
                                }`}>
                                {step.name}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="min-h-[500px]">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentStep === 1 && <StepGeneral />}

                        {currentStep === 2 && <StepSpecs />}

                        {currentStep === 3 && <StepPricing />}

                        {currentStep === 4 && <StepMedia />}

                        {currentStep === 5 && <StepCompliance />}

                        {currentStep === 6 && <StepReview />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Sticky Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-slate-200 p-4 lg:px-8 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="px-6 py-3 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                    >
                        <FaArrowLeft className="w-3 h-3" /> Previous Step
                    </button>

                    <div className="flex items-center gap-4">
                        {currentStep < steps.length && (
                            <span className="text-xs font-bold text-slate-400 hidden sm:block">Last draft saved 2 mins ago</span>
                        )}
                        {currentStep < steps.length && (
                            <button
                                onClick={() => handleSubmit('DRAFT')}
                                className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Save as Draft
                            </button>
                        )}

                        {currentStep < steps.length ? (
                            <button
                                onClick={nextStep}
                                className="px-8 py-3 bg-[#0F6CBD] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20"
                            >
                                Next Step
                            </button>
                        ) : (
                            <button
                                onClick={() => handleSubmit('PENDING')}
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-[#0F6CBD] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit for Approval'} <FaRocket className="w-3 h-3" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
