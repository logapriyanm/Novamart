"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaArrowLeft,
  FaTag,
  FaShieldAlt,
  FaCheckCircle,
  FaArrowRight,
  FaTruck,
  FaWrench,
  
  FaInfoCircle,
  FaHistory,
} from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from "react-icons/md";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import { apiClient } from "@/lib/api/client";

export default function CreateRetailListing() {
  const router = useRouter();
  const params = useParams();
  const inventoryId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [inventory, setInventory] = useState<any>(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  // Form State
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [promoTagline, setPromoTagline] = useState("");

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const data = await apiClient.get<any>(
          `/dealer/inventory/${inventoryId}`,
        );
        if (data) {
          setInventory(data);
          setPrice(data.price?.toString() || "");
          setStock(data.allocatedStock?.toString() || "0");
        }
      } catch (error) {
        toast.error("Failed to load asset details");
        router.push("/dealer/inventory");
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [inventoryId, router]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // 1. Update Price
      await apiClient.put("/dealer/inventory/price", {
        inventoryId,
        price: parseFloat(price),
      });

      // 2. Update Stock (Move allocated to salable)
      await apiClient.put("/dealer/inventory/stock", {
        inventoryId,
        stock: parseInt(stock),
      });

      // 3. Go Live
      await apiClient.put("/dealer/inventory/toggle-listing", {
        inventoryId,
        isListed: true,
      });

      setIsComplete(true);
      toast.success("Listing Activated Successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to activate listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#10367D] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Loading Asset Data
          </p>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#EBEBEB] flex items-center justify-center p-6 animate-fade-in">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-[3.5rem] p-12 text-center shadow-2xl border border-slate-100"
        >
          <div className="w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center text-white mx-auto mb-10 shadow-2xl shadow-emerald-500/20">
            <FaCheckCircle className="w-12 h-12" />
          </div>
          <h2 className="text-3xl font-black text-[#1E293B] mb-4">
            Listing Activated
          </h2>
          <p className="text-sm font-medium text-slate-400 mb-10 leading-relaxed">
            Product{" "}
            <span className="text-[#10367D] font-black italic">
              {inventory?.product?.name}
            </span>{" "}
            is now visible to customers. Retail reputation tracking has been
            initialized.
          </p>
          <Link
            href="/dealer/inventory"
            className="inline-block w-full py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-[#10367D]/20"
          >
            View Inventory Ledger
          </Link>
        </motion.div>
      </div>
    );
  }

  const marginPercent =
    inventory?.dealerBasePrice && price
      ? (
        ((parseFloat(price) - inventory.dealerBasePrice) /
          parseFloat(price)) *
        100
      ).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-[#1E293B]">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <Link
          href="/dealer/inventory"
          className="flex items-center gap-2 text-[10px] font-black text-[#10367D] uppercase tracking-widest hover:translate-x-[-4px] transition-transform"
        >
          <FaArrowLeft className="w-3 h-3" />
          Discard and Return to Ledger
        </Link>
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Retail <span className="text-[#10367D]">Listing</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-1">
            Consumer Market Configuration & Pricing Governance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Product Context (Manufacturer Data - Read Only) */}
        <div className="lg:col-span-12 xl:col-span-4 space-y-8">
          <div className="bg-[#1E293B] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#10367D]/20 blur-2xl rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-10 opacity-60 flex items-center gap-3">
              <FaShieldAlt className="w-4 h-4 text-blue-400" />
              Manufacturer Specs (Immutable)
            </h3>
            <div className="space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400">
                  {inventory?.product?.images?.[0] ? (
                    <img
                      src={inventory.product.images[0]}
                      alt={inventory.product.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <MdOutlineProductionQuantityLimits className="w-8 h-8" />
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-black tracking-tight leading-tight">
                    {inventory?.product?.name}
                  </h4>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
                    By {inventory?.product?.manufacturer?.companyName}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5 pb-2">
                  Technical Core
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[8px] font-black text-slate-600 uppercase">
                      Category
                    </p>
                    <p className="text-xs font-bold text-slate-300">
                      {inventory?.product?.category}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-600 uppercase">
                      Region
                    </p>
                    <p className="text-xs font-bold text-slate-300">
                      {inventory?.region}
                    </p>
                  </div>
                </div>
                <p className="text-[9px] font-black text-rose-500 pt-4 italic">
                  Note: Technical specs cannot be modified by retail partners.
                </p>
              </div>
            </div>
          </div>

          <div className="p-10 bg-slate-50 border border-slate-100 rounded-[3rem] flex items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-white text-[#10367D] flex items-center justify-center border border-slate-100 shadow-sm">
              <FaTag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Wholesale Acq. Price
              </p>
              <p className="text-sm font-black text-[#1E293B]">
                Cost: ₹
                {inventory?.dealerBasePrice || inventory?.product?.basePrice}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Consumer Config Form */}
        <div className="lg:col-span-12 xl:col-span-8 bg-white rounded-[3.5rem] p-10 lg:p-14 border border-slate-100 shadow-sm space-y-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="s1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-2xl font-black text-[#1E293B] tracking-tight">
                    Financial & Stock Config
                  </h2>
                  <p className="text-slate-400 font-medium text-sm mt-2">
                    Define your retail strategy and consumer tags.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Proposed Retail Price (INR)
                    </label>
                    <div className="relative">
                      <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-black">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 39999"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-6 text-sm font-black text-[#1E293B] focus:outline-none focus:border-[#10367D]/30"
                      />
                    </div>
                    <p
                      className={`text-[8px] font-bold uppercase tracking-widest ml-1 ${parseFloat(marginPercent) > 0 ? "text-emerald-600" : "text-rose-500"}`}
                    >
                      Est. Gross Margin: {marginPercent}%
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Available Consumer Units
                    </label>
                    <input
                      type="number"
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      max={inventory?.allocatedStock || 0}
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-black text-[#1E293B] focus:outline-none focus:border-[#10367D]/30"
                    />
                    <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                      Allocated (Max): {inventory?.allocatedStock || 0} Units
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Dealer Promotional Tagline
                  </label>
                  <input
                    type="text"
                    value={promoTagline}
                    onChange={(e) => setPromoTagline(e.target.value)}
                    placeholder="e.g. Authorized Partner | Express Local Shipping | Genuine Warranty"
                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 px-6 text-sm font-medium focus:outline-none focus:border-[#10367D]/30"
                  />
                </div>

                <button
                  onClick={() => setStep(2)}
                  className="px-12 py-5 bg-[#10367D] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#10367D]/20 hover:scale-105 transition-all flex items-center gap-3"
                >
                  Continue to Service Terms
                  <FaArrowRight className="w-3 h-3" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="s2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-10"
              >
                <div>
                  <h2 className="text-2xl font-black text-[#1E293B] tracking-tight">
                    Delivery & Service Governance
                  </h2>
                  <p className="text-slate-400 font-medium text-sm mt-2">
                    Manage consumer expectations and support lifecycle.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center gap-6 group hover:border-[#10367D]/30 transition-all cursor-pointer">
                    <div className="w-14 h-14 rounded-2xl bg-white text-[#10367D] flex items-center justify-center shadow-sm">
                      <FaTruck className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-black text-[#1E293B] uppercase tracking-widest">
                        Self-Fulfilment
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase leading-tight">
                        Dealer ships using own courier network.
                      </p>
                    </div>
                    <div className="w-4 h-4 rounded-full border-2 border-[#10367D] bg-[#10367D]" />
                  </div>

                  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] flex items-center gap-6 group opacity-50 cursor-not-allowed">
                    <div className="w-14 h-14 rounded-2xl bg-white text-slate-300 flex items-center justify-center shadow-sm">
                      <FaShieldAlt className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Nova-Assured
                      </h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase leading-tight">
                        Platform-managed shipping (Coming Soon).
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-rose-50 border border-rose-100 rounded-[3rem] flex items-center gap-8">
                  <div className="w-16 h-16 rounded-[1.8rem] bg-white text-rose-500 border border-rose-100 flex items-center justify-center shrink-0">
                    <FaInfoCircle className="w-8 h-8" />
                  </div>
                  <p className="text-[10px] font-bold text-rose-600 uppercase tracking-widest leading-relaxed">
                    Fulfillment SLA: 48 hours for dispatch. Failure impacts
                    **Dealer Search ranking** and public trust badge.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="p-5 bg-slate-50 text-slate-400 rounded-2xl hover:text-[#1E293B] transition-all"
                  >
                    <FaArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-5 bg-emerald-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting
                      ? "Syncing with Marketplace..."
                      : "Commence Public Listing"}
                    <FaCheckCircle className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
