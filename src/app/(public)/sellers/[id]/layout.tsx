
export const metadata = {
    title: 'Seller Profile | NovaMart Network',
    description: 'View seller ratings, product catalog, and verification status on NovaMart.',
    robots: {
        index: true,
        follow: true
    }
};

export default function SellerProfileLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
