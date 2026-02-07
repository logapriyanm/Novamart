'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function TrafficOrigin() {
    return (
        <div className="bg-surface p-6 rounded-3xl shadow-sm border border-foreground/5">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <h5 className="text-[10px] font-black text-foreground uppercase tracking-[0.2em]">Traffic Origin</h5>
            </div>

            <div className="aspect-[4/3] bg-background rounded-2xl border border-foreground/5 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
                <p className="text-[8px] font-black text-foreground/40 uppercase tracking-[0.3em] mb-4">Live Geolocation Tracking</p>

                {/* Simplified visualization representing the bars in the image */}
                <div className="flex items-end gap-1.5 h-16">
                    {[12, 18, 14, 22, 10, 24, 16, 20, 14].map((h, i) => (
                        <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: h * 2 }}
                            transition={{ delay: i * 0.1, duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
                            className="w-1.5 bg-primary rounded-full opacity-60 group-hover:opacity-100 transition-opacity"
                        />
                    ))}
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-background/10 to-transparent pointer-events-none" />
            </div>
        </div>
    );
}
