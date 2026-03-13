/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
      },
      colors: {
        cream: {
          DEFAULT: '#FAF8F4',
          dark: '#F0EDE6',
        },
        charcoal: {
          DEFAULT: '#1C1C1C',
          light: '#3A3A3A',
        },
        vermillion: {
          DEFAULT: '#C13B2A',
          dark: '#9E2F20',
          light: '#E8604F',
        },
        'indigo-lanna': {
          DEFAULT: '#2B3C6B',
          light: '#3D5296',
        },
        gold: {
          DEFAULT: '#BFA05A',
        },
        muted: '#8A8278',
      },
      letterSpacing: {
        widest2: '0.25em',
        widest3: '0.3em',
        widest4: '0.35em',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.7s ease forwards',
        'scale-in': 'scaleIn 0.5s ease forwards',
        'scroll-pulse': 'scrollPulse 2s ease infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(32px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        scrollPulse: {
          '0%, 100%': { opacity: '1', transform: 'scaleY(1)' },
          '50%': { opacity: '0.4', transform: 'scaleY(0.7)' },
        },
      },
    },
  },
  plugins: [],
}
