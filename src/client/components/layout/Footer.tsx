"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PolicyModal } from "../ui/PolicyModal";
import { PolicyKey } from "../../data/sitePolicies";
import {
  FaFacebook as Facebook,
  FaTwitter as Twitter,
  FaLinkedin as Linkedin,
  FaYoutube as Youtube,
  FaShieldAlt as ShieldCheck,
  FaGlobe as Globe,
  FaBolt as Zap,
  FaHeart as Heart,
  FaEnvelope as Mail,
  FaPhoneAlt as Phone,
  FaMapMarkerAlt as MapPin,
} from "react-icons/fa";

const footerLinks = {
  platform: [
    { name: "About NovaMart", href: "/about" },
    { name: "Categories", href: "/categories" },
    { name: "Verified Brands", href: "/brands" },
    { name: "How it Works", href: "/guides" },
    { name: "Sitemap", href: "/sitemap" },
  ],
  business: [
    { name: "Manufacturer Login", href: "/auth/login?role=MANUFACTURER" },
    { name: "Seller Registration", href: "/auth/register?role=SELLER" },
    { name: "Appliance Verification", href: "/guides/verification" },
    { name: "Bulk Ordering", href: "/products" },
    { name: "Escrow Ledger", href: "/guides/escrow" },
  ],
  support: [
    { name: "Help Center", href: "/support" },
    { name: "Contact Us", key: "contact-us" },
    { name: "Report an Issue", key: "report-an-issue" },
    { name: "Dispute Resolution", key: "dispute-resolution" },
    { name: "Service SLA", key: "service-sla" },
  ],
  legal: [
    { name: "Privacy Policy", key: "privacy-policy" },
    { name: "Terms of Service", key: "terms-of-service" },
    { name: "Refund Policy", key: "refund-policy" },
    { name: "Compliance", key: "compliance" },
  ],
};

const socialLinks = [
  {
    icon: Twitter,
    href: "#",
    label: "Follow us on Twitter",
    colorClass: "text-[#000000]",
  },
  {
    icon: Facebook,
    href: "#",
    label: "Fan us on Facebook",
    colorClass: "text-[#1877F2]",
  },
  {
    icon: Linkedin,
    href: "#",
    label: "Connect with us on LinkedIn",
    colorClass: "text-[#0A66C2]",
  },
  {
    icon: Youtube,
    href: "#",
    label: "Subscribe to our YouTube channel",
    colorClass: "text-[#FF0000]",
  },
];

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePolicyClick = (key: string) => {
    setActivePolicy(key as PolicyKey);
    setIsModalOpen(true);
  };

  return (
    <footer className="relative bg-white text-foreground border-t border-slate-100 pt-12 md:pt-20 pb-10 overflow-hidden">
      {/* Glass Card Background Effect */}
      <div className="absolute inset-4 md:inset-8 rounded-3xl bg-white/80 backdrop-blur-xl border border-slate-100/60 shadow-[0_0_80px_rgba(0,0,0,0.03)] z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 lg:gap-8 mb-12 md:mb-10">
          {/* Brand Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link
              href="/"
              className="flex flex-col sm:flex-row items-center sm:items-start gap-4 group text-center sm:text-left"
            >
              <div className="w-14 h-14   flex items-center justify-center p-2.5  ">
                <img
                  src="/assets/Novamart.png"
                  alt="NovaMart"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold tracking-tighter text-black leading-none italic">
                  NovaMart
                </span>
                <span className="text-sm font-semibold text-black tracking-wide mt-1">
                  Enterprise Hub
                </span>
              </div>
            </Link>

            <p className="text-foreground/50 text-sm font-medium leading-relaxed max-w-sm mx-auto sm:mx-0">
              India's premier B2B2C hub for high-performance home appliances.
              Connecting verified manufacturers directly to regional sellers
              with zero-trust escrow governance.
            </p>

            <div
              className="flex items-center justify-center sm:justify-start gap-4"
              aria-label="Social media links"
            >
              {socialLinks.map((social, i) => (
                <Link
                  key={i}
                  href={social.href}
                  className={`w-10 h-10 rounded-[10px] bg-surface border border-foreground/10 flex items-center justify-center transition-all group hover:bg-muted hover:border-foreground/20 hover:grayscale`}
                  aria-label={social.label}
                >
                  <social.icon
                    className={`w-5 h-5 transition-all duration-300 ${social.colorClass} group-hover:text-foreground/40`}
                  />
                </Link>
              ))}
            </div>

            <div className="space-y-3 flex flex-col items-center sm:items-start">
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/40">
                <Mail className="w-4 h-4 text-black" />
                business@novamart.com
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/40">
                <Phone className="w-4 h-4 text-black" />
                +91 1800-NOVAMART
              </div>
              <div className="flex items-center gap-3 text-sm font-medium text-foreground/40">
                <MapPin className="w-4 h-4 text-black" />
                Mumbai, Maharashtra, India
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-8 grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-10 sm:gap-8">
            <div>
              <h3 className="text-sm font-bold text-primary mb-4 md:mb-8">
                Platform
              </h3>
              <ul className="space-y-3 md:space-y-4">
                {footerLinks.platform.map((link: any) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-primary mb-4 md:mb-8">
                Business
              </h3>
              <ul className="space-y-3 md:space-y-4">
                {footerLinks.business.map((link: any) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground/70 mb-4 md:mb-8">
                Support
              </h3>
              <ul className="space-y-3 md:space-y-4">
                {footerLinks.support.map((link: any) => (
                  <li key={link.name}>
                    {link.href ? (
                      <Link
                        href={link.href}
                        className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors"
                      >
                        {link.name}
                      </Link>
                    ) : (
                      <button
                        onClick={() => handlePolicyClick(link.key)}
                        className="text-sm font-bold text-foreground/40 hover:text-primary transition-colors text-left"
                      >
                        {link.name}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-black mb-4 md:mb-8">
                Legal
              </h3>
              <ul className="space-y-3 md:space-y-4">
                {footerLinks.legal.map((link: any) => (
                  <li key={link.name}>
                    <button
                      onClick={() => handlePolicyClick(link.key)}
                      className="text-sm font-semibold text-foreground/40 cursor-pointer hover:text-black transition-colors text-left"
                    >
                      {link.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="py-8 border-t border-foreground/5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                    <div className="flex items-center gap-4 p-4 rounded-[10px] bg-surface border border-foreground/5 shadow-xl shadow-black/5">
                        <ShieldCheck className="w-8 h-8 text-black shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-black italic">Escrow Guarded</h4>
                            <p className="text-sm text-foreground/40 font-medium italic">100% Payment Protection</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-[10px] bg-surface border border-foreground/5 shadow-xl shadow-black/5">
                        <Zap className="w-8 h-8 text-black shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-black italic">Fast Logistics</h4>
                            <p className="text-sm text-foreground/40 font-medium italic">Fragile-Optimized Shipping</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 rounded-[10px] bg-surface border border-foreground/5 shadow-xl shadow-black/5 sm:col-span-2 md:col-span-1">
                        <Globe className="w-8 h-8 text-black shrink-0" />
                        <div>
                            <h4 className="text-sm font-bold text-black italic">Global Reach</h4>
                            <p className="text-sm text-foreground/40 font-medium italic">Verified Manufacturer Network</p>
                        </div>
                    </div>
                </div> */}

        {/* Copyright Bar */}
        <div className="pt-8 pb-0 border-t border-foreground/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4 text-sm font-medium text-foreground/60 text-center md:text-left">
            <span>
              © 2026 <span className="text-primary italic">NovaMart</span> B2B2C
              Connection Platform.
            </span>
          </div>
        </div>
      </div>

      <PolicyModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        policyKey={activePolicy}
      />
    </footer>
  );
}
