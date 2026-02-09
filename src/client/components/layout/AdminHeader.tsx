'use client';

import React from 'react';
import { FaBell, FaSearch } from 'react-icons/fa';
import UserDropdown from './UserDropdown';

export default function AdminHeader() {
    return (
        <div className="bg-surface border-b border-foreground/5 px-6 py-4">
            <div className="flex items-center justify-between gap-6">
                {/* Left: Branding (Mobile mostly) */}
                <div className="lg:hidden flex items-center gap-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center p-1 shadow-md border border-foreground/[0.03]">
                        <img src="/assets/Novamart.png" alt="N" className="w-full h-full object-contain" />
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

                    <UserDropdown />
                </div>
            </div>
        </div>
    );
}
