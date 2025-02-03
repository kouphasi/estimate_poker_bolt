/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'rgb(var(--color-primary))',
        'primary-soft': 'rgb(var(--color-primary-soft))',
      },
      boxShadow: {
        'orange-glow': '0 4px 12px rgba(255, 159, 64, 0.15)',
      },
    },
  },
  plugins: [],
};