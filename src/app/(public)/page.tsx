import { Metadata } from 'next';
import HeroSection from '../../client/components/home/HeroSection';
import TrustStrip from '../../client/components/home/TrustStrip';
import TrendingBar from '../../client/components/home/TrendingBar';
import CategoryGrid from '../../client/components/home/CategoryGrid';
import FeaturedProducts from '../../client/components/home/FeaturedProducts';
import WhyNovaMart from '../../client/components/home/WhyNovaMart';
import ManufacturersGrid from '../../client/components/home/ManufacturersGrid';
import Testimonials from '../../client/components/home/Testimonials';

export const metadata: Metadata = {
    title: 'Novamart | India\'s Premier Home Appliance Hub',
    description: 'The most innovative marketplace for high-performance home appliances. Secure escrow payments and verified manufacturer networks for refrigerators, washing machines, and more.',
};

export default function Home() {
    return (
        <div className="min-h-screen bg-[#F1F5F9]/50 pt-40 pb-20">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-8">
                {/* Main Content */}
                <main className="space-y-12">
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
    );
}


