import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://novamart.com';

    // Static routes
    const routes = [
        '',
        '/products',
        '/categories',
        '/sellers',
        '/blog',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
    ].map(route => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }));

    // TODO: Fetch dynamic products, categories, sellers from API/DB
    // const products = await getProducts();
    // const productRoutes = products.map(...)

    return [...routes];
}
