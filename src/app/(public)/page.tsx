'use client';

import React from 'react';
import HeroSection from '@/client/components/features/home/HeroSection';
import TrustStrip from '@/client/components/features/home/TrustStrip';
import TrendingBar from '@/client/components/features/home/TrendingBar';
import CategoryGrid from '@/client/components/features/home/CategoryGrid';
import FeaturedProducts from '@/client/components/features/home/FeaturedProducts';
import WhyNovaMart from '@/client/components/features/home/WhyNovaMart';
import ManufacturersGrid from '@/client/components/features/home/ManufacturersGrid';
import Testimonials from '@/client/components/features/home/Testimonials';
import BrandSpotlight from '@/client/components/features/home/BrandSpotlight';
import DeliveryPartners from '@/client/components/features/home/DeliveryPartners';
import OccasionBanner from '@/client/components/features/home/OccasionBanner';
import RecommendedProducts from '@/client/components/features/home/RecommendedProducts';
import PromotionStrip from '@/client/components/features/home/PromotionStrip';
import { useAuth } from '@/client/hooks/useAuth';

export default function Home() {
    const { user } = useAuth();
    const [personalizedData, setPersonalizedData] = React.useState<any>(null);

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch personalized data (will work if logged in, otherwise might return default/empty)
                // We can check auth token presence or just try fetching.
                if (localStorage.getItem('token')) {
                    const res = await import('@/lib/api/client').then(m => m.apiClient.get('/home/personalized')) as any;
                    if (res.success) {
                        setPersonalizedData(res.data);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch home data', error);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="min-h-screen bg-[#F1F5F9]/50 pt-40 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                {/* Main Content */}
                <main className="space-y-12">
                    <HeroSection />

                    {personalizedData?.specialDay && (
                        <OccasionBanner
                            type={personalizedData.specialDay.type}
                            discount={personalizedData.specialDay.discount}
                            userName={user?.name || 'User'}
                        />
                    )}

                    <TrustStrip />
                    <TrendingBar />

                    {personalizedData?.hero && personalizedData.hero.product && (
                        <RecommendedProducts
                            title={`Top Pick for You: ${personalizedData.hero.category}`}
                            products={[personalizedData.hero.product]}
                        />
                    )}

                    {personalizedData?.continueViewing && personalizedData.continueViewing.length > 0 && (
                        <RecommendedProducts
                            title="Continue Where You Left Off"
                            products={personalizedData.continueViewing}
                        />
                    )}

                    <BrandSpotlight />

                    {personalizedData?.recommended && personalizedData.recommended.length > 0 && (
                        <RecommendedProducts
                            title="Recommended for You"
                            products={personalizedData.recommended}
                        />
                    )}

                    <FeaturedProducts />
                    <CategoryGrid />
                    <WhyNovaMart />
                    <ManufacturersGrid />
                    <Testimonials />
                </main>
            </div>
            <DeliveryPartners />
        </div>
    );
}



