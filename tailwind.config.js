/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-to-r': 'linear-gradient(to right, var(--tw-gradient-stops))',
            }
        },
    },
    plugins: [],
}