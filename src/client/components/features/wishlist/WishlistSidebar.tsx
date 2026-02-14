"use client";

import React from "react";
import Link from "next/link";
import { FaPlus, FaShareAlt } from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
// import { useSnackbar } from '../../../context/SnackbarContext';
import { toast } from "sonner";
import { useCart } from "../../../context/CartContext";
import OptimizedImage from "../../ui/OptimizedImage";

const recommendations = [
  {
    id: "r1",
    name: "Silent Mechanical Keyboard",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "r2",
    name: "Height Adjustable Converter",
    price: 199.0,
    image:
      "https://images.unsplash.com/photo-1595846519845-68e298c2edd8?q=80&w=200&auto=format&fit=crop",
  },
  {
    id: "r3",
    name: "USB-C 12-in-1 Docking Station",
    price: 149.0,
    image:
      "https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?q=80&w=200&auto=format&fit=crop",
  },
];

export default function WishlistSidebar() {
  // const { showSnackbar } = useSnackbar();

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
          Based on your "Home Office" wishlist and recent saves.
        </p>

        <div className="space-y-6">
          {recommendations.map((item) => (
            <Link
              href={`/products/${item.id}`}
              key={item.id}
              className="flex gap-4 group"
            >
              <div className="w-12 h-12 bg-muted/20 rounded-[5px] overflow-hidden shrink-0 border border-border group-hover:border-primary/20 transition-colors">
                <OptimizedImage
                  src={item.image}
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
                  From ${item.price.toFixed(2)}
                </p>
                <button className="text-xs font-bold text-primary flex items-center gap-1 hover:underline">
                  Quick Add <FaPlus className="w-2 h-2" />
                </button>
              </div>
            </Link>
          ))}
        </div>

        <Link
          href="/recommendations"
          className="block w-full py-3 mt-6 border border-border text-foreground text-center rounded-[10px] text-sm font-bold hover:bg-muted/10 transition-colors"
        >
          View All Recommendations
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
