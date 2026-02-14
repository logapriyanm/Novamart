"use client";

import React, { useEffect, useState } from "react";
import { apiClient } from "../../../../lib/api/client";
// import { useSnackbar } from '../../../context/SnackbarContext';
import { toast } from "sonner";
import { FaComments, FaCheck, FaTimes, FaHandshake } from "react-icons/fa";

export default function NegotiationList() {
  const [negotiations, setNegotiations] = useState<any[]>([]);
  // const { showSnackbar } = useSnackbar();

  useEffect(() => {
    fetchNegotiations();
  }, []);

  const fetchNegotiations = async () => {
    try {
      const res = await apiClient.get<any[]>("/negotiation");
      setNegotiations(res);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (id: string, status: string) => {
    try {
      const res = await apiClient.put<any>(`/negotiation/${id}`, { status });
      if (res.success) {
        toast.success(`Negotiation ${status}`);
        fetchNegotiations();
      }
    } catch (error) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-black text-[#1E293B] flex items-center gap-3">
        <FaHandshake className="text-primary" /> Negotiations
      </h2>

      <div className="grid grid-cols-1 gap-4">
        {negotiations.map((neg) => (
          <div
            key={neg.id}
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={neg.product?.images?.[0] || neg.product?.image}
                  alt={neg.product?.name || "Product"}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-100"
                />
                <div>
                  <h3 className="font-bold text-[#1E293B]">
                    {neg.product?.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Partner:{" "}
                    <span className="font-bold">
                      {neg.seller?.businessName ||
                        neg.manufacturer?.companyName}
                    </span>
                  </p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">
                      Qty: {neg.quantity}
                    </span>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold">
                      Offer: ₹{neg.currentOffer}
                    </span>
                    <span className="text-[10px] text-slate-400 italic">
                      Last Update:{" "}
                      {new Date(neg.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div
                  className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${neg.status === "ACCEPTED" ||
                    neg.status === "DEAL_CLOSED"
                    ? "bg-emerald-100 text-emerald-600"
                    : neg.status === "REJECTED"
                      ? "bg-rose-100 text-rose-600"
                      : neg.status === "NEGOTIATING" || neg.status === "OFFER_MADE"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-amber-100 text-amber-600"
                    }`}
                >
                  {neg.status.replace("_", " ")}
                </div>

                <div className="flex gap-2">
                  {(neg.status === "REQUESTED" || neg.status === "NEGOTIATING" || neg.status === "OFFER_MADE") && (
                    <>
                      <button
                        onClick={() => handleUpdate(neg.id, "REJECTED")}
                        className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-100 transition-colors"
                        title="Reject Offer"
                      >
                        <FaTimes />
                      </button>
                      <button
                        onClick={() => handleUpdate(neg.id, "ACCEPTED")}
                        className="p-3 bg-emerald-50 text-emerald-500 rounded-xl hover:bg-emerald-100 transition-colors"
                        title="Accept Offer"
                      >
                        <FaCheck />
                      </button>
                    </>
                  )}
                  {neg.status === "ACCEPTED" && neg.manufacturer && (
                    <button
                      onClick={() => handleUpdate(neg.id, "DEAL_CLOSED")}
                      className="px-4 py-2 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/10"
                    >
                      Fulfill Deal
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Activity Log Preview */}
            {neg.chatLog && neg.chatLog.length > 0 && (
              <div className="mt-4 p-4 bg-slate-50/50 rounded-2xl text-[11px] text-slate-600 border border-slate-100/50">
                <p className="font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <FaComments className="text-primary/40" /> Timeline
                </p>
                <div className="space-y-3">
                  {(neg.chatLog as any[])
                    .slice(-3)
                    .map((msg: any, i: number) => (
                      <div key={i} className="flex items-start gap-2">
                        <span
                          className={`font-black text-[9px] px-1.5 py-0.5 rounded uppercase ${msg.sender === "SYSTEM"
                            ? "bg-primary/10 text-primary"
                            : "bg-slate-200 text-slate-600"
                            }`}
                        >
                          {msg.sender}
                        </span>
                        <p className="flex-1 leading-relaxed">{msg.message}</p>
                        <span className="text-[9px] text-slate-300">
                          {new Date(msg.time).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {negotiations.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 text-slate-400">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHandshake className="w-10 h-10 opacity-20" />
            </div>
            <p className="font-black uppercase tracking-widest italic text-sm text-slate-300">
              No active deal zones
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest mt-2">
              Initialize a negotiation from the sourcing terminal
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
