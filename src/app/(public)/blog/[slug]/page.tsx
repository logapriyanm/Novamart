import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { blogPosts } from '@/lib/data/blogData';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaCalendarAlt, FaUser } from 'react-icons/fa';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        return {
            title: 'Article Not Found | NovaMart Blog',
        };
    }

    return {
        title: `${post.title} | NovaMart Blog`,
        description: post.excerpt,
        openGraph: {
            title: post.title,
            description: post.excerpt,
            type: 'article',
            publishedTime: post.date,
            authors: [post.author],
        },
    };
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = blogPosts.find(p => p.slug === slug);

    if (!post) {
        notFound();
    }


    // JSON-LD for Blog Posting
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        image: [post.image],
        datePublished: post.date,
        author: {
            '@type': 'Person',
            name: post.author
        },
        publisher: {
            '@type': 'Organization',
            name: 'NovaMart',
            logo: {
                '@type': 'ImageObject',
                url: 'https://novamart.com/logo.png'
            }
        },
        description: post.excerpt
    };

    return (
        <div className="min-h-screen bg-white pt-32 pb-20">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="max-w-3xl mx-auto px-4 sm:px-6">
                <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary mb-8 transition-colors">
                    <FaArrowLeft /> Back to Blog
                </Link>

                <header className="mb-12">
                    <div className="flex items-center gap-6 text-sm text-slate-500 mb-6">
                        <span className="flex items-center gap-2">
                            <FaCalendarAlt className="text-primary/60" />
                            {post.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <FaUser className="text-primary/60" />
                            {post.author}
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight mb-6">
                        {post.title}
                    </h1>
                    <p className="text-xl text-slate-600 leading-relaxed font-medium">
                        {post.excerpt}
                    </p>
                </header>

                <div className="prose prose-lg prose-slate max-w-none">
                    {/* Blog content is from static blogData.ts - safe, but sanitized for best practices */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </div>

                <div className="mt-16 pt-8 border-t border-slate-100">
                    <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 text-center">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">Ready to start trading?</h3>
                        <p className="text-slate-600 mb-6">Join thousands of verified businesses on NovaMart today.</p>
                        <Link href="/register" className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-dark transition-colors">
                            Create Free Account
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}
