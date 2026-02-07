import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://novamart.com';

    // In a real app, you'd fetch dynamic paths (categories, products) here
    const routes = [
        '',
        '/categories',
        '/brands',
        '/guides',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    return routes;
}
