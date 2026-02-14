"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaHeart,
  FaBookmark,
  FaPlus,
  FaFilter,
  FaLaptopHouse,
  FaUtensils,
  FaTools,
  FaThLarge,
} from "react-icons/fa";
import WishlistCard from "@/client/components/features/wishlist/WishlistCard";
import WishlistSidebar from "@/client/components/features/wishlist/WishlistSidebar";
import { wishlistService } from "@/lib/api/services/wishlist.service";
import RecentlySaved from "@/client/components/features/wishlist/RecentlySaved";
import { toast } from "sonner";
import { useAuth } from "@/client/context/AuthContext";
import Loader from "@/client/components/ui/Loader";

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"wishlist" | "saved">("wishlist");
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
    // Only fetch if user is authenticated
    if (!user) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await wishlistService.getWishlist();
      const adapted = data.map((p: any) => ({
        id: p._id || p.id,
        name: p.name,
        brand: "NovaMart", // Default brand if missing
        price: p.basePrice,
        image:
          p.images?.[0] ||
          "https://images.unsplash.com/photo-1592078615290-033ee584e267?q=80&w=400",
        status: ((p as any).inventory?.[0]?.stock < 10
          ? "Low Stock"
          : undefined) as any,
      }));
      setItems(adapted);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
      toast.error("Failed to load wishlist");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to load before attempting to fetch wishlist
    if (!authLoading) {
      fetchWishlist();
    }
  }, [user, authLoading]);

  const handleRemove = async (productId: string) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setItems((prev) => prev.filter((item) => item.id !== productId));
      toast.success("Removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove item");
    }
  };

  const displayItems = activeTab === "wishlist" ? items : []; // Only show wishlist items for now

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center">
        <Loader size="lg" variant="primary" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-slate-300 text-3xl" />
            </div>
            <h2 className="text-2xl font-black text-black mb-3">
              Sign in to view your wishlist
            </h2>
            <p className="text-slate-500 mb-8 max-w-md mx-auto">
              Save your favorite products and access them anytime by logging
              into your account.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/auth/login" className="btn-primary">
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-secondary">
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 italic uppercase">
            My Collections
          </h1>
          <p className="text-sm font-medium text-muted-foreground/60">
            Organize your procurement lists and manage saved items for future
            orders.
          </p>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content Area */}
          <div className="flex-1">
            {/* Tabs */}
            <div className="flex items-center gap-8 border-b border-border mb-8">
              <button
                onClick={() => setActiveTab("wishlist")}
                className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === "wishlist" ? "border-primary text-primary" : "border-transparent text-muted-foreground/50 hover:text-muted-foreground"}`}
              >
                <FaHeart
                  className={
                    activeTab === "wishlist"
                      ? "text-primary"
                      : "text-muted-foreground/20"
                  }
                />
                My Wishlist ({items.length})
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`flex items-center gap-2 pb-4 text-sm font-bold border-b-2 transition-all ${activeTab === "saved" ? "border-primary text-primary" : "border-transparent text-muted-foreground/50 hover:text-muted-foreground"}`}
              >
                <FaBookmark
                  className={
                    activeTab === "saved"
                      ? "text-primary"
                      : "text-muted-foreground/20"
                  }
                />
                Saved for Later (0)
              </button>
            </div>

            {/* Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-[10px] text-sm font-bold flex items-center gap-2 shadow-lg shadow-primary/20">
                <FaThLarge /> All Items
              </button>
              <button className="px-4 py-2 bg-white text-muted-foreground/60 border border-border hover:border-foreground/30 hover:text-foreground rounded-[10px] text-sm font-bold flex items-center gap-2 transition-colors">
                <FaLaptopHouse /> Home Office
              </button>
              <button className="px-4 py-2 bg-white text-muted-foreground/60 border border-border hover:border-foreground/30 hover:text-foreground rounded-[10px] text-sm font-bold flex items-center gap-2 transition-colors">
                <FaUtensils /> Kitchen Upgrades
              </button>
              <button className="px-4 py-2 bg-white text-muted-foreground/60 border border-border hover:border-foreground/30 hover:text-foreground rounded-[10px] text-sm font-bold flex items-center gap-2 transition-colors">
                <FaTools /> Industrial Gear
              </button>
              <button className="ml-auto text-primary font-bold text-xs flex items-center gap-1 hover:underline">
                <FaPlus /> Create New List
              </button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-[420px] bg-white rounded-[10px] animate-pulse border border-border"
                  />
                ))}
              </div>
            ) : activeTab === "wishlist" && displayItems.length === 0 ? (
              <div className="col-span-full py-20 text-center">
                <div className="w-16 h-16 bg-muted/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaHeart className="text-muted-foreground/30 text-2xl" />
                </div>
                <p className="text-sm font-bold text-muted-foreground">
                  Your wishlist is empty
                </p>
                <Link
                  href="/products"
                  className="inline-block mt-4 text-sm font-bold text-primary hover:underline"
                >
                  Browse Products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayItems.map((item) => (
                  <div key={item.id} className="h-[420px]">
                    <WishlistCard {...item} onRemove={handleRemove} />
                  </div>
                ))}
              </div>
            )}

            {/* Recentely Saved Section */}
            <RecentlySaved
              onMoveToCart={(id) => {
                // TODO: Implement move to cart logic
              }}
            />
          </div>

          {/* Right Sidebar */}
          <WishlistSidebar />
        </div>
      </div>
    </div>
  );
}
