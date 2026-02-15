"use client";

import React, { useEffect, useState } from "react";
import { FaHeart, FaTrash, FaShoppingCart } from "react-icons/fa";
import { Card } from "@/client/components/features/dashboard/DashboardUI";
import { wishlistService } from "@/lib/api/services/wishlist.service";
import { toast } from "sonner";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const data = await wishlistService.getWishlist();
      setWishlist(data || []);
    } catch (error) {
      console.error("Failed to fetch wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await wishlistService.removeFromWishlist(id);
      setWishlist((prev) => prev.filter((item) => item.id !== id));
      toast.success("Removed from wishlist");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };

  const handleRemoveAll = async () => {
    try {
      await wishlistService.clearWishlist();
      setWishlist([]);
      toast.success("Wishlist cleared");
    } catch (error) {
      toast.error("Failed to clear wishlist");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-800 tracking-tight italic uppercase">
          My Wishlist
        </h1>
        {wishlist.length > 0 && (
          <button
            onClick={handleRemoveAll}
            className="text-sm font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
          >
            <FaTrash className="w-3 h-3" /> Remove All
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
        </div>
      ) : wishlist.length === 0 ? (
        <Card className="p-12 border-none shadow-xl shadow-blue-600/5 bg-white rounded-[20px] text-center space-y-4">
          <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-800">Your wishlist is empty</h3>
          <p className="text-slate-400 text-sm font-bold">Save items you love to buy later.</p>
          <Link href="/products" className="inline-block mt-4 px-6 py-2 bg-black text-white text-sm font-bold tracking-widest rounded-[10px] hover:bg-slate-800 transition-all">
            Browse Products
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div key={product.id} className="bg-white p-4 rounded-[20px] border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="relative aspect-square bg-slate-50 rounded-[10px] mb-4 overflow-hidden">
                <img src={product.images?.[0] || 'https://placehold.co/400x400?text=No+Image'} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <button
                  onClick={() => handleRemove(product.id)}
                  className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm pt-2.5 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                >
                  <FaTrash className="w-3.5 h-3.5" />
                </button>
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-800 line-clamp-1">{product.name}</h3>
                <p className="text-sm font-bold text-slate-400 tracking-wide mt-1">{product.category}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-lg font-black text-slate-900">₹{product.basePrice}</span>
                  <Link href={`/products/${product.id}`} className="p-2 bg-slate-900 text-white rounded-[10px] hover:bg-slate-800 transition-colors">
                    <FaShoppingCart className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
