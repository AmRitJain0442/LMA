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
          'bg-start': '#E8EDF4',
          'bg-end': '#D8DDE8',
          surface: '#E0E5EC',
          foreground: '#3D4852',
          muted: '#8B95A5',
          accent: '#6C63FF',
          'accent-light': '#8B83FF',
          'accent-dark': '#5048E5',
          success: '#10B981',
          'success-light': '#34D399',
          warning: '#F59E0B',
          'warning-light': '#FBBF24',
          error: '#EF4444',
          'error-light': '#F87171',
          'shadow-dark': 'rgba(163, 177, 198, 0.6)',
          'shadow-light': 'rgba(255, 255, 255, 0.5)',
        },
      },
      backgroundImage: {
        'neu-gradient': 'linear-gradient(135deg, #E8EDF4 0%, #E0E5EC 50%, #D8DDE8 100%)',
        'neu-gradient-radial': 'radial-gradient(ellipse at top, #E8EDF4, #E0E5EC 50%, #D8DDE8)',
        'accent-gradient': 'linear-gradient(135deg, #8B83FF 0%, #6C63FF 50%, #5048E5 100%)',
        'accent-gradient-radial': 'radial-gradient(circle, #8B83FF, #6C63FF)',
        'success-gradient': 'linear-gradient(135deg, #34D399 0%, #10B981 100%)',
        'warning-gradient': 'linear-gradient(135deg, #FBBF24 0%, #F59E0B 100%)',
        'error-gradient': 'linear-gradient(135deg, #F87171 0%, #EF4444 100%)',
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
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
        'neu-float': 'neuFloat 6s ease-in-out infinite',
        'neu-pulse': 'neuPulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 1s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'scale-in': 'scaleIn 0.6s ease-out',
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
      },
      keyframes: {
        neuFloat: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '33%': { transform: 'translateY(-20px) rotate(2deg)' },
          '66%': { transform: 'translateY(-10px) rotate(-2deg)' },
        },
        neuPulse: {
          '0%, 100%': {
            boxShadow: '8px 8px 16px rgba(163, 177, 198, 0.6), -8px -8px 16px rgba(255, 255, 255, 0.5)',
            transform: 'scale(1)',
          },
          '50%': {
            boxShadow: '12px 12px 24px rgba(163, 177, 198, 0.7), -12px -12px 24px rgba(255, 255, 255, 0.6)',
            transform: 'scale(1.05)',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
