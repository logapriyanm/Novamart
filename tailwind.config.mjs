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
            
            colors: {
                primary: "#10367D", // Deep Navy
                secondary: "#d3dbdfff", // Sky Blue
                accent: "#10367D",
                background: "#ebececff", // Sky Blue Background
                surface: "#EBEBEB", // Light Gray Surface
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
