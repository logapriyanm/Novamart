"use client";

import React, { useState, useEffect } from "react";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaRocket,
  FaCheck,
  FaSave,
} from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { useProductForm } from "@/client/context/ProductFormContext";

import StepGeneral from "./StepGeneral";
import StepSpecs from "./StepSpecs";
import StepReview from "./StepReview";

interface ProductFormWizardProps {
  productId?: string;
}

export default function ProductFormWizard({
  productId,
}: ProductFormWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const { submitProduct, isSubmitting, updateProductData, productData } =
    useProductForm();
  // const { showSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(!!productId);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const response = await apiClient.get<any>("/manufacturer/profile");
        setIsVerified(response.isVerified);
      } catch (error) {
        console.error("Failed to fetch verification status", error);
      }
    };
    checkVerification();
  }, []);

  // Fetch product data if editing
  useEffect(() => {
    if (productId) {
      const fetchProduct = async () => {
        try {
          const product = await apiClient.get<any>(`/products/${productId}`);
          // Map API data to form structure if needed
          updateProductData({
            name: product.name,
            description: product.description,
            category: product.category, // This might need mapping if category logic is complex
            basePrice: product.basePrice.toString(),
            moq: product.moq.toString(),
            images: product.images || [],
            specifications: product.specifications || {},
            certifications: product.certifications || [],
            status: product.status,
            // Add other fields as necessary
          });
        } catch (error) {
          console.error("Failed to fetch product:", error);
          toast.error("Failed to load product data");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [productId]);

  const steps = [
    { id: 1, name: "Essentials" },
    { id: 2, name: "Details" },
    { id: 3, name: "Review & Submit" },
  ];

  const validateStep = (step: number) => {
    if (step === 1) {
      // Essentials
      if (!productData.name?.trim()) {
        toast.error("Please enter a product name");
        return false;
      }
      if (!productData.category) {
        toast.error("Please select a category");
        return false;
      }
      if (!productData.description?.trim()) {
        toast.error("Please enter a description");
        return false;
      }
      const price = parseFloat(productData.basePrice || "0");
      if (isNaN(price) || price <= 0) {
        toast.error("Please enter a valid base price greater than 0");
        return false;
      }
      const moq = parseInt(productData.moq || "0");
      if (isNaN(moq) || moq < 1) {
        toast.error("Please enter a valid MOQ (minimum 1)");
        return false;
      }
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (
    status: "DRAFT" | "PENDING" | "APPROVED" | "update" = "PENDING",
  ) => {
    if (status !== "DRAFT" && !validateStep(1)) {
      // If submitting for approval (not draft), strict validation applies
      // We force check step 1 even if on step 3
      setCurrentStep(1); // Go back to step 1 to show user
      return;
    }

    try {
      if (productId) {
        // Update existing
        const response = await apiClient.put<any>(`/products/${productId}`, {
          ...productData,
          status: status === "update" ? productData.status : status,
        });
        toast.success(
          response.data?.status === "APPROVED"
            ? "Product Updated & Published!"
            : "Product Updated Successfully!",
        );
      } else {
        // Create new
        // For drafts, we can allow partial data if backend allows, but for now we rely on backend for draft validation (which I relaxed)
        // For live/pending, we already validated above.
        const response = await submitProduct({
          status: status === "update" ? "PENDING" : status,
        });
        const actualStatus =
          response.data?.status || (status === "DRAFT" ? "DRAFT" : "PENDING");

        if (actualStatus === "DRAFT") {
          toast.success("Draft Saved!");
        } else if (actualStatus === "APPROVED") {
          toast.success("Product Published Instantly!");
        } else {
          toast.success(
            "Product Submitted for Approval! Admin review required.",
          );
        }
      }
      router.push("/manufacturer/products");
    } catch (error: any) {
      console.error("Submit Error:", error);
      // Enhance error display
      if (error.details) {
        const messages = Object.values(error.details).join(", ");
        toast.error(`Validation Failed: ${messages}`);
      } else if (error.response?.data?.details) {
        // Fallback for cases where ApiClient might behave differently
        const details = error.response.data.details;
        const messages = Object.values(details).join(", ");
        toast.error(`Validation Failed: ${messages}`);
      } else {
        toast.error(error.message || "Failed to save product");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-400 font-bold">
          Loading Product Data...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-32 animate-fade-in relative min-h-screen">
      {/* Header */}
      <div className="flex flex-col gap-1 text-[#1E293B]">
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
          <Link href="/manufacturer/products" className="hover:text-[#0F6CBD]">
            Products
          </Link>
          <span>/</span>
          <span className="text-[#1E293B]">
            {productId ? "Edit Product" : "Add New Product"}
          </span>
        </nav>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight italic">
              {productId ? "Edit Product" : "Create New Product"}
            </h1>
          </div>
          {isVerified && (
            <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-[10px]">
              <div className="w-8 h-8 bg-emerald-100 rounded-[10px] flex items-center justify-center text-emerald-600">
                <FaCheckCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">
                  Verified Account
                </p>
                <p className="text-[9px] font-bold text-emerald-600/70">
                  Instant Go-Live Protocol Active
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-[10px] border border-foreground/10 shadow-sm p-8  ">
        <div className="flex items-center justify-between px-12 relative">
          {/* Progress Lines */}
          <div className="absolute left-16 right-16 top-5 h-1 bg-background -z-10">
            <motion.div
              className="h-full bg-black"
              initial={{ width: "0%" }}
              animate={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>

          {steps.map((step) => (
            <div
              key={step.id}
              className="flex flex-col items-center gap-3 cursor-pointer group"
              onClick={() => setCurrentStep(step.id)}
            >
              <div
                className={`w-10 h-10 rounded-[10px] flex items-center justify-center text-sm font-bold transition-all border-2 ${
                  currentStep > step.id
                    ? "bg-black text-white border-black"
                    : currentStep === step.id
                      ? "bg-black text-white border-black scale-110"
                      : "bg-background text-foreground/40 border-foreground/10"
                }`}
              >
                {currentStep > step.id ? (
                  <FaCheck className="w-3 h-3" />
                ) : (
                  step.id
                )}
              </div>
              <span
                className={`text-[10px] font-bold uppercase tracking-widest transition-colors ${
                  currentStep >= step.id ? "text-black" : "text-foreground/20"
                }`}
              >
                {step.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {currentStep === 1 && <StepGeneral />}
            {currentStep === 2 && <StepSpecs />}
            {currentStep === 3 && <StepReview />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sticky Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-foreground/10 p-4 lg:px-8 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 1}
            className="btn-secondary whitespace-nowrap px-6 py-3 rounded-[10px] border border-slate-200 font-bold text-xs uppercase hover:bg-slate-50 disabled:opacity-50"
          >
            <FaArrowLeft className="w-3 h-3 inline mr-2" /> Previous Step
          </button>

          <div className="flex items-center gap-4">
            {!productId && currentStep < steps.length && (
              <button
                onClick={() => handleSubmit("DRAFT")}
                className="px-6 py-3 bg-background text-foreground/60 rounded-[10px] text-xs font-bold uppercase tracking-widest hover:bg-foreground/5 transition-all"
              >
                Save as Draft
              </button>
            )}

            {currentStep < steps.length ? (
              <button
                onClick={nextStep}
                className="px-6 py-3 bg-[#0F6CBD] text-white rounded-[10px] text-xs font-bold uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={() =>
                  handleSubmit(
                    productId ? "update" : isVerified ? "APPROVED" : "PENDING",
                  )
                }
                disabled={isSubmitting}
                className="px-6 py-3 bg-[#0F6CBD] text-white rounded-[10px] text-xs font-bold uppercase tracking-widest hover:bg-[#0F6CBD]/90 transition-all shadow-lg shadow-blue-500/20 flex items-center gap-2"
              >
                {isSubmitting
                  ? "Saving..."
                  : productId
                    ? "Update Product"
                    : isVerified
                      ? "Publish Instantly"
                      : "Submit for Approval"}
                {productId ? (
                  <FaSave className="w-3 h-3" />
                ) : (
                  <FaRocket className="w-3 h-3" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
