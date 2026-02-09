
export interface CategoryItem {
    name: string;
    href: string;
}

export interface SubCategory {
    label: string;
    items: CategoryItem[];
}

export interface MainCategory {
    id: string;
    label: string;
    icon: string; // key for icon mapping
    subsections: SubCategory[];
}

export const navbarCategories = [
    { name: 'Refrigerators', href: '/products/category/refrigerators' },
    { name: 'Washing Machines', href: '/products/category/washing-machines' },
    { name: 'Air Conditioners', href: '/products/category/air-conditioners' },
    { name: 'Kitchen Appliances', href: '/products/category/kitchen-appliances' },
    { name: 'Home Comfort', href: '/products/category/home-comfort' },
    { name: 'Smart Appliances', href: '/products/category/smart-appliances' },
    { name: 'Today\'s Deals', href: '/products?sort=deals' }
];

export const sidebarCategories: MainCategory[] = [
    {
        id: 'refrigerators',
        label: 'Refrigerators',
        icon: 'FaSnowflake', // Placeholder
        subsections: [
            {
                label: 'By Door Type',
                items: [
                    { name: 'Single Door', href: '/products/category/refrigerators?sub=Single Door' },
                    { name: 'Double Door', href: '/products/category/refrigerators?sub=Double Door' },
                    { name: 'Side by Side', href: '/products/category/refrigerators?sub=Side by Side' },
                    { name: 'Mini Fridges', href: '/products/category/refrigerators?sub=Mini Fridges' },
                    { name: 'Convertible', href: '/products/category/refrigerators?sub=Convertible' }
                ]
            }
        ]
    },
    {
        id: 'washing-machines',
        label: 'Washing Machines',
        icon: 'FaSoap',
        subsections: [
            {
                label: 'By Type',
                items: [
                    { name: 'Front Load', href: '/products/category/washing-machines?sub=Front Load' },
                    { name: 'Top Load', href: '/products/category/washing-machines?sub=Top Load' },
                    { name: 'Semi Automatic', href: '/products/category/washing-machines?sub=Semi Automatic' },
                    { name: 'Washer Dryer', href: '/products/category/washing-machines?sub=Washer Dryer' }
                ]
            }
        ]
    },
    {
        id: 'air-conditioners',
        label: 'Air Conditioners',
        icon: 'FaWind',
        subsections: [
            {
                label: 'By Type',
                items: [
                    { name: 'Split AC', href: '/products/category/air-conditioners?sub=Split AC' },
                    { name: 'Window AC', href: '/products/category/air-conditioners?sub=Window AC' },
                    { name: 'Portable AC', href: '/products/category/air-conditioners?sub=Portable AC' },
                    { name: 'Inverter AC', href: '/products/category/air-conditioners?sub=Inverter AC' }
                ]
            }
        ]
    },
    {
        id: 'kitchen-appliances',
        label: 'Kitchen Appliances',
        icon: 'FaUtensils',
        subsections: [
            {
                label: 'Cooking',
                items: [
                    { name: 'Microwaves', href: '/products/category/kitchen-appliances?sub=Microwaves' },
                    { name: 'Chimneys', href: '/products/category/kitchen-appliances?sub=Chimneys' }
                ]
            },
            {
                label: 'Prep & Cleaning',
                items: [
                    { name: 'Dishwashers', href: '/products/category/kitchen-appliances?sub=Dishwashers' },
                    { name: 'Mixer Grinders', href: '/products/category/kitchen-appliances?sub=Mixer Grinders' },
                    { name: 'Water Purifiers', href: '/products/category/kitchen-appliances?sub=Water Purifiers' }
                ]
            }
        ]
    },
    {
        id: 'home-comfort',
        label: 'Home Comfort',
        icon: 'FaCouch',
        subsections: [
            {
                label: 'Air & Water',
                items: [
                    { name: 'Water Heaters', href: '/products/category/home-comfort?sub=Water Heaters' },
                    { name: 'Room Heaters', href: '/products/category/home-comfort?sub=Room Heaters' },
                    { name: 'Air Purifiers', href: '/products/category/home-comfort?sub=Air Purifiers' },
                    { name: 'Fans', href: '/products/category/home-comfort?sub=Fans' },
                    { name: 'Vacuum Cleaners', href: '/products/category/home-comfort?sub=Vacuum Cleaners' }
                ]
            }
        ]
    }
];

export const helpSettings = [
    { name: 'Your Account', href: '/profile' },
    { name: 'Customer Service', href: '/contact' },
    { name: 'Sign In', href: '/auth/login' }
];

// Compatibility match for legacy components
export const mainCategories = navbarCategories.map(cat => ({
    name: cat.name,
    slug: cat.href.split('/').pop()?.split('?')[0] || '',
    href: cat.href
}));

// Categories selectable in the Add Product form
export const selectableCategories = sidebarCategories;

// Legacy map for compatibility if needed
export const categorySubcategories: Record<string, string[]> = {
    'refrigerators': ['Single Door', 'Double Door', 'Side by Side', 'Mini Fridges', 'Convertible'],
    'washing-machines': ['Front Load', 'Top Load', 'Semi Automatic', 'Washer Dryer'],
    'air-conditioners': ['Split AC', 'Window AC', 'Portable AC', 'Inverter AC'],
    'kitchen-appliances': ['Microwaves', 'Chimneys', 'Dishwashers', 'Mixer Grinders', 'Water Purifiers'],
    'home-comfort': ['Water Heaters', 'Room Heaters', 'Air Purifiers', 'Fans', 'Vacuum Cleaners']
};
