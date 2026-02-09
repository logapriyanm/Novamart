import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/api/',
                    '/account/',
                    '/admin/',
                    '/manufacturer/',
                    '/dealer/',
                    '/checkout/',
                    '/cart/',
                ],
            },
        ],
        sitemap: 'https://novamart.com/sitemap.xml',
    };
}
