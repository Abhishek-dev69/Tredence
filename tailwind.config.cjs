/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      boxShadow: {
        panel: '0 12px 32px rgba(15, 23, 42, 0.08)',
        luxe: '0 24px 64px rgba(15, 23, 42, 0.18)',
        glow: '0 0 0 1px rgba(255,255,255,0.08), 0 18px 40px rgba(15,23,42,0.28)',
      },
      colors: {
        canvas: '#F5F7FB',
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"Sora"', '"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
