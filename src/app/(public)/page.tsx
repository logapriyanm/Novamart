import { Metadata } from 'next';
import { cookies } from 'next/headers';
import HomeClient from './HomeClient';

async function getCMSMetadata() {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${baseUrl}/cms/home/guest`, {
            next: { revalidate: 3600 },
            headers: { 'Cache-Control': 'no-cache' } // Ensure we get fresh data if needed
        });
        const json = await res.json();

        if (json.success && json.data?.length > 0) {
            // Find section with SEO content
            const seoSection = json.data.find((s: any) => s.seo?.metaTitle || s.seo?.metaDescription);
            if (seoSection) {
                return {
                    title: seoSection.seo.metaTitle,
                    description: seoSection.seo.metaDescription,
                    keywords: seoSection.seo.keywords
                };
            }
        }
    } catch (error) {
        // Silent fail to default metadata
    }
    return null;
}

export async function generateMetadata(): Promise<Metadata> {
    const cmsMeta = await getCMSMetadata();
    const cookieStore = await cookies();
    const hasToken = cookieStore.get('token');

    const defaultTitle = 'NovaMart – Wholesale & B2B E-Commerce Marketplace';
    const defaultDesc = 'NovaMart is a secure B2B2C marketplace connecting manufacturers, dealers, and buyers.';

    return {
        title: cmsMeta?.title || defaultTitle,
        description: cmsMeta?.description || defaultDesc,
        keywords: cmsMeta?.keywords,
        robots: {
            index: !hasToken, // noindex for logged-in users
            follow: !hasToken
        },
        alternates: {
            canonical: 'https://novamart.com'
        }
    };
}

export default function HomePage() {
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebSite',
                        name: 'NovaMart',
                        url: 'https://novamart.com',
                        potentialAction: {
                            '@type': 'SearchAction',
                            target: 'https://novamart.com/products?q={search_term_string}',
                            'query-input': 'required name=search_term_string'
                        }
                    })
                }}
            />
            <HomeClient />
        </>
    );
}
