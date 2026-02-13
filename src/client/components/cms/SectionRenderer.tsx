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
import AIFeaturedProducts from '@/client/components/features/home/AIFeaturedProducts';
import ComboOfferProducts from '@/client/components/features/home/ComboOfferProducts';
import PersonalizedHero from '@/client/components/features/home/PersonalizedHero';
import PromotionStrip from '@/client/components/features/home/PromotionStrip';
import ContinueViewing from '@/client/components/features/home/ContinueViewing';

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
    B2BShortcuts,
    AIFeaturedProducts,
    ComboOfferProducts,
    PersonalizedHero,
    PromotionStrip,
    ContinueViewing
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

    if (section.componentName === 'OccasionBanner') {
        if (!personalizedData?.specialDay) return null;
        props.type = personalizedData.specialDay.type;
        props.discount = Number(personalizedData.specialDay.discount);
        props.userName = user?.name || 'User';
    }

    if (section.componentName === 'B2BShortcuts') {
        if (!personalizedData?.b2bMetrics) return null;
        props.metrics = personalizedData.b2bMetrics;
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

    if (section.componentName === 'AIFeaturedProducts') {
        if (!personalizedData?.recommended || personalizedData.recommended.length === 0) return null;
        props.products = personalizedData.recommended;
    }

    if (section.componentName === 'ComboOfferProducts') {
        if (!personalizedData?.combos || personalizedData.combos.length === 0) return null;
        props.products = personalizedData.combos;
    }

    if (section.componentName === 'PersonalizedHero') {
        if (!personalizedData?.hero) return null;
        props.data = personalizedData.hero;
    }

    if (section.componentName === 'PromotionStrip') {
        props.message = section.content?.message || 'Exclusive Deals Live Now!';
    }

    if (section.componentName === 'ContinueViewing') {
        if (!personalizedData?.continueViewing || personalizedData.continueViewing.length === 0) return null;
        props.data = personalizedData.continueViewing;
    }

    return (
        <section className="scroll-mt-1">
            {section.title && section.title !== 'Hero Section' && (
                <div className="mb-6">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tighter uppercase italic">
                        {/* {section.title} */}
                    </h2>
                    {section.subtitle && (
                        <p className="text-sm text-foreground/60 font-bold uppercase tracking-widest mt-1">
                            {section.subtitle}
                        </p>
                    )}
                </div>
            )}
            <div>
                <Component {...props} />
            </div>
        </section>
    );
}
