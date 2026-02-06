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
    return (
        <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6 overflow-x-auto no-scrollbar py-2">
            <Link href="/" className="flex items-center gap-1.5 hover:text-[#10367D] transition-colors">
                <FaHome className="w-3 h-3" />
                <span>Home</span>
            </Link>
            {items.map((item, index) => (
                <React.Fragment key={index}>
                    <FaChevronRight className="w-2 h-2 text-slate-300" />
                    {item.href ? (
                        <Link href={item.href} className="hover:text-[#10367D] transition-colors whitespace-nowrap">
                            {item.label}
                        </Link>
                    ) : (
                        <span className="text-[#10367D] whitespace-nowrap">{item.label}</span>
                    )}
                </React.Fragment>
            ))}
        </nav>
    );
}

