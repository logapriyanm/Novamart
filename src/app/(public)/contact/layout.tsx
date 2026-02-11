
export const metadata = {
    title: 'Contact NovaMart | Global Support Hotline',
    description: 'Get in touch with NovaMart support for inquiries, partnership opportunities, or technical assistance. Available 24/7 for our global trade partners.',
    openGraph: {
        title: 'Contact NovaMart | We are here to help',
        description: 'Reach out to our dedicated support team via email, phone, or live chat.',
        images: ['/contact-og.jpg']
    }
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
