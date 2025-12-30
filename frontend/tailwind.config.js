/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neu: {
          bg: '#E0E5EC',
          surface: '#E0E5EC',
          foreground: '#3D4852',
          muted: '#8B95A5',
          accent: '#6C63FF',
          'accent-light': '#8B83FF',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          'shadow-dark': 'rgba(163, 177, 198, 0.6)',
          'shadow-light': 'rgba(255, 255, 255, 0.5)',
        },
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      borderRadius: {
        'neu': '16px',
        'neu-sm': '12px',
        'neu-lg': '24px',
        'neu-xl': '32px',
      },
      boxShadow: {
        'neu-sm': '4px 4px 8px rgba(163, 177, 198, 0.6), -4px -4px 8px rgba(255, 255, 255, 0.5)',
        'neu': '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
        'neu-lg': '12px 12px 24px rgba(163, 177, 198, 0.6), -12px -12px 24px rgba(255, 255, 255, 0.5)',
        'neu-xl': '20px 20px 40px rgba(163, 177, 198, 0.6), -20px -20px 40px rgba(255, 255, 255, 0.5)',
        'neu-inset-sm': 'inset 4px 4px 8px rgba(163, 177, 198, 0.6), inset -4px -4px 8px rgba(255, 255, 255, 0.5)',
        'neu-inset': 'inset 8px 8px 16px rgba(163, 177, 198, 0.6), inset -8px -8px 16px rgba(255, 255, 255, 0.5)',
        'neu-inset-lg': 'inset 12px 12px 24px rgba(163, 177, 198, 0.6), inset -12px -12px 24px rgba(255, 255, 255, 0.5)',
      },
      animation: {
        'neu-float': 'neuFloat 3s ease-in-out infinite',
        'neu-pulse': 'neuPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        neuFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        neuPulse: {
          '0%, 100%': {
            boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
          },
          '50%': {
            boxShadow: '12px 12px 24px rgba(163, 177, 198, 0.7), -12px -12px 24px rgba(255, 255, 255, 0.6)',
          },
        },
      },
    },
  },
  plugins: [],
}
