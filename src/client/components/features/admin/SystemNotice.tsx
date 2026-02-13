'use client';

import React from 'react';
import { FaInfoCircle } from 'react-icons/fa';

export default function SystemNotice() {
    return (
        <div className="bg-primary/10 border border-primary/20 p-6 rounded-3xl">
            <div className="flex items-start gap-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                    <FaInfoCircle className="w-4 h-4 text-background" />
                </div>
                <div>
                    <h5 className="text-sm font-bold text-primary mb-2">System Notice</h5>
                    <p className="text-sm font-medium text-foreground/80 leading-relaxed mb-4">
                        Scheduled maintenance for the Logistics API is set for <span className="font-bold text-primary">Sunday, 02:00 AM UTC</span>. Dashboard features may experience intermittent delays.
                    </p>
                    <a href="#" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                        View Schedule
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
