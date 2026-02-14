import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { blogPosts } from '../../../lib/data/blogData';

export const metadata: Metadata = {
    title: 'NovaMart Blog | B2B E-commerce Insights & Guides',
    description: 'Read the latest insights on wholesale sourcing, renewable energy trends, and B2B e-commerce strategies on the NovaMart Blog.',
};

export default function BlogListingPage() {
    return (
        <div className="min-h-screen bg-slate-50 pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        NovaMart <span className="text-primary">Insights</span>
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Expert guides, industry trends, and business strategies for manufacturers and dealers.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogPosts.map((post) => (
                        <Link href={`/blog/${post.slug}`} key={post.slug} className="group">
                            <article className="bg-white rounded-[10px] overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                                <div className="aspect-video bg-slate-200 relative overflow-hidden">
                                    {/* Placeholder for real image */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 flex items-center justify-center text-primary/20 font-black text-4xl uppercase tracking-widest">
                                        NovaMart
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <div className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                                        {post.date}
                                    </div>
                                    <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-500 mb-6 line-clamp-3 text-sm leading-relaxed flex-1">
                                        {post.excerpt}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mt-auto">
                                        <span>Read Article</span>
                                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
