
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const title = params.slug
        ? params.slug.split('-').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
        : 'Category';

    return {
        title: `${title} | NovaMart Selection`,
        description: `Explore our premium collection of ${title} products. Verified manufacturers, wholesale prices, and secure B2B trade.`,
        openGraph: {
            title: `${title} - NovaMart Marketplace`,
            description: `Best deals on ${title}. Direct from manufacturers to your doorstep.`,
            url: `https://novamart.com/products/category/${params.slug}`
        }
    };
}

export default function CategoryLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
