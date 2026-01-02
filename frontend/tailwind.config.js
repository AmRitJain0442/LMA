/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Duotone Base Colors - Deep Navy & Warm Coral
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d7ff',
          300: '#a5b9ff',
          400: '#8090ff',
          500: '#6366F1', // Main primary - Indigo
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1e1b4b',
        },
        secondary: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#F97316', // Main secondary - Orange
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407',
        },
        accent: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14B8A6', // Teal accent
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      backgroundImage: {
        // Duotone Gradients
        'gradient-primary': 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #F97316 0%, #ea580c 100%)',
        'gradient-duotone': 'linear-gradient(135deg, #6366F1 0%, #F97316 100%)',
        'gradient-duotone-reverse': 'linear-gradient(135deg, #F97316 0%, #6366F1 100%)',
        'gradient-subtle': 'linear-gradient(135deg, #f0f4ff 0%, #fff7ed 100%)',
        'gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'gradient-accent': 'linear-gradient(135deg, #14B8A6 0%, #0d9488 100%)',

        // Radial Gradients
        'gradient-radial-primary': 'radial-gradient(circle at 50% 50%, #6366F1, #4338CA)',
        'gradient-radial-duotone': 'radial-gradient(ellipse at top left, #6366F1, #F97316)',
        'gradient-radial-soft': 'radial-gradient(circle at center, rgba(99,102,241,0.1), transparent)',

        // Animated Gradients
        'gradient-animated': 'linear-gradient(270deg, #6366F1, #F97316, #14B8A6)',
        'gradient-mesh': 'radial-gradient(at 40% 20%, #6366F1 0px, transparent 50%), radial-gradient(at 80% 0%, #F97316 0px, transparent 50%), radial-gradient(at 0% 50%, #14B8A6 0px, transparent 50%)',

        // Utility
        'shimmer': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
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
        // Float & Movement
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'drift': 'drift 10s ease-in-out infinite',

        // Fade & Slide
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-in-up': 'fadeInUp 0.8s ease-out',
        'fade-in-down': 'fadeInDown 0.8s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.8s ease-out',
        'slide-left': 'slideLeft 0.8s ease-out',
        'slide-right': 'slideRight 0.8s ease-out',

        // Scale & Pulse
        'scale-in': 'scaleIn 0.6s ease-out',
        'pulse-slow': 'pulseSlow 3s ease-in-out infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',

        // Gradient & Color
        'gradient-shift': 'gradientShift 8s ease infinite',
        'gradient-xy': 'gradientXY 15s ease infinite',
        'shimmer': 'shimmer 2s linear infinite',

        // Bounce & Wiggle
        'bounce-subtle': 'bounceSubtle 2s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',

        // Rotation
        'spin-slow': 'spin 3s linear infinite',
        'spin-slower': 'spin 8s linear infinite',
      },
      keyframes: {
        // Float & Movement
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        drift: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(10px, -10px)' },
          '50%': { transform: 'translate(0, -20px)' },
          '75%': { transform: 'translate(-10px, -10px)' },
        },

        // Fade animations
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeInDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },

        // Slide animations
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-40px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },

        // Scale & Pulse
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseSlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        pulseGlow: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.6)',
          },
        },

        // Gradient animations
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        gradientXY: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '25%': { backgroundPosition: '100% 0%' },
          '50%': { backgroundPosition: '100% 100%' },
          '75%': { backgroundPosition: '0% 100%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },

        // Bounce & Wiggle
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
}
