"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
<<<<<<< HEAD
    FaPaperPlane, FaCheckCircle, FaTimes, FaIndustry,
    FaStore, FaBoxOpen, FaCoins, FaArrowLeft,
    FaCommentAlt, FaInfoCircle, FaHistory, FaHandshake,
    FaCalendarAlt, FaShieldAlt
} from 'react-icons/fa';
import { apiClient } from '@/lib/api/client';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import io from 'socket.io-client';
import Loader from '@/client/components/ui/Loader';
=======
  FaPaperPlane,
  FaCheckCircle,
  FaTimes,
  FaIndustry,
  FaStore,
  FaBoxOpen,
  FaCoins,
  FaSpinner,
  FaArrowLeft,
  FaCommentAlt,
  FaInfoCircle,
  FaHistory,
  FaHandshake,
  FaCalendarAlt,
  FaShieldAlt,
} from "react-icons/fa";
import { apiClient } from "@/lib/api/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
>>>>>>> b768283 (product)

const socket = io(
  typeof window !== "undefined"
    ? window.location.origin.replace("3000", "5000")
    : "http://localhost:5000",
  {
    auth: {
      token:
        typeof window !== "undefined"
          ? localStorage.getItem("auth_token")
          : null,
    },
  },
);

interface ChatRoomProps {
  negotiationId: string;
  userRole: "DEALER" | "MANUFACTURER";
}

interface Message {
  _id?: string;
  senderId: string;
  senderRole: string;
  message: string;
  messageType?: "TEXT" | "SYSTEM" | "FILE" | "OFFER" | "DEAL_UPDATE";
  metadata?: {
    price: number;
    quantity: number;
    timeline: string;
  };
  createdAt: string;
}

export default function ChatRoom({ negotiationId, userRole }: ChatRoomProps) {
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [negotiation, setNegotiation] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);

  useEffect(() => {
    fetchNegotiation();
  }, [negotiationId]);

  useEffect(() => {
    if (negotiation) {
      initializeChat();
    }
  }, [negotiation]);

  useEffect(() => {
    if (chatId) {
      socket.emit("join-room", chatId);
    }
  }, [chatId]);

  useEffect(() => {
    const handleMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("chat:message", handleMessage);
    return () => {
      socket.off("chat:message", handleMessage);
    };
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchNegotiation = async () => {
    if (!negotiationId || negotiationId === "undefined") return;
    try {
      const data = await apiClient.get<any>(`/negotiation/${negotiationId}`);
      setNegotiation(data);
    } catch (error: any) {
      toast.error(error.message || "Failed to load negotiation");
    } finally {
      setLoading(false);
    }
  };

  const initializeChat = async () => {
    if (!negotiation) return;
    try {
      const receiverId =
        userRole === "DEALER"
          ? typeof negotiation.manufacturerId === "object"
            ? negotiation.manufacturerId.userId
            : negotiation.manufacturerId
          : typeof negotiation.dealerId === "object"
            ? negotiation.dealerId.userId
            : negotiation.dealerId;

      const res = await apiClient.post<any>("/chat/create", {
        type: "NEGOTIATION",
        contextId: negotiationId,
        receiverId: receiverId,
        receiverRole: userRole === "DEALER" ? "MANUFACTURER" : "DEALER",
      });

      if (res && res._id) {
        setChatId(res._id);
        try {
          const msgs = await apiClient.get<any>(`/chat/${res._id}/messages`);
          setMessages(msgs || []);
        } catch (historyError) {
          console.warn("Failed to fetch chat history");
        }
      }
    } catch (err) {
      console.error("Failed to initialize chat:", err);
    }
  };

  const sendMessage = async (offerDetails?: any) => {
    if (!message.trim() && !offerDetails) return;

<<<<<<< HEAD
    if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader size="lg" variant="primary" /></div>;
    if (!negotiation) return <div className="text-center py-20 bg-white rounded-[10px]"><p className="text-slate-400 font-bold">Negotiation not found or access denied.</p></div>;
=======
    setSending(true);
    try {
      const payload: any = { message: message.trim() };
      if (offerDetails) payload.offerDetails = offerDetails;
>>>>>>> b768283 (product)

      await apiClient.put(`/negotiation/${negotiationId}`, payload);

      if (message.trim() && chatId) {
        socket.emit("chat:message", {
          chatId,
          message: message.trim(),
          messageType: "TEXT",
        });
      }

      if (offerDetails && chatId) {
        socket.emit("chat:message", {
          chatId,
          message:
            offerDetails.note ||
            `Proposed ${offerDetails.quantity} units at ₹${offerDetails.price}`,
          messageType: "OFFER",
          metadata: offerDetails,
        });
      }

      setMessage("");
      setShowOfferModal(false);
      await fetchNegotiation();
      toast.success("Sent successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
    } finally {
      setSending(false);
    }
  };

  const handleStatusUpdate = async (status: "ACCEPTED" | "REJECTED") => {
    setSending(true);
    try {
      await apiClient.put(`/negotiation/${negotiationId}`, { status });
      await fetchNegotiation();
      toast.success(`Deal ${status.toLowerCase()}`);
    } catch (error: any) {
      toast.error("Failed to update deal state");
    } finally {
      setSending(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <FaSpinner className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  if (!negotiation)
    return (
      <div className="text-center py-20 bg-white rounded-[10px]">
        <p className="text-slate-400 font-bold">
          Negotiation not found or access denied.
        </p>
      </div>
    );

  const isDealer = userRole === "DEALER";
  const partner = isDealer ? negotiation.manufacturerId : negotiation.dealerId;
  const isLocked = ["ACCEPTED", "REJECTED", "ORDER_FULFILLED"].includes(
    negotiation.status,
  );

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] max-w-[1600px] mx-auto overflow-hidden animate-fade-in text-[#1E293B]">
      {/* 3-Panel Grid - Responsive Fix: Stack and order on mobile */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-px bg-slate-100 overflow-hidden rounded-[10px] border border-slate-200 shadow-xl">
        {/* LEFT: DEAL CONTEXT (Col 1-3) - Responsive Fix: Order 2 on mobile */}
        <aside className="order-2 lg:order-1 lg:col-span-3 bg-white flex flex-col overflow-y-auto max-h-[300px] lg:max-h-full border-t lg:border-t-0 border-slate-100">
          <div className="p-6 border-b border-slate-50">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors mb-6"
            >
              <FaArrowLeft /> Back
            </button>
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
              Deal Context
            </h2>
            <div className="flex lg:flex-col gap-4 items-center sm:items-start">
              <div className="aspect-square w-24 lg:w-full bg-slate-50 rounded-[10px] border border-slate-100 flex items-center justify-center p-2 lg:p-4 mb-0 lg:mb-4 shrink-0">
                {negotiation.productId?.images?.[0] ? (
                  <img
                    src={negotiation.productId.images[0]}
                    alt={negotiation.productId?.name || "Product"}
                    className="max-w-full max-h-full object-contain mix-blend-multiply"
                  />
                ) : (
                  <FaBoxOpen className="w-8 h-8 lg:w-12 lg:h-12 text-slate-200" />
                )}
              </div>
              <div>
                <h3 className="text-sm lg:text-lg font-black tracking-tight leading-tight">
                  {negotiation.productId?.name}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Category • {negotiation.productId?.category}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6 hidden lg:block">
            <ContextItem
              icon={FaCoins}
              label="Base Price"
              value={`₹${negotiation.productId?.basePrice || 0}`}
            />
            <ContextItem
              icon={FaBoxOpen}
              label="Min. Order Qty"
              value={`${negotiation.productId?.moq || 0} units`}
            />
            <div className="pt-4 border-t border-slate-50">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                {isDealer ? "Manufacturer" : "Dealer Account"}
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-slate-900 flex items-center justify-center text-white">
                  {isDealer ? <FaIndustry /> : <FaStore />}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-black">
                      {isDealer ? partner?.companyName : partner?.businessName}
                    </p>
                    <FaShieldAlt className="text-emerald-500 w-3 h-3" />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase">
                    {partner?.city}, {partner?.state}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER: CHAT THREAD (Col 4-9) - Responsive Fix: Order 1 on mobile */}
        <main className="order-1 lg:order-2 lg:col-span-6 bg-[#F8FAFC] flex flex-col overflow-hidden relative border-x border-slate-100 h-[60vh] lg:h-full">
          <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <StatusBadge status={negotiation.status} />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden xs:inline">
                Active Negotiation
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">
                Secured Channel
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-6 lg:space-y-8 custom-scrollbar">
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 opacity-60">
                <FaCommentAlt className="w-12 h-12 mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No messages in this thread
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <MessageBubble
                key={m._id || i}
                msg={m}
                isMe={
                  (isDealer && m.senderRole === "DEALER") ||
                  (!isDealer && m.senderRole === "MANUFACTURER")
                }
                onAccept={() => handleStatusUpdate("ACCEPTED")}
                onReject={() => handleStatusUpdate("REJECTED")}
                showActions={
                  !isLocked &&
                  !(
                    (isDealer && m.senderRole === "DEALER") ||
                    (!isDealer && m.senderRole === "MANUFACTURER")
                  )
                }
              />
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 lg:p-6 bg-white border-t border-slate-100">
            {isLocked ? (
              <div className="bg-slate-50 p-4 rounded-[10px] border border-dashed border-slate-200 text-center">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                  Negotiation concluded with status:{" "}
                  <span className="text-primary">{negotiation.status}</span>
                  <br />
                  Terms are now finalized and legally binding.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="relative group">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Type response..."
                    className="w-full pl-6 pr-24 xs:pr-32 py-4 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-primary/5 focus:border-primary font-medium text-sm transition-all"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 sm:gap-2">
                    <button
                      onClick={() => setShowOfferModal(true)}
                      className="px-2 sm:px-4 py-2 bg-white border border-slate-100 rounded-[10px] text-[8px] sm:text-[9px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all text-primary"
                    >
                      Offer
                    </button>
                    <button
                      onClick={() => sendMessage()}
                      disabled={sending || !message.trim()}
                      className="p-2.5 bg-primary text-white rounded-[10px] hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                    >
                      <FaPaperPlane className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-2 hidden sm:flex">
                  <FaInfoCircle className="text-slate-300 w-3 h-3" />
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                    Once an offer is accepted, the deal terms move to contract
                    allocation.
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* RIGHT: SUMMARY (Col 10-12) - Responsive Fix: Order 3 on mobile */}
        <aside className="order-3 lg:col-span-3 bg-white flex flex-col max-h-[400px] lg:max-h-full overflow-y-auto border-t lg:border-t-0 border-slate-100">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">
              Negotiation Summary
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
              <SummaryCard
                label="Current Best Price"
                value={`₹${negotiation.currentOffer}`}
                icon={FaCoins}
                highlighted
              />
              <SummaryCard
                label="Target Quantity"
                value={`${negotiation.quantity} units`}
                icon={FaBoxOpen}
              />
              <SummaryCard
                label="Total Deal Value"
                value={`₹${(negotiation.currentOffer * negotiation.quantity).toLocaleString()}`}
                icon={FaHandshake}
              />
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto hidden lg:block">
            <h3 className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FaHistory /> Audit Timeline
            </h3>
            <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-0 before:w-px before:bg-slate-100">
              {messages
                .filter(
                  (m) =>
                    m.messageType === "SYSTEM" || m.messageType === "OFFER",
                )
                .slice(-5)
                .map((m, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute left-0 top-1 w-4 h-4 rounded-full bg-white border-2 border-slate-100 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    </div>
                    <p className="text-[10px] font-bold text-slate-700 leading-tight">
                      {m.message}
                    </p>
                    <p className="text-[8px] font-bold text-slate-400 uppercase mt-0.5">
                      {new Date(m.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-6 border-t border-slate-50">
            {negotiation.status === "ACCEPTED" ? (
              <button
                onClick={() =>
                  router.push(
                    isDealer ? "/dealer/orders" : "/manufacturer/orders",
                  )
                }
                className="w-full py-4 bg-emerald-600 text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all"
              >
                {isDealer ? "Raise Order Request" : "Manage Allocation"}
              </button>
            ) : (
              <div className="p-4 bg-blue-50/50 rounded-[10px] border border-blue-100 text-center">
                <p className="text-[9px] font-black text-primary uppercase tracking-widest leading-relaxed">
                  Negotiation remains open until both parties reach consensus.
                </p>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Offer Modal */}
      <AnimatePresence>
        {showOfferModal && (
          <OfferModal
            onClose={() => setShowOfferModal(false)}
            onSubmit={(data) => sendMessage(data)}
            initialPrice={negotiation.currentOffer}
            initialQty={negotiation.quantity}
            sending={sending}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function ContextItem({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-8 h-8 rounded-[10px] bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors">
        <Icon className="w-3.5 h-3.5" />
      </div>
      <div>
        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <p className="text-sm font-black text-slate-800 tracking-tight">
          {value}
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, highlighted }: any) {
  return (
    <div
      className={`p-4 rounded-[10px] border ${highlighted ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "bg-white text-slate-800 border-slate-100 shadow-sm"}`}
    >
      <div className="flex justify-between items-start mb-1">
        <p
          className={`text-[8px] font-black uppercase tracking-[0.2em] ${highlighted ? "text-white/60" : "text-slate-400"}`}
        >
          {label}
        </p>
        <Icon
          className={`w-3 h-3 ${highlighted ? "text-white/40" : "text-slate-200"}`}
        />
      </div>
      <p className="text-xl font-black tracking-tighter">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: any = {
    OPEN: "bg-blue-500",
    ACCEPTED: "bg-emerald-500",
    REJECTED: "bg-rose-500",
    ORDER_REQUESTED: "bg-amber-500",
    ORDER_FULFILLED: "bg-emerald-600",
  };
  return (
    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-[10px] border border-slate-100">
      <div
        className={`w-1.5 h-1.5 rounded-full ${colors[status] || "bg-slate-400"}`}
      />
      <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
        {status.replace("_", " ")}
      </span>
    </div>
  );
}

function MessageBubble({ msg, isMe, onAccept, onReject, showActions }: any) {
  if (msg.messageType === "SYSTEM") {
    return (
      <div className="flex justify-center">
        <div className="bg-white border border-slate-100 px-4 py-1.5 rounded-[10px] shadow-sm">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <FaHandshake className="text-primary w-2.5 h-2.5" />
            {msg.message}
          </p>
        </div>
      </div>
    );
  }

  if (msg.messageType === "OFFER") {
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
        <div
          className={`max-w-[400px] w-full bg-white border-2 border-primary rounded-[10px] overflow-hidden shadow-xl ${isMe ? "border-primary/40" : "border-primary"}`}
        >
          <div className="bg-primary p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <FaCoins className="w-3.5 h-3.5" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                Business Offer
              </span>
            </div>
            <span className="text-[9px] font-bold opacity-70 italic">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                  Proposed Price
                </p>
                <p className="text-lg font-black text-slate-800">
                  ₹{msg.metadata?.price}
                </p>
              </div>
              <div className="bg-slate-50 p-3 rounded-[10px] border border-slate-100">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
                  Target Quantity
                </p>
                <p className="text-lg font-black text-slate-800">
                  {msg.metadata?.quantity} units
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-500">
              <FaCalendarAlt className="w-3 h-3" />
              <p className="text-[9px] font-bold uppercase tracking-widest">
                Timeline: {msg.metadata?.timeline}
              </p>
            </div>
            {msg.message && (
              <p className="text-xs font-medium text-slate-600 bg-slate-50 p-3 rounded-[10px] italic">
                "{msg.message}"
              </p>
            )}

            {showActions && (
              <div className="flex gap-2 pt-2">
                <button
                  onClick={onReject}
                  className="flex-1 py-3 bg-white border border-rose-100 text-rose-500 rounded-[10px] text-[9px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={onAccept}
                  className="flex-1 py-3 bg-primary text-white rounded-[10px] text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Accept Offer
                </button>
              </div>
            )}
            {!showActions && isMe && (
              <div className="text-center pt-2">
                <span className="text-[9px] font-black text-primary/60 uppercase tracking-widest italic">
                  Awaiting Response
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] group flex flex-col ${isMe ? "items-end" : "items-start"}`}
      >
        <div
          className={`px-5 py-3.5 rounded-[10px] shadow-sm ${isMe ? "bg-slate-900 text-white rounded-tr-none" : "bg-white text-slate-800 rounded-tl-none border border-slate-100"}`}
        >
          <p
            className={`text-[8px] font-black uppercase tracking-widest mb-1 opacity-40`}
          >
            {isMe ? "Internal" : msg.senderRole}
          </p>
          <p className="text-sm font-medium leading-relaxed">{msg.message}</p>
        </div>
        <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {new Date(msg.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}

function OfferModal({
  onClose,
  onSubmit,
  initialPrice,
  initialQty,
  sending,
}: any) {
  const [price, setPrice] = useState(initialPrice);
  const [quantity, setQuantity] = useState(initialQty);
  const [timeline, setTimeline] = useState("7-14 Days");
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative bg-white w-full max-w-lg rounded-[10px] shadow-2xl overflow-hidden"
      >
        <div className="p-8 bg-black text-white">
          <h3 className="text-xl font-black tracking-tight">
            Formal Business Offer
          </h3>
          <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">
            Structured Negotiation Proposal
          </p>
        </div>
        <div className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Proposed Unit Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:border-primary font-black text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Target Quantity
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:border-primary font-black text-sm"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Expected Delivery Timeline
            </label>
            <select
              value={timeline}
              onChange={(e) => setTimeline(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:border-primary font-bold text-sm"
            >
              <option>3-5 Business Days</option>
              <option>7-14 Days</option>
              <option>1 Month</option>
              <option>Custom Timeline</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
              Optional Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Attach a message to this formal offer..."
              className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:border-primary font-medium text-sm transition-all"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
            >
              Cancel
            </button>
            <button
              disabled={sending}
              onClick={() => onSubmit({ price, quantity, timeline, note })}
              className="flex-[2] py-4 bg-primary text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
            >
              {sending ? (
                <FaSpinner className="animate-spin" />
              ) : (
                <FaPaperPlane />
              )}
              Submit Formal Offer
            </button>
          </div>
        </div>
<<<<<<< HEAD
    );
}

function OfferModal({ onClose, onSubmit, initialPrice, initialQty, sending }: any) {
    const [price, setPrice] = useState(initialPrice);
    const [quantity, setQuantity] = useState(initialQty);
    const [timeline, setTimeline] = useState('7-14 Days');
    const [note, setNote] = useState('');

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white w-full max-w-lg rounded-[10px] shadow-2xl overflow-hidden">
                <div className="p-8 bg-black text-white">
                    <h3 className="text-xl font-black tracking-tight">Formal Business Offer</h3>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mt-1">Structured Negotiation Proposal</p>
                </div>
                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Proposed Unit Price (₹)</label>
                            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:border-primary font-black text-sm" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Quantity</label>
                            <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:border-primary font-black text-sm" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Expected Delivery Timeline</label>
                        <select value={timeline} onChange={e => setTimeline(e.target.value)} className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:border-primary font-bold text-sm">
                            <option>3-5 Business Days</option>
                            <option>7-14 Days</option>
                            <option>1 Month</option>
                            <option>Custom Timeline</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Optional Note</label>
                        <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Attach a message to this formal offer..." className="w-full h-24 px-4 py-3 bg-slate-50 border border-slate-100 rounded-[10px] focus:outline-none focus:border-primary font-medium text-sm transition-all" />
                    </div>

                    <div className="flex gap-4 pt-2">
                        <button onClick={onClose} className="flex-1 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
                        <button
                            disabled={sending}
                            onClick={() => onSubmit({ price, quantity, timeline, note })}
                            className="flex-[2] py-4 bg-primary text-white rounded-[10px] font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                        >
                            {sending ? <Loader size="sm" variant="white" /> : <FaPaperPlane />}
                            Submit Formal Offer
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
=======
      </motion.div>
    </div>
  );
>>>>>>> b768283 (product)
}
