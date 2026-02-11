
export const metadata = {
    title: 'About NovaMart | B2B2C Governance Platform',
    description: 'NovaMart is a next-generation B2B2C marketplace ensuring zero-trust verification, ledger integrity, and secure trade for manufacturers, dealers, and customers.',
    openGraph: {
        title: 'About NovaMart | Redefining Global Trade',
        description: 'Empowering sustainable growth with transparent, auditable, and secure commerce tools.',
        images: ['/about-og.jpg']
    }
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
