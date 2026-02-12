'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/client/hooks/useAuth';
import { apiClient } from '@/lib/api/client';
import SectionRenderer from './SectionRenderer';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '@/client/components/ui/Loader';

export default function DynamicHome() {
    const { user, isAuthenticated } = useAuth();
    const [sections, setSections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [personalizedData, setPersonalizedData] = useState<any>(null);

    useEffect(() => {
        const fetchCMSConfig = async () => {
            try {
                setIsLoading(true);
                // Fetch dynamic CMS configuration based on role
                const endpoint = isAuthenticated ? '/cms/home' : '/cms/home/guest';
                const data = await apiClient.get<any[]>(endpoint);
                setSections(data);
            } catch (error) {
                console.error('[CMS] Failed to fetch home config:', error);
            } finally {
                setIsLoading(false);
            }
        };

        const fetchPersonalization = async () => {
            if (!isAuthenticated) return;
            try {
                const data = await apiClient.get<any>('/home/personalized');
                if (data) {
                    setPersonalizedData(data);
                }
            } catch (error) {
                console.warn('[CMS] Failed to fetch personalization:', error);
            }
        };

        fetchCMSConfig();
        fetchPersonalization();
    }, [isAuthenticated, user]);

    const replacePlaceholders = (text: string) => {
        if (!text) return text;
        let processed = text;
        if (user?.name) processed = processed.replace(/{{userName}}/g, user.name);
        processed = processed.replace(/{{role}}/g, (user?.role || 'Guest').toLowerCase());

        // Dynamic discount placeholder (from personalized data or default 10%)
        const discountValue = personalizedData?.specialDay?.discount || '10';
        processed = processed.replace(/{{discount}}/g, `${discountValue}%`);

        return processed;
    };

    if (isLoading && sections.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader size="xl" />
            </div>
        );
    }

    if (!isLoading && sections.length === 0) {
        return (
            <div className="text-center py-32 bg-surface rounded-[20px] border border-foreground/5 shadow-sm">
                <h2 className="text-2xl font-black text-foreground uppercase tracking-tighter">Welcome to NovaMart</h2>
                <p className="text-foreground/40 font-bold uppercase tracking-widest text-[10px] mt-2">Connecting industry leaders globally.</p>
            </div>
        );
    }

    return (
        <main className="space-y-16">
            <AnimatePresence>
                {sections.map((section, index) => {
                    const processedSection = {
                        ...section,
                        title: replacePlaceholders(section.title),
                        subtitle: replacePlaceholders(section.subtitle),
                        content: JSON.parse(replacePlaceholders(JSON.stringify(section.content || {})))
                    };

                    return (
                        <motion.div
                            key={section._id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.05, duration: 0.5 }}
                        >
                            <SectionRenderer
                                section={processedSection}
                                user={user}
                                personalizedData={personalizedData}
                            />
                        </motion.div>
                    );
                })}
            </AnimatePresence>
        </main>
    );
}
