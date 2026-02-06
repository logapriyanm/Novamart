/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                primary: "#10367D", // Brand Blue
                secondary: "#74B4DA", // Secondary/Hover Blue
                accent: "#74B4DA",
                background: "#EBEBEB", // Site Background
                surface: "#FFFFFF", // Box/Card Background
                foreground: "#1E293B", // Primary Text
                "text-secondary": "#475569",
                "text-muted": "#94A3B8",
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
