import React from 'react';
import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
    title: 'NovaMart – Wholesale & B2B E-Commerce Marketplace',
    description: 'NovaMart is a secure B2B2C marketplace connecting manufacturers, dealers, and buyers with escrow-protected payments and wholesale pricing.',
    alternates: {
        canonical: 'https://novamart.com'
    }
};

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
