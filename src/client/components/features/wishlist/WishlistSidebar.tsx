"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { FaPlus, FaShareAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
// import { useSnackbar } from '../../../context/SnackbarContext';
import { toast } from "sonner";
import { useCart } from "../../../context/CartContext";
import OptimizedImage from "../../ui/OptimizedImage";
import { productService } from "@/lib/api/services/product.service";

export default function WishlistSidebar() {
  // const { showSnackbar } = useSnackbar();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        // Fetch some products, maybe specific category if possible, or just default
        const response = await productService.getAllProducts({ limit: 3 });
        if (response && response.products) {
          setRecommendations(response.products.slice(0, 3));
        }
      } catch (error) {
        console.error("Failed to fetch recommendations", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const handleShare = () => {
    toast.success("Wishlist shared successfully");
  };

  return (
    <aside className="w-full lg:w-80 space-y-8">
      {/* Recommendations */}
      <div className="bg-white rounded-[10px] p-6 border border-border shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">✨</span>
          <h3 className="font-bold text-foreground text-sm">
            Recommended for You
          </h3>
        </div>
        <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
          Based on your wishlist and recent saves.
        </p>

        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex gap-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            recommendations.map((item) => (
              <Link
                href={`/products/${item.id}`}
                key={item.id}
                className="flex gap-4 group"
              >
                <div className="w-12 h-12 bg-muted/20 rounded-[5px] overflow-hidden shrink-0 border border-border group-hover:border-primary/20 transition-colors">
                  <OptimizedImage
                    src={item.images?.[0] || 'https://placehold.co/200x200'}
                    alt={item.name}
                    width={48}
                    height={48}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium mb-1">
                    From ₹{(item.basePrice || item.price || 0).toLocaleString()}
                  </p>
                  <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                    Quick View <FaPlus className="w-2 h-2" />
                  </button>
                </div>
              </Link>
            ))
          )}
        </div>

        <Link
          href="/products"
          className="block w-full py-3 mt-6 border border-border text-foreground text-center rounded-[10px] text-sm font-bold hover:bg-muted/10 transition-colors"
        >
          View All Products
        </Link>
      </div>

      {/* Share / Team Access */}
      <div className="bg-muted/30 rounded-[10px] p-6 border border-border">
        <h3 className="font-bold text-foreground text-sm mb-2">
          Team Collection
        </h3>
        <p className="text-sm text-muted-foreground font-medium mb-6 leading-relaxed">
          Share this list with your procurement team for collaborative review.
        </p>

        <button
          onClick={handleShare}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          <FaShareAlt className="w-3 h-3" />
          Share List with Team
        </button>
      </div>
    </aside>
  );
}

