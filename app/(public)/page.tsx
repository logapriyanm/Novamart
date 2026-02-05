import Link from 'next/link';
import { Metadata } from 'next';
import CustomerProductCard from '../../src/components/ui/CustomerProductCard';
import { Sparkles, ChevronRight, Zap, ShieldCheck, Globe, Trophy, ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
    title: 'Novamart | India\'s Premier Home Appliance Hub',
    description: 'The most innovative marketplace for high-performance home appliances. Secure escrow payments and verified manufacturer networks for refrigerators, washing machines, and more.',
};

const categories = [
    { name: 'Refrigerators', image: 'https://images.unsplash.com/photo-1571175449180-f8b4d0201d9f?q=80&w=400&auto=format&fit=crop' },
    { name: 'Washing Machines', image: 'https://images.unsplash.com/photo-1626806819282-2c1dc61a0e0c?q=80&w=400&auto=format&fit=crop' },
    { name: 'Air Conditioners', image: 'https://images.unsplash.com/photo-1631545729916-46c23a563c77?q=80&w=400&auto=format&fit=crop' },
    { name: 'Microwave Ovens', image: 'https://images.unsplash.com/photo-1574265353392-0b29c9ccf6bc?q=80&w=400&auto=format&fit=crop' },
    { name: 'Smart TVs', image: 'https://images.unsplash.com/photo-1593359677759-543733a69271?q=80&w=400&auto=format&fit=crop' },
    { name: 'Vacuum Cleaners', image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop' },
    { name: 'Water Purifiers', image: 'https://images.unsplash.com/photo-1585837554808-a19e1371360d?q=80&w=400&auto=format&fit=crop' },
    { name: 'Kitchen Chimneys', image: 'https://images.unsplash.com/photo-1556911220-ebd537d8609a?q=80&w=400&auto=format&fit=crop' },
    { name: 'Mixer Grinders', image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?q=80&w=400&auto=format&fit=crop' },
    { name: 'Steam Irons', image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?q=80&w=400&auto=format&fit=crop' },
    { name: 'Dishwashers', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=400&auto=format&fit=crop' },
    { name: 'Air Purifiers', image: 'https://images.unsplash.com/photo-1585771724684-2827df306856?q=80&w=400&auto=format&fit=crop' },
];

export default function Home() {
    return (
        <div className="min-h-screen bg-[#F1F5F9]/50 pt-28 pb-20">
            {/* Main Market Hero / Awards Banner */}
            <div className="bg-[#101827] relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-[#101827] via-transparent to-[#101827] z-10" />
                <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-20 flex flex-col lg:flex-row items-center justify-between gap-12">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-black uppercase tracking-widest text-amber-400 mb-6">
                            <Trophy className="w-3 h-3" />
                            India SME 100 Awards 2025
                        </div>
                        <h1 className="text-4xl lg:text-6xl font-black text-white mb-6 leading-tight tracking-tighter">
                            The Ultimate <br /> Home <span className="text-[#2772A0]">Appliance Hub</span>
                        </h1>
                        <p className="text-white/60 text-lg font-medium mb-10 max-w-xl">
                            Novamart Recognized Among India's Top 100 Most Innovative Marketplace for Home Appliance Supply Chains.
                        </p>
                        <div className="flex flex-wrap items-center gap-6 justify-center lg:justify-start">
                            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Presented By</span>
                                <span className="text-xl font-black text-white">AXIS BANK</span>
                            </div>
                            <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Organised By</span>
                                <span className="text-sm font-black text-white">INDIA SME FORUM</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative">
                        <div className="aspect-[4/3] rounded-[3rem] overflow-hidden border-8 border-white/10 shadow-2xl skew-y-3 hover:skew-y-0 transition-transform duration-700">
                            <img
                                src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=1200&auto=format&fit=crop"
                                alt="Modern Appliances"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#2772A0] rounded-[2rem] flex items-center justify-center shadow-2xl z-30 animate-bounce-slow">
                            <Sparkles className="w-12 h-12 text-white" />
                        </div>
                    </div>
                </div>

                {/* Visual Accent */}
                <div className="h-2 w-full bg-gradient-to-r from-[#2772A0] via-[#2772A0] to-[#2772A0]" />
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-12">
                {/* Trending Categories Section */}
                <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl shadow-slate-200/50 border border-slate-200/60 relative -mt-20 z-30">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 tracking-tight">Trending Appliances <span className="text-[#2772A0] font-medium text-lg ml-2 italic">in Your Location</span></h2>
                            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest mt-2">Verified Direct Factory Supply</p>
                        </div>
                        <Link href="/products" className="group flex items-center gap-2 text-[#2772A0] text-[10px] font-black uppercase tracking-widest border-2 border-[#2772A0]/10 px-6 py-3 rounded-2xl hover:bg-[#2772A0] hover:text-white transition-all">
                            Explore All
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {categories.map((cat, i) => (
                            <Link key={i} href={`/products?q=${cat.name}`} className="group flex flex-col items-center text-center">
                                <div className="w-full aspect-square rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden mb-4 group-hover:shadow-xl group-hover:shadow-slate-200 transition-all p-4">
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <span className="text-xs font-black text-slate-600 group-hover:text-[#2772A0] transition-colors">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Protocol Trust Bar */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                    <div className="bg-[#2772A0] p-8 rounded-[2.5rem] flex items-center gap-6 group hover:translate-y-px transition-all shadow-xl shadow-[#2772A0]/20">
                        <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <ShieldCheck className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h3 className="text-white font-black uppercase tracking-widest text-[10px] mb-1">Genuine Warranty</h3>
                            <p className="text-white/80 text-sm font-medium">Direct settlement with manufacturer service networks.</p>
                        </div>
                    </div>
                    <div className="bg-white p-8 rounded-[2.5rem] flex items-center gap-6 group hover:translate-y-px transition-all shadow-xl shadow-slate-200 border border-slate-100">
                        <div className="w-16 h-16 bg-[#2772A0]/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Globe className="w-8 h-8 text-[#2772A0]" />
                        </div>
                        <div>
                            <h3 className="text-[#2772A0] font-black uppercase tracking-widest text-[10px] mb-1">Pan-India Network</h3>
                            <p className="text-slate-600 text-sm font-medium">Bridges local appliance dealers to factory inventory.</p>
                        </div>
                    </div>
                    <div className="bg-[#1E293B] p-8 rounded-[2.5rem] flex items-center gap-6 group hover:translate-y-px transition-all shadow-xl shadow-slate-900/10">
                        <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <Zap className="w-8 h-8 text-amber-400" />
                        </div>
                        <div>
                            <h3 className="text-amber-400 font-black uppercase tracking-widest text-[10px] mb-1">Smart Logistics</h3>
                            <p className="text-white/80 text-sm font-medium">Fragile-optimized transport with real-time tracking.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Newsletter conversion */}
            <div className="max-w-7xl mx-auto px-6 mt-32">
                <div className="bg-gradient-to-br from-[#2772A0] to-[#1E5F86] rounded-[4rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl shadow-[#2772A0]/40">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 blur-[120px] rounded-full -mr-48 -mt-48" />
                    <div className="relative z-10">
                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight tracking-tight">Expand your <br /> appliance business?</h2>
                        <p className="text-white/60 text-lg font-medium mb-12 max-w-2xl mx-auto italic">
                            Join 5,000+ verified appliance manufacturers and regional dealers already scaling with Novamart's specialized supply chain.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/auth/register" className="px-10 py-5 bg-white text-[#2772A0] font-black text-sm rounded-2xl hover:scale-105 transition-all shadow-xl uppercase tracking-widest flex items-center gap-3">
                                Join Marketplace
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                            <Link href="/auth/login" className="px-10 py-5 bg-transparent border-2 border-white/20 text-white font-black text-sm rounded-2xl hover:bg-white/10 transition-all uppercase tracking-widest">
                                Secure Portal
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
