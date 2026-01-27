/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Montserrat', 'sans-serif'],
            },
            colors: {
                grass: {
                    50: '#f0f9f0',
                    100: '#dcfce7',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                },
                skin: {
                    main: 'rgb(var(--bg-main) / <alpha-value>)',
                    card: 'rgb(var(--bg-card) / <alpha-value>)',
                    'card-hover': 'rgb(var(--bg-card-hover) / <alpha-value>)',
                    base: 'rgb(var(--text-base) / <alpha-value>)',
                    muted: 'rgb(var(--text-muted) / <alpha-value>)',
                    border: 'rgb(var(--border-color) / <alpha-value>)',
                    accent: 'rgb(var(--accent) / <alpha-value>)',
                    'accent-hover': 'rgb(var(--accent-hover) / <alpha-value>)',
                }
            }
        },
    },
    plugins: [],
}
