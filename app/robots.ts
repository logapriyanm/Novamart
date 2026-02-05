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
                    '/account/settings',
                    '/admin/',
                    '/manufacturer/',
                    '/dealer/',
                ],
            },
        ],
        sitemap: 'https://novamart.com/sitemap.xml',
    };
}
