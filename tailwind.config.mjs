/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            screens: {
                'sm': '481px',   // Tablet (481px – 768px)
                'md': '769px',   // Laptop (769px – 1024px)
                'lg': '1025px',  // Desktop (≥ 1025px)
            },
            colors: {
                primary: "#2772A0", // Blue Accent (Buttons, Active States)
                secondary: "#171717", // Black (Text, Secondary Actions)
                accent: "#2772A0",   // Alias for Primary
                background: "#FFFFFF", // Pure White Background
                surface: "#FAFAFA", // Very Light Gray Surface
                foreground: "#000000", // Pure Black Text
                "text-secondary": "#4B5563", // Gray-600 for secondary text
                "text-muted": "#9CA3AF", // Gray-400 for muted text
                success: "#10B981",
                warning: "#F59E0B",
                danger: "#EF4444",
                border: "#E5E7EB", // Gray-200
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            borderRadius: {
                DEFAULT: '10px',
                'sm': '6px',
                'md': '10px',
                'lg': '10px',
                'xl': '12px',
                '2xl': '20px',
            },
        },
    },
    plugins: [],
}
