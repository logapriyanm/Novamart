import { Metadata } from 'next';
import HeroSection from '../../src/components/home/HeroSection';
import TrustStrip from '../../src/components/home/TrustStrip';
import TrendingBar from '../../src/components/home/TrendingBar';
import CategoryGrid from '../../src/components/home/CategoryGrid';
import FeaturedProducts from '../../src/components/home/FeaturedProducts';
import WhyNovaMart from '../../src/components/home/WhyNovaMart';
import ManufacturersGrid from '../../src/components/home/ManufacturersGrid';
import Testimonials from '../../src/components/home/Testimonials';
import HomeCategorySidebar from '../../src/components/home/HomeCategorySidebar';

export const metadata: Metadata = {
    title: 'Novamart | India\'s Premier Home Appliance Hub',
    description: 'The most innovative marketplace for high-performance home appliances. Secure escrow payments and verified manufacturer networks for refrigerators, washing machines, and more.',
};

export default function Home() {
    return (
        <div className="min-h-screen bg-[#F1F5F9]/50 pt-40 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                <div className="flex gap-8">
                    {/* Category Sidebar */}
                    <HomeCategorySidebar />

                    {/* Main Content */}
                    <main className="flex-1 min-w-0 space-y-12">
                        <HeroSection />
                        <TrustStrip />
                        <TrendingBar />
                        <CategoryGrid />
                        <FeaturedProducts />
                        <WhyNovaMart />
                        <ManufacturersGrid />
                        <Testimonials />
                    </main>
                </div>
            </div>
        </div>
    );
}


