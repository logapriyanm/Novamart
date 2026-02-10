import React from 'react';
import Link from 'next/link';
import { FaChevronRight, FaHome } from 'react-icons/fa';

interface BreadcrumbProps {
    items: {
        label: string;
        href?: string;
    }[];
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://novamart.com"
            },
            ...items.map((item, index) => ({
                "@type": "ListItem",
                "position": index + 2,
                "name": item.label,
                ...(item.href ? { "item": `https://novamart.com${item.href}` } : {})
            }))
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav className="flex items-center gap-2 text-xs font-bold text-foreground/40 mb-6 overflow-x-auto no-scrollbar py-2" aria-label="Breadcrumb">
                <Link href="/" className="flex items-center gap-1.5 hover:text-primary transition-colors">
                    <FaHome className="w-3 h-3" />
                    <span>Home</span>
                </Link>
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <FaChevronRight className="w-2 h-2 text-foreground/20" aria-hidden="true" />
                        {item.href ? (
                            <Link href={item.href} className="hover:text-primary transition-colors whitespace-nowrap">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-primary whitespace-nowrap" aria-current="page">{item.label}</span>
                        )}
                    </React.Fragment>
                ))}
            </nav>
        </>
    );
}

