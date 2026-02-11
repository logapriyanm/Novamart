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
import { useAuth } from '@/client/hooks/useAuth';
import { apiClient } from '@/lib/api/client';

// Simple interface for personalized data to avoid any type errors
interface PersonalizedData {
    specialDay?: { type: string; discount: string };
    b2bMetrics?: {
        role: 'DEALER' | 'MANUFACTURER';
        actions: { label: string; count: number; link: string; icon: string }[];
    };
    hero?: { product?: any; category?: string };
    continueViewing?: any[];
    recommended?: any[];
}

export default function HomeClient() {
    const { user, isAuthenticated } = useAuth();
    const [personalizedData, setPersonalizedData] = React.useState<PersonalizedData | null>(null);

    React.useEffect(() => {
        // Clear personalized data if user logs out
        if (!user || !isAuthenticated) {
            setPersonalizedData(null);
            return;
        }

        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');

                if (token) {
                    // Fetch personalized data for logged-in users
                    try {
                        const res = await apiClient.get<any>('/home/personalized');
                        // Handle potential different response structures
                        const data = res.success ? res.data : res;
                        if (data) {
                            setPersonalizedData(data);
                        }
                    } catch (error: any) {
                        // If personalized fails, silently continue (user will see default content)
                        console.log('Personalized data not available, showing default content');
                    }
                }
            } catch (error) {
                console.error('Failed to fetch home data', error);
            }
        };
        fetchData();
    }, [user, isAuthenticated]);

    return (
        <div className="min-h-screen bg-[#F1F5F9]/50 pt-40 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                {/* Main Content */}
                <main className="space-y-12">
                    <HeroSection />
                    <BrandSpotlight />

                    <TrendingBar />
                    <CustomerOffers />
                    <BestsellerSlider />

                    {/* Guest Banner Removed as per request */}


                    {isAuthenticated && user && (
                        <>
                            {personalizedData?.specialDay && (
                                <OccasionBanner
                                    type={personalizedData.specialDay.type as 'BIRTHDAY' | 'FESTIVAL' | 'ANNIVERSARY' | 'WELCOME'}
                                    discount={Number(personalizedData.specialDay.discount)}
                                    userName={user?.name || 'User'}
                                />
                            )}

                            {personalizedData?.b2bMetrics && (
                                <B2BShortcuts metrics={personalizedData.b2bMetrics} />
                            )}

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

                            {personalizedData?.recommended && personalizedData.recommended.length > 0 && (
                                <RecommendedProducts
                                    title="Recommended for You"
                                    products={personalizedData.recommended}
                                />
                            )}


                        </>
                    )}

                    <TrustStrip />
                    <CategoryGrid />

                    {/* Guest-only Trust Components */}
                    {!isAuthenticated && (
                        <>
                            <WhyNovaMart />
                            <ManufacturersGrid />
                            <Testimonials />
                        </>
                    )}

                </main>
            </div>
            <DeliveryPartners />
        </div>
    );
}
