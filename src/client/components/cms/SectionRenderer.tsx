'use client';

import React from 'react';
import HeroSection from '@/client/components/features/home/HeroSection';
import TrustStrip from '@/client/components/features/home/TrustStrip';
import TrendingBar from '@/client/components/features/home/TrendingBar';
import CategoryGrid from '@/client/components/features/home/CategoryGrid';
import CustomerOffers from '@/client/components/features/home/CustomerOffers';
import WhyNovaMart from '@/client/components/features/home/WhyNovaMart';
import ManufacturersGrid from '@/client/components/features/home/ManufacturersGrid';
import Testimonials from '@/client/components/features/home/Testimonials';
import BrandSpotlight from '@/client/components/features/home/BrandSpotlight';
import DeliveryPartners from '@/client/components/features/home/DeliveryPartners';
import OccasionBanner from '@/client/components/features/home/OccasionBanner';
import RecommendedProducts from '@/client/components/features/home/RecommendedProducts';
import BestsellerSlider from '@/client/components/features/home/BestsellerSlider';
import B2BShortcuts from '@/client/components/features/home/B2BShortcuts';

const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    HeroSection,
    TrustStrip,
    TrendingBar,
    CategoryGrid,
    CustomerOffers,
    WhyNovaMart,
    ManufacturersGrid,
    Testimonials,
    BrandSpotlight,
    DeliveryPartners,
    OccasionBanner,
    RecommendedProducts,
    BestsellerSlider,
    B2BShortcuts
};

interface SectionRendererProps {
    section: {
        componentName: string;
        title?: string;
        subtitle?: string;
        content?: any;
    };
    user?: any;
    personalizedData?: any;
}

export default function SectionRenderer({ section, user, personalizedData }: SectionRendererProps) {
    const Component = COMPONENT_MAP[section.componentName];

    if (!Component) {
        console.warn(`[CMS] Component not found: ${section.componentName}`);
        return null;
    }

    // Pass custom props based on component needs
    const props: any = { ...section.content };

    if (section.componentName === 'OccasionBanner' && personalizedData?.specialDay) {
        props.type = personalizedData.specialDay.type;
        props.discount = Number(personalizedData.specialDay.discount);
        props.userName = user?.name || 'User';
        // Only render if data exists
        if (!personalizedData.specialDay) return null;
    }

    if (section.componentName === 'B2BShortcuts' && personalizedData?.b2bMetrics) {
        props.metrics = personalizedData.b2bMetrics;
        if (!personalizedData.b2bMetrics) return null;
    }

    if (section.componentName === 'RecommendedProducts') {
        if (section.content?.title === "Top Pick For You") {
            if (!personalizedData?.hero?.product) return null;
            props.title = `Top Pick for You: ${personalizedData.hero.category}`;
            props.products = [personalizedData.hero.product];
        } else if (section.content?.title === "Continue Where You Left Off") {
            if (!personalizedData?.continueViewing || personalizedData.continueViewing.length === 0) return null;
            props.products = personalizedData.continueViewing;
        } else {
            // Default recommended
            if (!personalizedData?.recommended || personalizedData.recommended.length === 0) return null;
            props.products = personalizedData.recommended;
        }
    }

    return (
        <section className="scroll-mt-32">
            {section.title && section.title !== 'Hero Section' && (
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase italic">
                        {section.title}
                    </h2>
                    {section.subtitle && (
                        <p className="text-sm text-foreground/60 font-bold uppercase tracking-widest mt-1">
                            {section.subtitle}
                        </p>
                    )}
                </div>
            )}
            <div className="rounded-[10px] overflow-hidden">
                <Component {...props} />
            </div>
        </section>
    );
}
