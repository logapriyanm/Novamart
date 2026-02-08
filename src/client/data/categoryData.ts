
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
    { name: 'Cooking Appliances', href: '/products/category/cooking-appliances' },
    { name: 'Refrigeration', href: '/products/category/refrigeration' },
    { name: 'Washing & Drying', href: '/products/category/washing-drying' },
    { name: 'Heating, Cooling & Air Care', href: '/products/category/heating-cooling' },
    { name: 'Cleaning Appliances', href: '/products/category/cleaning-appliances' },
    { name: 'Personal Care Appliances', href: '/products/category/personal-care' },
    { name: 'Smart-Enabled Appliances', href: '/products/category/smart-appliances' },
    { name: 'Today\'s Deals', href: '/products?sort=deals' }
];

export const sidebarCategories: MainCategory[] = [
    {
        id: 'kitchen-appliances',
        label: 'Kitchen Appliances',
        icon: 'FaUtensils',
        subsections: [
            {
                label: 'Small Kitchen Appliances',
                items: [
                    { name: 'Mixer Grinder', href: '/products/category/mixer-grinder' },
                    { name: 'Juicer', href: '/products/category/juicer' },
                    { name: 'Hand Blender', href: '/products/category/hand-blender' },
                    { name: 'Food Processor', href: '/products/category/food-processor' },
                    { name: 'Electric Chopper', href: '/products/category/electric-chopper' },
                    { name: 'Wet Grinder', href: '/products/category/wet-grinder' }
                ]
            },
            {
                label: 'Cooking Appliances',
                items: [
                    { name: 'Induction Cooktop', href: '/products/category/induction-cooktop' },
                    { name: 'Electric Stove', href: '/products/category/electric-stove' },
                    { name: 'Gas Stove', href: '/products/category/gas-stove' },
                    { name: 'Rice Cooker', href: '/products/category/rice-cooker' },
                    { name: 'Pressure Cooker (Electric)', href: '/products/category/electric-pressure-cooker' },
                    { name: 'OTG Oven', href: '/products/category/otg-oven' },
                    { name: 'Microwave Oven', href: '/products/category/microwave-oven' },
                    { name: 'Air Fryer', href: '/products/category/air-fryer' }
                ]
            },
            {
                label: 'Breakfast Appliances',
                items: [
                    { name: 'Sandwich Maker', href: '/products/category/sandwich-maker' },
                    { name: 'Toaster', href: '/products/category/toaster' },
                    { name: 'Waffle Maker', href: '/products/category/waffle-maker' },
                    { name: 'Egg Boiler', href: '/products/category/egg-boiler' }
                ]
            },
            {
                label: 'Beverage Appliances',
                items: [
                    { name: 'Electric Kettle', href: '/products/category/electric-kettle' },
                    { name: 'Coffee Maker', href: '/products/category/coffee-maker' },
                    { name: 'Tea Maker', href: '/products/category/tea-maker' }
                ]
            }
        ]
    },
    {
        id: 'large-home-appliances',
        label: 'Large Home Appliances', // 2️⃣
        icon: 'FaTv', // Placeholder icon
        subsections: [
            {
                label: 'Refrigeration',
                items: [
                    { name: 'Single Door Refrigerator', href: '/products/category/single-door-refrigerator' },
                    { name: 'Double Door Refrigerator', href: '/products/category/double-door-refrigerator' },
                    { name: 'Side-by-Side Refrigerator', href: '/products/category/side-by-side-refrigerator' },
                    { name: 'Deep Freezer', href: '/products/category/deep-freezer' },
                    { name: 'Commercial Freezer', href: '/products/category/commercial-freezer' }
                ]
            },
            {
                label: 'Washing & Drying',
                items: [
                    { name: 'Fully Automatic Washing Machine', href: '/products/category/fully-automatic-washing-machine' },
                    { name: 'Semi-Automatic Washing Machine', href: '/products/category/semi-automatic-washing-machine' },
                    { name: 'Top Load Washer', href: '/products/category/top-load-washer' },
                    { name: 'Front Load Washer', href: '/products/category/front-load-washer' },
                    { name: 'Clothes Dryer', href: '/products/category/clothes-dryer' }
                ]
            },
            {
                label: 'Dish & Cleaning',
                items: [
                    { name: 'Dishwasher', href: '/products/category/dishwasher' },
                    { name: 'Built-in Dishwasher', href: '/products/category/builtin-dishwasher' }
                ]
            }
        ]
    },
    {
        id: 'heating-cooling',
        label: 'Heating, Cooling & Air Care', // 3️⃣
        icon: 'FaFan',
        subsections: [
            {
                label: 'Cooling Appliances',
                items: [
                    { name: 'Ceiling Fan', href: '/products/category/ceiling-fan' },
                    { name: 'Table Fan', href: '/products/category/table-fan' },
                    { name: 'Pedestal Fan', href: '/products/category/pedestal-fan' },
                    { name: 'Exhaust Fan', href: '/products/category/exhaust-fan' },
                    { name: 'Air Cooler', href: '/products/category/air-cooler' }
                ]
            },
            {
                label: 'Air Conditioning',
                items: [
                    { name: 'Window AC', href: '/products/category/window-ac' },
                    { name: 'Split AC', href: '/products/category/split-ac' },
                    { name: 'Inverter AC', href: '/products/category/inverter-ac' },
                    { name: 'Cassette AC (Commercial)', href: '/products/category/cassette-ac' }
                ]
            },
            {
                label: 'Heating Appliances',
                items: [
                    { name: 'Room Heater', href: '/products/category/room-heater' },
                    { name: 'Oil Filled Radiator', href: '/products/category/oil-filled-radiator' },
                    { name: 'Infrared Heater', href: '/products/category/infrared-heater' }
                ]
            },
            {
                label: 'Air Quality',
                items: [
                    { name: 'Air Purifier', href: '/products/category/air-purifier' },
                    { name: 'Dehumidifier', href: '/products/category/dehumidifier' },
                    { name: 'Humidifier', href: '/products/category/humidifier' }
                ]
            }
        ]
    },
    {
        id: 'cleaning-appliances',
        label: 'Cleaning Appliances', // 4️⃣
        icon: 'FaBroom',
        subsections: [
            {
                label: 'Floor Cleaning',
                items: [
                    { name: 'Vacuum Cleaner (Dry)', href: '/products/category/vacuum-cleaner-dry' },
                    { name: 'Vacuum Cleaner (Wet & Dry)', href: '/products/category/vacuum-cleaner-wet-dry' },
                    { name: 'Robotic Vacuum Cleaner', href: '/products/category/robotic-vacuum-cleaner' }
                ]
            },
            {
                label: 'Fabric Care',
                items: [
                    { name: 'Steam Iron', href: '/products/category/steam-iron' },
                    { name: 'Dry Iron', href: '/products/category/dry-iron' },
                    { name: 'Garment Steamer', href: '/products/category/garment-steamer' }
                ]
            }
        ]
    },
    {
        id: 'personal-care',
        label: 'Personal Care Appliances', // 5️⃣
        icon: 'FaUserEdit',
        subsections: [
            {
                label: 'Grooming',
                items: [
                    { name: 'Hair Dryer', href: '/products/category/hair-dryer' },
                    { name: 'Hair Straightener', href: '/products/category/hair-straightener' },
                    { name: 'Hair Curler', href: '/products/category/hair-curler' },
                    { name: 'Trimmer', href: '/products/category/trimmer' },
                    { name: 'Shaver', href: '/products/category/shaver' },
                    { name: 'Epilator', href: '/products/category/epilator' }
                ]
            },
            {
                label: 'Oral & Health',
                items: [
                    { name: 'Electric Toothbrush', href: '/products/category/electric-toothbrush' },
                    { name: 'Water Flosser', href: '/products/category/water-flosser' }
                ]
            }
        ]
    },
    {
        id: 'smart-appliances',
        label: 'Smart & Smart-Enabled Appliances', // 6️⃣
        icon: 'FaMobileAlt',
        subsections: [
            {
                label: 'Smart Devices',
                items: [
                    { name: 'Smart AC', href: '/products/category/smart-ac' },
                    { name: 'Smart Refrigerator', href: '/products/category/smart-refrigerator' },
                    { name: 'Smart Washing Machine', href: '/products/category/smart-washing-machine' },
                    { name: 'Smart Air Purifier', href: '/products/category/smart-air-purifier' },
                    { name: 'IoT-enabled Appliances', href: '/products/category/iot-appliances' }
                ]
            }
        ]
    },
    {
        id: 'commercial-appliances',
        label: 'Commercial / B2B Appliances', // 7️⃣
        icon: 'FaIndustry',
        subsections: [
            {
                label: 'Commercial Kitchen',
                items: [
                    { name: 'Commercial Mixer', href: '/products/category/commercial-mixer' },
                    { name: 'Commercial Oven', href: '/products/category/commercial-oven' },
                    { name: 'Bulk Rice Cooker', href: '/products/category/bulk-rice-cooker' },
                    { name: 'Commercial Refrigerator', href: '/products/category/commercial-refrigerator' }
                ]
            },
            {
                label: 'Commercial Cleaning',
                items: [
                    { name: 'Industrial Vacuum Cleaner', href: '/products/category/industrial-vacuum-cleaner' },
                    { name: 'Floor Scrubber', href: '/products/category/floor-scrubber' }
                ]
            }
        ]
    },
    {
        id: 'accessories',
        label: 'Accessories & Spare Parts', // 8️⃣
        icon: 'FaTools',
        subsections: [
            {
                label: 'Spares',
                items: [
                    { name: 'Mixer Jars', href: '/products/category/mixer-jars' },
                    { name: 'Washing Machine Stands', href: '/products/category/washing-machine-stands' },
                    { name: 'Refrigerator Stabilizers', href: '/products/category/refrigerator-stabilizers' },
                    { name: 'Water Inlet Pipes', href: '/products/category/water-inlet-pipes' },
                    { name: 'Filters', href: '/products/category/filters' },
                    { name: 'Heating Coils', href: '/products/category/heating-coils' }
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

// Compatibility match for legacy components (flat map of simpler categories)
export const mainCategories = navbarCategories.map(cat => ({
    name: cat.name,
    slug: cat.href.split('/').pop() || '',
    href: cat.href
}));

// Legacy map for compatibility if needed
export const categorySubcategories: Record<string, string[]> = {
    'home-appliances': ['Air Conditioners', 'Refrigerators', 'Washing Machines'],
    // ... populated from above logic if needed, but we should migrate to sidebarCategories
};
