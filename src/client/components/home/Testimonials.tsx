import React from 'react';
import {
    FaArrowLeft,
    FaArrowRight,
    FaQuoteRight,
    FaQuoteLeft,
    FaHeart,
    FaStar as Star
} from 'react-icons/fa';

const testimonials = [
    {
        id: 1,
        variant: "service-card",
        title: "Good Services!",
        text: "Sodales ut etiam sit amet nisl. Semper feugiat nibh sed pulvinar proin gravida facilisi.",
        author: "James Brown",
        role: "COO, Dunig Co.",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        cols: "md:col-span-1",
        rows: "md:row-span-1"
    },
    {
        id: 2,
        variant: "pure-quote",
        title: "I really appreciate!!",
        text: "Congue mauris rhoncus depene an vel elit Morbi non arcu risus quis varius Tincidunt.",
        author: "Victoria Wotton",
        role: "Fermentum Odio Co.",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        cols: "md:col-span-1",
        rows: "md:row-span-1"
    },
    {
        id: 3,
        variant: "photo-split",
        title: "Direct yet Friendly",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        author: "Menry Vane",
        role: "CEO",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop",
        cols: "md:col-span-1",
        rows: "md:row-span-1"
    },
    {
        id: 4,
        variant: "wide-likes",
        title: "Tremendous Job Team",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida.",
        author: "Marthe Wallin",
        role: "Product Lead",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
        likes: 65,
        cols: "md:col-span-2",
        rows: "md:row-span-1"
    },
    {
        id: 5,
        variant: "typography-hero",
        text: "When an unknown printer took A galley of type and scrambled it to make a type specimen Book.",
        author: "Charli Hapan",
        role: "Dribbble",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
        cols: "md:col-span-2",
        rows: "md:row-span-2"
    },
    {
        id: 6,
        variant: "simple-card",
        title: "Victoria Wotton",
        text: "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text.",
        author: "Victoria Wotton",
        role: "Fermentum Odio Co.",
        image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        cols: "md:col-span-1",
        rows: "md:row-span-1"
    },
    {
        id: 7,
        variant: "centered-avatar",
        text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        author: "Isabella L.",
        role: "Designer",
        image: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?q=80&w=200&auto=format&fit=crop",
        rating: 5,
        cols: "md:col-span-1",
        rows: "md:row-span-1"
    }
];

export default function Testimonials() {
    return (
        <div className="max-w-7xl mx-auto px-6 mt-32 mb-32">
            <div className="text-center mb-16">
                <h2 className="text-3xl lg:text-4xl font-black text-foreground tracking-tight">Trusted by Industry Leaders</h2>
                <p className="text-foreground/50 font-medium mt-4 max-w-2xl mx-auto">See what our partners and customers are saying about their experience with Novamart.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-auto">
                {testimonials.map((item) => (
                    <div key={item.id} className={`bg-surface rounded-[2rem] p-8 shadow-xl shadow-primary/5 border border-foreground/5 hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden ${item.cols} ${item.rows}`}>

                        {/* Service Card (Centered with arrows) */}
                        {item.variant === 'service-card' && (
                            <div className="flex flex-col items-center text-center h-full">
                                <div className="relative mb-6">
                                    <div className="absolute top-1/2 -left-12 -translate-y-1/2">
                                        <FaArrowLeft className="text-foreground/20 text-xs" />
                                    </div>
                                    <div className="w-14 h-14 rounded-full p-1 bg-background border border-foreground/5 shadow-sm">
                                        <img src={item.image} alt={item.author} className="w-full h-full rounded-full object-cover" />
                                    </div>
                                    <div className="absolute top-1/2 -right-12 -translate-y-1/2">
                                        <FaArrowRight className="text-foreground/20 text-xs" />
                                    </div>
                                </div>
                                <h3 className="text-base font-black text-foreground mb-2">{item.title}</h3>
                                <p className="text-[10px] text-foreground/40 leading-relaxed mb-4">{item.text}</p>
                                <div className="flex gap-1 text-amber-400 text-[10px] mt-auto">
                                    {[...Array(item.rating)].map((_, i) => <Star key={i} />)}
                                </div>
                            </div>
                        )}

                        {/* Pure Quote Card (Avatar left, Quote right) */}
                        {item.variant === 'pure-quote' && (
                            <div className="h-full flex flex-col">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <img src={item.image} alt={item.author} className="w-10 h-10 rounded-full object-cover" />
                                        <FaQuoteRight className="text-2xl text-foreground" />
                                    </div>
                                </div>
                                <div className="mt-2 mb-6">
                                    <span className="text-[10px] font-bold text-foreground/40 block mb-1">{item.author}</span>
                                    <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-wider">{item.role}</span>
                                </div>
                                <h3 className="text-sm font-black text-foreground mb-2">{item.title}</h3>
                                <p className="text-[10px] text-foreground/40 leading-relaxed">{item.text}</p>
                                <div className="flex gap-1 text-amber-400 text-[8px] mt-4">
                                    {[...Array(item.rating)].map((_, i) => <Star key={i} />)}
                                </div>
                            </div>
                        )}

                        {/* Photo Split Card */}
                        {item.variant === 'photo-split' && (
                            <div className="flex items-center gap-6 h-full">
                                <div className="flex-1">
                                    <FaQuoteLeft className="text-xl text-foreground mb-3" />
                                    <h3 className="text-sm font-black text-foreground mb-2">{item.title}</h3>
                                    <p className="text-[10px] text-foreground/40 leading-relaxed mb-4">{item.text}</p>
                                    <div>
                                        <p className="text-[10px] font-bold text-foreground">{item.author}</p>
                                        <p className="text-[8px] text-foreground/40">{item.role}</p>
                                    </div>
                                </div>
                                <div className="w-24 h-full rounded-2xl overflow-hidden flex-shrink-0">
                                    <img src={item.image} alt={item.author} className="w-full h-full object-cover" />
                                </div>
                            </div>
                        )}

                        {/* Wide Likes Card */}
                        {item.variant === 'wide-likes' && (
                            <div className="flex flex-col justify-center h-full relative">
                                <div className="absolute top-0 right-0 bg-background px-3 py-1 rounded-bl-2xl flex items-center gap-1 border-b border-l border-foreground/5">
                                    <FaHeart className="text-xs text-rose-500" />
                                    <span className="text-[10px] font-bold text-foreground/60">{item.likes} Like</span>
                                </div>
                                <div className="flex items-start gap-8 px-4">
                                    <div className="flex-1 text-center">
                                        <h3 className="text-xl font-black text-foreground mb-3">{item.title}</h3>
                                        <p className="text-xs text-foreground/40 leading-relaxed max-w-lg mx-auto mb-6">{item.text}</p>
                                        <span className="text-xs font-bold text-foreground block">{item.author}</span>
                                    </div>
                                </div>
                                <div className="flex justify-center mt-6 -space-x-2">
                                    <img src={item.image} className="w-8 h-8 rounded-full border-2 border-background" />
                                    <div className="w-8 h-8 rounded-full border-2 border-background bg-surface flex items-center justify-center text-[8px] font-bold text-foreground/40">+3</div>
                                </div>
                            </div>
                        )}

                        {/* Typography Hero Card */}
                        {item.variant === 'typography-hero' && (
                            <div className="flex flex-col justify-between h-full relative p-4">
                                <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center mb-6">
                                    <FaQuoteRight className="text-xl text-primary" />
                                </div>
                                <div className="mb-8">
                                    <p className="text-[10px] uppercase tracking-widest text-foreground/40 mb-2">What People Say</p>
                                    <h3 className="text-2xl font-serif font-bold text-foreground leading-tight">
                                        {item.text}
                                    </h3>
                                </div>
                                <div className="flex items-center gap-3 mt-auto">
                                    <img src={item.image} className="w-8 h-8 rounded-full" />
                                    <span className="text-xs font-bold text-foreground">{item.author}</span>
                                    <span className="ml-auto font-handwriting text-foreground/20 text-lg">dribbble</span>
                                </div>
                            </div>
                        )}

                        {/* Simple Card */}
                        {item.variant === 'simple-card' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                    <img src={item.image} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <h4 className="text-xs font-bold text-foreground">{item.title}</h4>
                                        <p className="text-[8px] text-foreground/40">{item.role}</p>
                                    </div>
                                </div>
                                <p className="text-[10px] text-foreground/50 leading-relaxed italic border-l-2 border-foreground/5 pl-3">
                                    {item.text}
                                </p>
                                <div className="flex gap-1 text-amber-400 text-[8px]">
                                    {[...Array(item.rating)].map((_, i) => <Star key={i} />)}
                                </div>
                            </div>
                        )}

                        {/* Centered Avatar Simple */}
                        {item.variant === 'centered-avatar' && (
                            <div className="text-center flex flex-col items-center pt-4">
                                <div className="w-12 h-12 rounded-full mb-3 overflow-hidden">
                                    <img src={item.image} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex gap-1 text-amber-400 text-[8px] mb-3">
                                    {[...Array(item.rating)].map((_, i) => <Star key={i} />)}
                                </div>
                                <p className="text-[10px] text-foreground/50 leading-relaxed mb-4">
                                    {item.text}
                                </p>
                                <span className="font-handwriting text-xl text-foreground/40">Isabella ..</span>
                            </div>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}

