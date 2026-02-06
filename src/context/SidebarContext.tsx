'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarContextType {
    isCategorySidebarOpen: boolean;
    toggleCategorySidebar: () => void;
    openCategorySidebar: () => void;
    closeCategorySidebar: () => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
    const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(true);

    const toggleCategorySidebar = () => setIsCategorySidebarOpen(prev => !prev);
    const openCategorySidebar = () => setIsCategorySidebarOpen(true);
    const closeCategorySidebar = () => setIsCategorySidebarOpen(false);

    return (
        <SidebarContext.Provider value={{
            isCategorySidebarOpen,
            toggleCategorySidebar,
            openCategorySidebar,
            closeCategorySidebar
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

export function useSidebar() {
    const context = useContext(SidebarContext);
    if (context === undefined) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
}

