'use client';

import React from 'react';
import FooterPageSidebar, { SidebarSection } from './FooterPageSidebar';
import { motion } from 'framer-motion';

interface FooterPageLayoutProps {
    children: React.ReactNode;
    sidebarTitle: string;
    sidebarDescription: string;
    sidebarWelcome?: string;
    sidebarSections: SidebarSection[];
}

const FooterPageLayout: React.FC<FooterPageLayoutProps> = ({
    children,
    sidebarTitle,
    sidebarDescription,
    sidebarWelcome,
    sidebarSections
}) => {
    return (
        <div className="min-h-screen bg-[#F8FAFC] selection:bg-black/10 pt-32 pb-24">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-black/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-black/5 blur-[120px] rounded-full" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Main Content Area */}
                    <motion.main
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex-1 min-w-0"
                    >
                        {children}
                    </motion.main>

                    {/* Sidebar Area */}
                    <div className="shrink-0">
                        <FooterPageSidebar
                            title={sidebarTitle}
                            description={sidebarDescription}
                            welcomeMessage={sidebarWelcome}
                            sections={sidebarSections}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FooterPageLayout;
