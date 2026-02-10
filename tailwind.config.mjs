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
                primary: "#10367D", // Deep Navy (Buttons, Important Text)
                secondary: "#74b4da", // Sky Blue (Minimal Usage)
                accent: "#74b4da",   // Same as Secondary
                background: "#EBEBEB", // Global Website Background
                surface: "#EBEBEB", // Component Surface
                foreground: "#101527", // Midnight Blue Text
                "text-secondary": "#101527",
                "text-muted": "#10367D",
                warning: "#F59E0B",
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
        },
    },
    plugins: [],
}
