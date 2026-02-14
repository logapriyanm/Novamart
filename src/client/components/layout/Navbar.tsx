"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import slider1 from "@/../public/assets/slider-1.json";
import slider2 from "@/../public/assets/slider-2.json";
import {
  FaSearch as Search,
  FaStore,
  FaBox,
  FaBars as Menu,
  FaTimes as X,
  FaIndustry,
  FaSignOutAlt,
  FaClipboardList,
  FaHeadset,
  FaStar,
  FaHeart,
  FaShieldAlt,
} from "react-icons/fa";
import { AiOutlineProduct } from "react-icons/ai";
import {
  HiOutlineShoppingCart,
  HiOutlineUserCircle,
  HiOutlineUser,
} from "react-icons/hi2";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSidebar } from "@/client/context/SidebarContext";
import { useAuth } from "@/client/hooks/useAuth";
import { useCart } from "@/client/context/CartContext";
import NotificationBell from "./NotificationBell";
import { mainCategories } from "@/client/data/categoryData";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isAuthenticated, logout } = useAuth();
  const { cart } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const lottieRef = useRef<any>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get sidebar context - only available in public layout
  const sidebarContext = (() => {
    try {
      return useSidebar();
    } catch {
      return null;
    }
  })();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Check page type
  const isProductsPage = pathname?.startsWith("/products");
  const isHomePage = pathname === "/";

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const profilePath =
    user?.role === "SELLER"
      ? "/seller/profile"
      : user?.role === "MANUFACTURER"
        ? "/manufacturer/profile"
        : user?.role === "ADMIN"
          ? "/admin/profile"
          : "/customer/profile";

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white border-b  shadow-sm transition-all duration-300 ">
      {/* Top Row: Logo, Search, User Actions */}
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-1">
        <div className="flex items-center justify-between gap-2 sm:gap-4 md:gap-8">
          {/* Brand & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 p-1.5 sm:p-2 rounded-full border-2 border-black overflow-hidden flex items-center justify-center bg-white shadow-sm group-hover:shadow-md transition-all shrink-0">
                <img
                  src="/assets/Novamart.png"
                  alt="NovaMart"
                  className="w-6 h-6 sm:w-8 sm:h-8 object-contain"
                />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-foreground  italic hidden xs:block sm:block">
                NOVAMART
              </span>
            </Link>
          </div>

          {/* Actions - Right */}
          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex-1 max-w-2xl hidden md:flex items-center mx-4 lg:mx-8">
              <form
                onSubmit={handleSearch}
                className="flex w-full h-10 bg-surface border border-slate-200 hover:border-slate-300 rounded-[10px] overflow-hidden shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary/20 transition-all"
              >
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="flex-1 px-4 text-sm focus:outline-none bg-transparent text-foreground font-medium placeholder:text-muted-foreground/60"
                />

                <button
                  type="submit"
                  className="bg-primary hover:bg-primary/90 text-white px-6 transition-colors flex items-center justify-center group relative overflow-hidden"
                  aria-label="Search products"
                >
                  <div className="relative w-5 h-5 group-hover:scale-110 transition-transform">
                    <Search className="w-full h-full text-white" />
                  </div>
                </button>
              </form>
            </div>
            <Link href="/products" className="btn-secondary hidden lg:flex">
              <AiOutlineProduct className="w-4 h-4" />
              <span>Products</span>
            </Link>

            {user?.role === "ADMIN" && (
              <Link href="/admin" className="btn-primary">
                <FaShieldAlt className="w-4 h-4" />
                <span>Admin </span>
              </Link>
            )}

            {user?.role === "MANUFACTURER" && (
              <Link href="/manufacturer" className="btn-primary">
                <FaIndustry className="w-4 h-4" />
                <span>Manufacturer</span>
              </Link>
            )}

            {user?.role === "SELLER" && (
              <Link href="/seller" className="btn-primary">
                <FaStore className="w-4 h-4" />
                <span>Seller</span>
              </Link>
            )}

            <div className="h-8 w-px bg-foreground/10 hidden md:block" />

            {/* Support - Hidden on mobile */}
            <Link
              href="/contact"
              className="hidden md:flex flex-col items-center group gap-1"
            >
              <FaHeadset className="w-5 h-5 text-foreground/40 group-hover:text-black transition-colors" />
              <span className="text-sm font-medium text-foreground/60 group-hover:text-black transition-colors">
                Support
              </span>
            </Link>

            {isAuthenticated && <NotificationBell />}

            {/* Cart - Hidden on mobile */}
            <Link
              href="/cart"
              className="hidden md:flex flex-col items-center group gap-1 relative"
            >
              <div className="relative">
                <HiOutlineShoppingCart className="w-5 h-5 text-foreground/40 group-hover:text-black transition-colors" />
                <span className="absolute -top-2 -right-2 bg-black text-white text-background text-xs font-medium w-4 h-4 rounded-full flex items-center justify-center border-2 border-background shadow-sm">
                  {cart.length}
                </span>
              </div>
              <span className="text-sm font-medium text-foreground/60 group-hover:text-black transition-colors">
                Cart
              </span>
            </Link>
            {/* Profile Section - Hidden on mobile */}
            <div
              className="relative py-2 hidden md:block"
              ref={dropdownRef}
              onMouseEnter={() => setIsProfileDropdownOpen(true)}
              onMouseLeave={() => setIsProfileDropdownOpen(false)}
            >
              <button
                className="flex flex-col items-center group gap-1 min-w-[60px]"
                aria-label="User profile and account"
                aria-haspopup="true"
                aria-expanded={isProfileDropdownOpen}
              >
                {isAuthenticated ? (
                  <>
                    {user?.avatar ? (
                      <div className="w-7 h-7 rounded-full overflow-hidden border border-primary/20 group-hover:border-primary transition-all">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-7 h-7 bg-primary/10 rounded-full flex items-center justify-center text-primary font-medium text-sm border border-primary/20 group-hover:bg-primary group-hover:text-background transition-all">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    )}
                    <span className="text-xs font-medium text-primary truncate max-w-[80px]">
                      {user?.name?.split(" ")[0] || "User"}
                    </span>
                  </>
                ) : (
                  <>
                    <HiOutlineUserCircle className="w-6 h-6 text-foreground/40 group-hover:text-black transition-colors" />
                    <span className="text-sm font-medium text-foreground/60 group-hover:text-black transition-colors">
                      Account
                    </span>
                  </>
                )}
              </button>
              {/* Dropdown Menu */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 pt-2 w-64 z-[9999]"
                  >
                    <div className="bg-white rounded-[16px] border py-4 overflow-hidden shadow-2xl ring-1 ring-black/5">
                      {isAuthenticated ? (
                        <div className="px-6 py-4 border-b border-foreground/5 mb-2">
                          <p className="font-black text-foreground truncate">
                            {user?.name}
                          </p>
                          <p className="text-[11px] font-bold text-foreground/40 truncate">
                            {user?.email}
                          </p>
                        </div>
                      ) : (
                        <div className="px-6 py-4 border-b border-foreground/5 mb-2">
                          <p className="font-black text-foreground truncate">
                            Welcome to NovaMart
                          </p>
                          <p className="text-[11px] font-bold text-foreground/40 truncate">
                            Login to access your features
                          </p>
                        </div>
                      )}

                      <div className="px-2 space-y-1">
                        <Link
                          href={profilePath}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group"
                        >
                          <HiOutlineUser className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                          <span className="text-sm font-semibold">
                            My profile
                          </span>
                        </Link>
                        <Link
                          href="/wishlist"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group"
                        >
                          <FaHeart className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                          <span className="text-sm font-semibold">
                            My wishlist
                          </span>
                        </Link>
                        <Link
                          href="/customer/reviews"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group"
                        >
                          <FaStar className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                          <span className="text-sm font-semibold">
                            My reviews
                          </span>
                        </Link>
                        <Link
                          href="/profile?tab=orders"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group"
                        >
                          <FaClipboardList className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                          <span className="text-sm font-semibold">
                            Order history
                          </span>
                        </Link>
                        <Link
                          href="/profile?tab=complaints"
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-primary/5 text-foreground/80 hover:text-primary transition-all group"
                        >
                          <FaHeadset className="w-4 h-4 text-foreground/20 group-hover:text-primary" />
                          <span className="text-sm font-semibold">
                            Disputes & complaints
                          </span>
                        </Link>
                      </div>

                      <div className="mt-4 pt-4 border-t border-foreground/10 px-2">
                        {isAuthenticated ? (
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] hover:bg-rose-500/5 text-rose-500 transition-all group"
                          >
                            <FaSignOutAlt className="w-4 h-4" />
                            <span className="text-sm font-semibold text-left">
                              Sign out
                            </span>
                          </button>
                        ) : (
                          <div className="space-y-1">
                            <Link
                              href="/auth/login"
                              onClick={() => setIsProfileDropdownOpen(false)}
                              className="w-full flex items-center gap-3 px-4 py-3 rounded-[10px] bg-primary text-background transition-all group"
                            >
                              <HiOutlineUserCircle className="w-4 h-4 text-background/80" />
                              <span className="text-sm font-semibold text-left">
                                Sign in
                              </span>
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-foreground/5 rounded-[10px] touch-target text-black ml-2"
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
            >
              <Menu className="w-6 h-6 text-foreground/60" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Row: Categories (Products page) or Trust Bar (Home page only) */}
      {(isHomePage || isProductsPage) && (
        <div className="bg-surface border-t border-foreground/5 hidden md:block transition-all">
          <div className="max-w-[1600px] mx-auto px-8">
            <div className="flex items-center gap-4">
              {/* Categories Toggle Button (on home & products page) */}
              {sidebarContext && (
                <div className="relative group">
                  <button
                    onClick={sidebarContext.toggleCategorySidebar}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[10px] text-sm font-bold transition-all duration-200 shrink-0 border-2 ${
                      sidebarContext.isCategorySidebarOpen
                        ? "bg-primary text-background border-primary"
                        : "bg-background border-foreground/10 text-foreground/60 hover:border-primary hover:bg-primary/5"
                    }`}
                  >
                    <div className="w-6 h-6 flex items-center justify-center">
                      <Lottie
                        lottieRef={lottieRef}
                        animationData={
                          sidebarContext.isCategorySidebarOpen
                            ? slider2
                            : slider1
                        }
                        loop={true}
                        autoplay={true}
                        style={{ width: 24, height: 24 }}
                      />
                    </div>
                    <span className="font-black text-sm">
                      {sidebarContext.isCategorySidebarOpen
                        ? "Close"
                        : "Explore"}
                    </span>
                  </button>

                  {/* Temporary Animated Hint Button */}
                  <AnimatePresence>
                    {!sidebarContext.isCategorySidebarOpen && (
                      <ShowTimer>
                        <motion.button
                          initial={{ opacity: 0, y: 10, scale: 0.8 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            scale: 1,
                            transition: {
                              type: "spring",
                              stiffness: 400,
                              damping: 10,
                            },
                          }}
                          exit={{
                            opacity: 0,
                            scale: 0.5,
                            transition: { duration: 0.2 },
                          }}
                          whileHover={{ scale: 1.05 }}
                          onClick={sidebarContext.toggleCategorySidebar}
                          className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-black px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-white/20 flex items-center gap-1.5 z-50"
                        >
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                          </span>
                          Start Here
                          <div className="absolute -top-1 left-1/2 -translate-x-1/2 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-primary opacity-100"></div>
                        </motion.button>
                      </ShowTimer>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {isProductsPage || isHomePage ? (
                // Category Navigation (Visible on Home & Products Page)
                <div className="flex items-center gap-1 py-2 overflow-x-auto no-scrollbar">
                  {mainCategories.map((cat, i) => {
                    const isActive =
                      pathname === cat.href ||
                      (pathname === "/products" &&
                        searchParams?.get("cat") === cat.slug);

                    return (
                      <Link
                        key={i}
                        href={cat.href}
                        className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-all rounded-[10px] flex items-center gap-2 ${
                          isActive
                            ? "bg-black text-white shadow-md"
                            : "text-foreground/60 hover:text-primary hover:bg-background"
                        }`}
                      >
                        {cat.name}
                      </Link>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden px-4 pb-4 bg-background">
        <form
          onSubmit={handleSearch}
          className="flex items-center bg-surface rounded-[10px] px-4 py-1.5 gap-3 border-2 border-black/10 focus-within:border-black transition-all shadow-sm"
        >
          <Search className="w-4 h-4 text-foreground/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search for products..."
            className="bg-transparent text-sm w-full h-9 focus:outline-none font-medium text-foreground placeholder:text-foreground/30"
          />
        </form>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[110] md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[90vw] bg-background z-[120] md:hidden shadow-2xl overflow-y-auto border-l border-foreground/5"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="text-xl font-black text-primary">Menu</span>
                  <div className="flex items-center gap-2">
                    {isAuthenticated && <NotificationBell />}
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="p-2 bg-surface rounded-[10px] border border-foreground/5"
                    >
                      <X className="w-5 h-5 text-foreground" />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Support Link - Visible in mobile menu */}
                  <Link
                    href="/contact"
                    className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaHeadset className="w-5 h-5 text-foreground/20" />
                    Support
                  </Link>

                  {/* Cart Link - Visible in mobile menu */}
                  <Link
                    href="/cart"
                    className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div className="relative">
                      <HiOutlineShoppingCart className="w-5 h-5 text-foreground/20" />
                      {cart.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-black text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center">
                          {cart.length}
                        </span>
                      )}
                    </div>
                    Cart {cart.length > 0 && `(${cart.length})`}
                  </Link>

                  <Link
                    href="/products"
                    className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <AiOutlineProduct className="w-5 h-5 text-foreground/20" />
                    Products
                  </Link>

                  {user?.role === "ADMIN" && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 text-sm font-bold text-primary group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaShieldAlt className="w-5 h-5 text-primary/40 group-hover:text-primary" />
                      Admin Dashboard
                    </Link>
                  )}

                  {user?.role === "MANUFACTURER" && (
                    <Link
                      href="/manufacturer"
                      className="flex items-center gap-3 text-sm font-bold text-primary group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaIndustry className="w-5 h-5 text-primary/40 group-hover:text-primary" />
                      Manufacturer Dashboard
                    </Link>
                  )}

                  {user?.role === "SELLER" && (
                    <Link
                      href="/seller"
                      className="flex items-center gap-3 text-sm font-bold text-primary group"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaStore className="w-5 h-5 text-primary/40 group-hover:text-primary" />
                      Seller Dashboard
                    </Link>
                  )}

                  {/* Mobile Categories - NEW RESPONSIVE FIX */}
                  <div className="pt-6 border-t border-foreground/5">
                    <p className="text-sm font-bold text-primary/40 mb-4">
                      Product Categories
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {mainCategories.map((cat, i) => (
                        <Link
                          key={i}
                          href={cat.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="px-3 py-2 bg-surface border border-foreground/5 rounded-[10px] text-[10px] font-bold text-foreground/60 hover:text-primary hover:border-primary/20 transition-all text-center"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  {isAuthenticated ? (
                    <>
                      <div className="pt-6 border-t border-foreground/5">
                        <p className="text-sm font-bold text-primary/40 mb-4">
                          My Account
                        </p>
                        <div className="space-y-4">
                          <Link
                            href={profilePath}
                            className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <HiOutlineUser className="w-5 h-5 text-foreground/20" />
                            Profile Dashboard
                          </Link>
                          <Link
                            href="/wishlist"
                            className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <FaHeart className="w-5 h-5 text-foreground/20" />
                            Wishlist
                          </Link>
                          <Link
                            href="/profile?tab=orders"
                            className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <FaClipboardList className="w-5 h-5 text-foreground/20" />
                            Orders
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 text-sm font-bold text-rose-500 w-full text-left"
                          >
                            <FaSignOutAlt className="w-5 h-5" />
                            Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="pt-6 border-t border-foreground/5">
                        <p className="text-sm font-bold text-primary/40 mb-4">
                          Account
                        </p>
                        <Link
                          href="/auth/login"
                          className="flex items-center gap-3 text-sm font-bold text-foreground/70 hover:text-primary"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <HiOutlineUserCircle className="w-5 h-5 text-foreground/20" />
                          Sign In
                        </Link>
                      </div>
                    </>
                  )}
                </div>

                {!isAuthenticated && (
                  <div className="mt-12 pt-12 border-t border-foreground/5 space-y-4">
                    <Link
                      href="/auth/login"
                      className="btn-primary"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

// Helper component to handle the 5-second timer
function ShowTimer({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;
  return <>{children}</>;
}
