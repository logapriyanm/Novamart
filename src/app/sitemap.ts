import { MetadataRoute } from 'next';

async function getProducts() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/products`, { next: { revalidate: 3600 } });
        const json = await res.json();
        return (json.success && Array.isArray(json.data)) ? json.data : [];
    } catch (error) {
        console.error('Sitemap: Failed to fetch products', error);
        return [];
    }
}

async function getCategories() {
    try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
        const res = await fetch(`${apiUrl}/products/categories`, { next: { revalidate: 86400 } });
        const json = await res.json();
        return (json.success && Array.isArray(json.data)) ? json.data : [];
    } catch (error) {
        console.error('Sitemap: Failed to fetch categories', error);
        return [];
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://novamart.com';

    // Static Routes
    const staticRoutes = [
        '',
        '/products',
        '/login',
        '/register',
        '/about',
        '/contact',
        '/terms',
        '/privacy',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic Products
    const products = await getProducts();
    const productRoutes = products.map((product: any) => ({
        url: `${baseUrl}/products/${product._id}`,
        lastModified: new Date(product.updatedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    // Dynamic Categories
    const categories = await getCategories();
    const categoryRoutes = categories.map((category: any) => ({
        url: `${baseUrl}/products/category/${category.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
