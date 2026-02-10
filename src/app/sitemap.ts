import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://novamart.com';

    // Static routes
    const routes = [
        { path: '', priority: 1, changefreq: 'daily' },
        { path: '/products', priority: 0.9, changefreq: 'daily' },
        { path: '/categories', priority: 0.8, changefreq: 'weekly' },
        { path: '/sellers', priority: 0.8, changefreq: 'weekly' },
        { path: '/about', priority: 0.5, changefreq: 'monthly' },
        { path: '/contact', priority: 0.5, changefreq: 'monthly' },
        { path: '/terms', priority: 0.3, changefreq: 'monthly' },
        { path: '/privacy', priority: 0.3, changefreq: 'monthly' },
    ].map(route => ({
        url: `${baseUrl}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changefreq as any,
        priority: route.priority,
    }));

    return [...routes];
}
