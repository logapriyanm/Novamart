"use client";

import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaFileUpload,
  FaPlus,
  FaSearch,
  FaFilter,
  FaEdit,
  FaTrash,
  FaEye,
  FaHistory,
  FaCheckCircle,
  FaClock,
  FaLayerGroup,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { MdOutlineProductionQuantityLimits } from 'react-icons/md';
import { toast } from "sonner";
import Link from "next/link";
import { apiClient } from "@/lib/api/client";
import { ENDPOINTS } from "@/lib/api/contract";

export default function ProductMaster() {
  const [products, setProducts] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredProducts = products.filter(product => {
    if (filterStatus === "ALL") return true;
    return product.status === filterStatus;
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient.get<any[]>(ENDPOINTS.MANUFACTURER.PRODUCTS);
      setProducts(data);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    )
      return;
    try {
      await apiClient.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleBulkImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const productsArray = Array.isArray(json) ? json : [json];

        await apiClient.post("/products/bulk", { products: productsArray });
        toast.success("Products imported successfully!");
        fetchProducts();
      } catch (error) {
        console.error("Import failed:", error);
        toast.error(
          "Failed to import products. Please ensure valid JSON format.",
        );
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 text-slate-900">
      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleBulkImport}
        className="hidden"
        accept=".json"
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-foreground/5 pb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-[10px] text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm flex items-center gap-2"
          >
            <FaFileUpload className="w-3 h-3" /> Bulk Import
          </button>
          <Link
            href="/manufacturer/products/add"
            className="px-6 py-2.5 bg-primary text-white rounded-[10px] text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-all shadow-sm"
          >
            New Product
          </Link>
        </div>
      </div>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Total SKU
          </p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {products.length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-emerald-600 uppercase tracking-widest">
            Live Products
          </p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {products.filter((p) => p.status === "APPROVED").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-amber-600 uppercase tracking-widest">
            Awaiting Approval
          </p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {products.filter((p) => p.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-[10px] border border-slate-100 shadow-sm">
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">
            Draft Mode
          </p>
          <p className="text-3xl font-black text-slate-900 mt-1">
            {products.filter((p) => p.status === "DRAFT").length}
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStatus("ALL")}
          className={`px-6 py-2 rounded-[10px] text-xs font-bold transition-all whitespace-nowrap ${filterStatus === "ALL"
            ? "bg-white border border-slate-200 text-slate-900 shadow-sm"
            : "bg-slate-50 border border-transparent text-slate-500 hover:bg-white hover:border-slate-200"
            }`}
        >
          All Products
        </button>
        <button
          onClick={() => setFilterStatus("APPROVED")}
          className={`px-6 py-2 rounded-[10px] text-xs font-bold transition-all whitespace-nowrap ${filterStatus === "APPROVED"
            ? "bg-emerald-50 border border-emerald-100 text-emerald-600 shadow-sm"
            : "bg-slate-50 border border-transparent text-slate-500 hover:bg-white hover:border-slate-200"
            }`}
        >
          Live
        </button>
        <button
          onClick={() => setFilterStatus("PENDING")}
          className={`px-6 py-2 rounded-[10px] text-xs font-bold transition-all whitespace-nowrap ${filterStatus === "PENDING"
            ? "bg-amber-50 border border-amber-100 text-amber-600 shadow-sm"
            : "bg-slate-50 border border-transparent text-slate-500 hover:bg-white hover:border-slate-200"
            }`}
        >
          Pending Approval
        </button>
        <button
          onClick={() => setFilterStatus("DRAFT")}
          className={`px-6 py-2 rounded-[10px] text-xs font-bold transition-all whitespace-nowrap ${filterStatus === "DRAFT"
            ? "bg-slate-100 border border-slate-200 text-slate-600 shadow-sm"
            : "bg-slate-50 border border-transparent text-slate-500 hover:bg-white hover:border-slate-200"
            }`}
        >
          Drafts
        </button>
      </div>

      {/* Product List - Mobile Card View & Desktop Table View */}
      <div className="bg-white rounded-[10px] border border-slate-100 shadow-sm overflow-hidden">
        {/* Mobile View: Cards */}
        <div className="md:hidden divide-y divide-slate-100">
          {isLoading ? (
            <div className="px-6 py-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">
              Syncing Catalog...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-6 py-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest">
              No Products Found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div key={product.id} className="p-4 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                    <img
                      src={product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-contain rounded-[10px]"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-bold text-slate-900 truncate">
                        {product.name}
                      </h4>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-[10px] text-xs font-black uppercase tracking-widest shrink-0 ${product.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-600"
                          : product.status === "PENDING"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-400"
                          }`}
                      >
                        {product.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-slate-400 uppercase mt-1">
                      {product.category}
                    </p>
                    <p className="text-sm font-black text-primary mt-2">
                      ₹{Number(product.basePrice).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                  <span className="text-sm font-bold text-slate-400 uppercase">
                    Product ID: {product.id.substring(0, 8)}...
                  </span>
                  <div className="flex items-center gap-1">
                    <Link
                      href={`/manufacturer/products/edit/${product.id}`}
                      className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-[10px] text-sm font-bold hover:bg-slate-100 transition-all flex items-center gap-1.5"
                    >
                      <FaEdit className="w-3 h-3" /> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="px-3 py-1.5 bg-rose-50 text-rose-500 rounded-[10px] text-sm font-bold hover:bg-rose-100 transition-all flex items-center gap-1.5"
                    >
                      <FaTrash className="w-3 h-3" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Model
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Pricing
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                  Status
                </th>
                <th className="px-6 py-4 text-sm font-bold text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest"
                  >
                    Syncing Catalog...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-xs font-bold text-slate-300 uppercase tracking-widest"
                  >
                    No Products Found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="group hover:bg-slate-50 transition-all"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <div className="w-8 h-8 rounded-[10px] bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                            <img
                              src={product.images?.[0]}
                              alt={product.name}
                              className="w-full h-full object-contain rounded-[10px]"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-[10px] bg-blue-50 text-[#067FF9] flex items-center justify-center border border-blue-100 group-hover:scale-110 transition-transform">
                            <MdOutlineProductionQuantityLimits className="w-6 h-6" />
                          </div>
                        )}
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">
                            {product.name}
                          </h4>
                          <p className="text-xs font-medium text-slate-400 uppercase mt-0.5">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-900">
                        ₹{Number(product.basePrice).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-[10px] text-xs font-bold uppercase tracking-widest ${product.status === "APPROVED"
                          ? "bg-emerald-50 text-emerald-600"
                          : product.status === "PENDING"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-slate-100 text-slate-400"
                          }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/manufacturer/products/edit/${product.id}`}
                          className="p-2 text-slate-400 hover:text-black transition-all"
                        >
                          <FaEdit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-all"
                        >
                          <FaTrash className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-slate-50 flex items-center justify-between bg-slate-50/30">
          <p className="text-xs font-bold text-slate-500">
            Showing {filteredProducts.length} products
          </p>
          <div className="flex items-center gap-2">
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[10px] border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-50"
              disabled
            >
              <FaChevronLeft className="w-3 h-3" />
            </button>
            <button className="w-8 h-8 flex items-center justify-center rounded-[10px] bg-primary text-white text-xs font-black shadow-md shadow-primary/20">
              1
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-[10px] border border-slate-200 text-slate-400 hover:bg-white hover:text-slate-600 transition-all disabled:opacity-50"
              disabled
            >
              <FaChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
