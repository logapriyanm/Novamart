'use client';

import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';

export default function AdminHeader() {
    return (
        <div className="bg-surface border-b border-foreground/5 px-6 py-4">
            <div className="flex items-center justify-between gap-6">
                {/* Left: Branding (Mobile mostly) */}
                <div className="lg:hidden flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-md border border-foreground/[0.03]">
                        <img src="/logo.png" alt="N" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-sm font-black text-foreground tracking-tighter">NovaMart</span>
                </div>

                {/* Center: Search Bar */}
                <div className="flex-1 max-w-2xl mx-auto">
                    <div className="relative">
                        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Search mission control..."
                            className="w-full pl-12 pr-4 py-2.5 bg-background border border-foreground/5 rounded-lg text-sm placeholder:text-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-foreground"
                        />
                    </div>
                </div>

                {/* Right: Notifications & User Profile */}
                <div className="flex items-center gap-4">
                    {/* Notification Bell */}
                    <button className="relative p-2.5 hover:bg-background rounded-xl transition-colors text-foreground/40 hover:text-primary">
                        <FaBell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full border-2 border-surface"></span>
                    </button>

                    {/* User Profile */}
                    <div className="flex items-center gap-3 pl-4 border-l border-foreground/5">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-foreground leading-none">Sarah Connor</p>
                            <p className="text-[10px] text-foreground/40 font-black uppercase tracking-widest mt-1">Super Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center overflow-hidden border border-foreground/5">
                            <img
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150"
                                alt="Sarah Connor"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
