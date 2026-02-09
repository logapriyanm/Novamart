export const CATEGORY_CONFIG = {
    'refrigerators': {
        label: 'Refrigerators',
        subCategories: [
            'Single Door', 'Double Door', 'Side by Side', 'Mini Fridges', 'Convertible'
        ],
        specs: [
            { name: 'capacity', label: 'Capacity (Litres)', type: 'number', required: true },
            { name: 'energyRating', label: 'Energy Rating', type: 'select', options: ['1 Star', '2 Star', '3 Star', '4 Star', '5 Star'] },
            { name: 'compressorType', label: 'Compressor Type', type: 'select', options: ['Inverter', 'Non-Inverter'] },
            { name: 'doorType', label: 'Door Type', type: 'select', options: ['Single', 'Double', 'French Door', 'Side-by-Side'] }
        ]
    },
    'washing-machines': {
        label: 'Washing Machines',
        subCategories: [
            'Front Load', 'Top Load', 'Semi Automatic', 'Washer Dryer'
        ],
        specs: [
            { name: 'capacity', label: 'Capacity (kg)', type: 'number', required: true },
            { name: 'functionType', label: 'Function Type', type: 'select', options: ['Fully Automatic', 'Semi Automatic'] },
            { name: 'loadingType', label: 'Loading Type', type: 'select', options: ['Front Load', 'Top Load'] },
            { name: 'maxSpinSpeed', label: 'Max Spin Speed (RPM)', type: 'number' }
        ]
    },
    'air-conditioners': {
        label: 'Air Conditioners',
        subCategories: [
            'Split AC', 'Window AC', 'Portable AC', 'Inverter AC'
        ],
        specs: [
            { name: 'tonnage', label: 'Tonnage', type: 'select', options: ['0.8 Ton', '1.0 Ton', '1.5 Ton', '2.0 Ton'] },
            { name: 'energyRating', label: 'Energy Rating', type: 'select', options: ['3 Star', '4 Star', '5 Star'] },
            { name: 'condenserCoil', label: 'Condenser Coil', type: 'select', options: ['Copper', 'Aluminium'] },
            { name: 'wifiEnabled', label: 'Wi-Fi Enabled', type: 'select', options: ['Yes', 'No'] }
        ]
    },
    'kitchen-appliances': {
        label: 'Kitchen Appliances',
        subCategories: [
            'Microwaves', 'Chimneys', 'Dishwashers', 'Mixer Grinders', 'Water Purifiers'
        ],
        specs: [
            { name: 'powerConsumption', label: 'Power (Watts)', type: 'number' },
            { name: 'capacity', label: 'Capacity', type: 'text' },
            { name: 'material', label: 'Body Material', type: 'text' },
            { name: 'features', label: 'Special Features', type: 'textarea' }
        ]
    },
    'home-comfort': {
        label: 'Home Comfort',
        subCategories: [
            'Water Heaters', 'Room Heaters', 'Air Purifiers', 'Fans', 'Vacuum Cleaners'
        ],
        specs: [
            { name: 'powerConsumption', label: 'Power (Watts)', type: 'number' },
            { name: 'coverageArea', label: 'Coverage Area (sq ft)', type: 'text' },
            { name: 'filterType', label: 'Filter Type', type: 'text' } // For purifiers/vacuums
        ]
    }
} as const;

export type CategoryKey = keyof typeof CATEGORY_CONFIG;

export const PROHIBITED_KEYWORDS = ['sex', 'porn', 'gamble', 'drug', 'weapon'];
