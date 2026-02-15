"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FaHeart,
  FaTrash,
  FaShoppingCart,
} from "react-icons/fa";
import { wishlistService } from "@/lib/api/services/wishlist.service";
import { toast } from "sonner";
import { useAuth } from "@/client/context/AuthContext";
import Loader from "@/client/components/ui/Loader";

export default function WishlistPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWishlist = async () => {
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
        brand: "NovaMart",
        price: p.basePrice,
        image:
          p.images?.[0] ||
          "https://placehold.co/400x400?text=No+Image",
        category: p.category,
        stock: (p as any).inventory?.[0]?.stock,
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

  const handleRemoveAll = async () => {
    try {
      await wishlistService.clearWishlist();
      setItems([]);
      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error("Failed to clear wishlist");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen pt-40 flex items-center justify-center">
        <Loader size="lg" variant="primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-32 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-black text-foreground tracking-tight mb-2 italic uppercase">
              My Wishlist
            </h1>
          </div>

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
    <div className="min-h-screen pt-32 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-foreground tracking-tight italic uppercase">
            My Wishlist
          </h1>
          {items.length > 0 && (
            <button
              onClick={handleRemoveAll}
              className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <FaTrash className="w-3 h-3" /> Remove All
            </button>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[380px] bg-white rounded-[16px] animate-pulse border border-slate-100"
              />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-slate-300 text-3xl" />
            </div>
            <h2 className="text-xl font-black text-black mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm font-bold text-slate-400 mb-6">
              Save items you love to buy later.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-2.5 bg-black text-white text-sm font-bold tracking-widest rounded-lg hover:bg-slate-800 transition-all cursor-pointer"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((product) => (
              <div
                key={product.id}
                className="bg-white p-4 rounded-[16px] border border-slate-100 shadow-sm hover:shadow-md transition-all group"
              >
                <div className="relative aspect-square bg-slate-50 rounded-[10px] mb-4 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm cursor-pointer"
                  >
                    <FaTrash className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-sm font-bold text-slate-400 tracking-wide mt-1">
                    {product.category}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-black text-slate-900">
                      ₹{product.price?.toLocaleString()}
                    </span>
                    <Link
                      href={`/products/${product.id}`}
                      className="p-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <FaShoppingCart className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
