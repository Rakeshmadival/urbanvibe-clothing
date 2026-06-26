/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0a0a0a',
        charcoal: '#111111',
        graphite: '#1c1c1c',
        gold: {
          DEFAULT: '#c8a96e',
          soft: '#e6c068',
          deep: '#a3824f',
          line: 'rgba(200,169,110,0.25)',
        },
        ivory: '#f5f2ee',
        sand: '#ede8e0',
        rust: '#e85d3a',
        fog: '#8a8a8a',
      },
      fontFamily: {
        display: ['"Bebas Neue"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      letterSpacing: {
        widest2: '0.2em',
        widest3: '0.3em',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        drawLine: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(16px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        marquee: 'marquee 22s linear infinite',
        drawLine: 'drawLine 0.8s ease forwards',
        fadeUp: 'fadeUp 0.7s ease forwards',
      },
    },
  },
  plugins: [],
};
