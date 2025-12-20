/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      colors: {
        'cromo': {
          purple: '#8B5CF6',
          pink: '#EC4899',
          orange: '#F97316',
          yellow: '#FBBF24',
        },
        'meta': {
          teal: '#14B8A6',
          blue: '#3B82F6',
          indigo: '#6366F1',
          green: '#10B981',
        }
      },
      animation: {
        'gradient': 'gradient 15s ease infinite',
        'pulse-slow': 'pulse 2s ease-in-out infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
