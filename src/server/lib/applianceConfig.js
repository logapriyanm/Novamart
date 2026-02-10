/**
 * Master Configuration for Home Appliance Categories & Filters (Backend Version)
 */

export const GLOBAL_FILTERS = [
    { id: 'price', label: 'Price Range', type: 'range', min: 0, max: 500000, unit: '₹' },
    { id: 'brand', label: 'Brand', type: 'select', options: [] },
    { id: 'availability', label: 'Availability', type: 'select', options: ['In Stock', 'Out of Stock'] },
    { id: 'rating', label: 'Rating', type: 'range', min: 1, max: 5 },
    { id: 'warranty', label: 'Warranty Period', type: 'select', options: ['1 Year', '2 Years', '3 Years+', 'No Warranty'] },
    { id: 'energyRating', label: 'Energy Rating (Star)', type: 'select', options: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'] },
    { id: 'sellerType', label: 'Seller Type', type: 'select', options: ['Verified', 'Top Seller'] },
    { id: 'deliveryTime', label: 'Delivery Time', type: 'select', options: ['Same Day', '1-2 Days', '3-5 Days', 'Above 5 Days'] }
];

export const APPLIANCE_METADATA = {
    'large-home-appliances': {
        id: 'large-home-appliances',
        label: 'Large Home Appliances',
        subCategories: {
            'refrigerator': {
                id: 'refrigerator',
                label: 'Refrigerator',
                filters: [
                    { id: 'capacity', label: 'Capacity (Liters)', type: 'number', unit: 'L' },
                    { id: 'refrigeratorType', label: 'Refrigerator Type', type: 'select', options: ['Single Door', 'Double Door', 'Side-by-Side'] },
                    { id: 'defrostType', label: 'Defrost Type', type: 'select', options: ['Direct', 'Frost-Free'] },
                    { id: 'energyRating', label: 'Energy Rating (Star)', type: 'select', options: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'] },
                    { id: 'compressorType', label: 'Compressor Type', type: 'select', options: ['Normal', 'Inverter'] },
                    { id: 'doorMaterial', label: 'Door Material', type: 'select', options: ['Steel', 'Glass'] },
                    { id: 'numShelves', label: 'Number of Shelves', type: 'number' }
                ]
            },
            'washing-machine': {
                id: 'washing-machine',
                label: 'Washing Machine',
                filters: [
                    { id: 'loadType', label: 'Load Type', type: 'select', options: ['Top Load', 'Front Load'] },
                    { id: 'capacity', label: 'Washing Capacity (Kg)', type: 'number', unit: 'kg' },
                    { id: 'functionType', label: 'Function Type', type: 'select', options: ['Semi Automatic', 'Fully Automatic'] },
                    { id: 'spinSpeed', label: 'Spin Speed (RPM)', type: 'number', unit: 'RPM' },
                    { id: 'motorType', label: 'Motor Type', type: 'select', options: ['Inverter', 'Normal'] },
                    { id: 'waterConsumption', label: 'Water Consumption', type: 'number', unit: 'L' },
                    { id: 'numPrograms', label: 'Number of Wash Programs', type: 'number' }
                ]
            },
            'air-conditioner': {
                id: 'air-conditioner',
                label: 'Air Conditioner',
                filters: [
                    { id: 'acType', label: 'AC Type', type: 'select', options: ['Split AC', 'Window AC'] },
                    { id: 'capacityTon', label: 'Capacity (Ton)', type: 'select', options: ['0.75 Ton', '1 Ton', '1.5 Ton', '2 Ton', 'Above 2 Ton'] },
                    { id: 'energyRating', label: 'Energy Rating', type: 'select', options: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'] },
                    { id: 'inverterTech', label: 'Inverter Technology', type: 'select', options: ['Yes', 'No'] },
                    { id: 'coolingCapacity', label: 'Cooling Capacity (BTU)', type: 'number', unit: 'BTU' },
                    { id: 'roomSize', label: 'Room Size Suitability', type: 'select', options: ['Up to 100 sq ft', '100-150 sq ft', '150-250 sq ft'] },
                    { id: 'noiseLevel', label: 'Noise Level (dB)', type: 'number', unit: 'dB' }
                ]
            },
            'fan': {
                id: 'fan',
                label: 'Ceiling Fan',
                filters: [
                    { id: 'fanType', label: 'Fan Type', type: 'select', options: ['Ceiling', 'Wall', 'Pedestal', 'Table'] },
                    { id: 'sweepSize', label: 'Sweep Size (mm)', type: 'number', unit: 'mm' },
                    { id: 'speedSettings', label: 'Speed Settings', type: 'number' },
                    { id: 'motorType', label: 'Motor Type', type: 'select', options: ['BLDC', 'Normal'] },
                    { id: 'powerConsumption', label: 'Power Consumption (Watts)', type: 'number', unit: 'W' },
                    { id: 'remoteControl', label: 'Remote Control', type: 'select', options: ['Yes', 'No'] }
                ]
            }
        }
    },
    'kitchen-appliances': {
        id: 'kitchen-appliances',
        label: 'Kitchen Appliances',
        subCategories: {
            'microwave-oven': {
                id: 'microwave-oven',
                label: 'Microwave Oven',
                filters: [
                    { id: 'ovenType', label: 'Oven Type', type: 'select', options: ['Solo', 'Grill', 'Convection'] },
                    { id: 'capacity', label: 'Capacity (Liters)', type: 'number', unit: 'L' },
                    { id: 'powerConsumption', label: 'Power Consumption (Watts)', type: 'number', unit: 'W' },
                    { id: 'controlType', label: 'Control Type', type: 'select', options: ['Mechanical', 'Touch'] },
                    { id: 'autoCookMenus', label: 'Auto Cook Menus', type: 'number' },
                    { id: 'childLock', label: 'Child Lock', type: 'select', options: ['Yes', 'No'] }
                ]
            },
            'kitchen-chimney': {
                id: 'kitchen-chimney',
                label: 'Kitchen Chimney',
                filters: [
                    { id: 'chimneyType', label: 'Chimney Type', type: 'select', options: ['Wall Mounted', 'Island'] },
                    { id: 'suctionPower', label: 'Suction Power (m³/hr)', type: 'number', unit: 'm³/hr' },
                    { id: 'filterType', label: 'Filter Type', type: 'select', options: ['Baffle', 'Mesh', 'Carbon'] },
                    { id: 'noiseLevel', label: 'Noise Level (dB)', type: 'number', unit: 'dB' },
                    { id: 'controlType', label: 'Control Type', type: 'select', options: ['Touch', 'Gesture'] },
                    { id: 'autoClean', label: 'Auto Clean', type: 'select', options: ['Yes', 'No'] }
                ]
            },
            'gas-stove': {
                id: 'gas-stove',
                label: 'Gas Stove / Hob',
                filters: [
                    { id: 'numBurners', label: 'Number of Burners', type: 'number' },
                    { id: 'stoveType', label: 'Stove Type', type: 'select', options: ['Manual', 'Auto Ignition'] },
                    { id: 'burnerMaterial', label: 'Burner Material', type: 'select', options: ['Brass', 'Aluminum'] },
                    { id: 'bodyMaterial', label: 'Body Material', type: 'select', options: ['Glass', 'Stainless Steel'] },
                    { id: 'sizeCm', label: 'Size (cm)', type: 'number', unit: 'cm' }
                ]
            },
            'induction-cooktop': {
                id: 'induction-cooktop',
                label: 'Induction Cooktop',
                filters: [
                    { id: 'powerConsumption', label: 'Power Consumption (Watts)', type: 'number', unit: 'W' },
                    { id: 'controlType', label: 'Control Type', type: 'select', options: ['Touch', 'Button'] },
                    { id: 'presetModes', label: 'Preset Cooking Modes', type: 'number' },
                    { id: 'panDetection', label: 'Pan Detection', type: 'select', options: ['Yes', 'No'] },
                    { id: 'autoShutOff', label: 'Auto Shut-off', type: 'select', options: ['Yes', 'No'] }
                ]
            }
        }
    },
    'small-home-appliances': {
        id: 'small-home-appliances',
        label: 'Small Home Appliances',
        subCategories: {
            'mixer-grinder': {
                id: 'mixer-grinder',
                label: 'Mixer Grinder',
                filters: [
                    { id: 'powerWatts', label: 'Power (Watts)', type: 'number', unit: 'W' },
                    { id: 'numJars', label: 'Number of Jars', type: 'number' },
                    { id: 'jarMaterial', label: 'Jar Material', type: 'select', options: ['Stainless Steel', 'Plastic'] },
                    { id: 'speedLevels', label: 'Speed Levels', type: 'number' },
                    { id: 'motorProtection', label: 'Motor Protection', type: 'select', options: ['Yes', 'No'] }
                ]
            },
            'electric-kettle': {
                id: 'electric-kettle',
                label: 'Electric Kettle',
                filters: [
                    { id: 'capacity', label: 'Capacity (Liters)', type: 'number', unit: 'L' },
                    { id: 'powerWatts', label: 'Power (Watts)', type: 'number', unit: 'W' },
                    { id: 'bodyMaterial', label: 'Body Material', type: 'select', options: ['Stainless Steel', 'Glass', 'Plastic'] },
                    { id: 'autoShutOff', label: 'Auto Shut-off', type: 'select', options: ['Yes', 'No'] },
                    { id: 'cordless', label: 'Cordless', type: 'select', options: ['Yes', 'No'] }
                ]
            },
            'vacuum-cleaner': {
                id: 'vacuum-cleaner',
                label: 'Vacuum Cleaner',
                filters: [
                    { id: 'vacuumType', label: 'Vacuum Type', type: 'select', options: ['Dry', 'Wet & Dry', 'Robotic'] },
                    { id: 'powerWatts', label: 'Power (Watts)', type: 'number', unit: 'W' },
                    { id: 'dustCapacity', label: 'Dust Capacity', type: 'number', unit: 'L' },
                    { id: 'filterType', label: 'Filter Type', type: 'select', options: ['HEPA', 'Standard'] },
                    { id: 'noiseLevel', label: 'Noise Level (dB)', type: 'number', unit: 'dB' }
                ]
            }
        }
    }
};

export const getFiltersBySubCategory = (subCategoryName) => {
    if (!subCategoryName) return [];
    const slug = subCategoryName.toLowerCase().replace(/\s+/g, '-');
    for (const catId in APPLIANCE_METADATA) {
        const subCats = APPLIANCE_METADATA[catId].subCategories;
        if (subCats[slug]) {
            return subCats[slug].filters;
        }
    }
    return [];
};
