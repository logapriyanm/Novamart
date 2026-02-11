
export const metadata = {
    title: 'Terms of Service | NovaMart Legal',
    description: 'Review the terms governing usage of the NovaMart platform, including our zero-trust verification model, ledger integrity rules, and compliance frameworks.',
    openGraph: {
        title: 'NovaMart Terms of Service',
        description: 'Understand your rights and obligations within the NovaMart governance ecosystem.',
        url: 'https://novamart.com/terms'
    }
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
