/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FCFAF7',
          100: '#F7F4EE',
          200: '#EFEBE2',
          300: '#E3DDD1',
          400: '#CFC6B6',
        },
        charcoal: {
          950: '#0F0E0D',
          900: '#181716',
          800: '#262422',
          700: '#3D3A37',
          600: '#5C5853',
          500: '#7D7770',
          400: '#A49D94',
        },
        terracotta: {
          50: '#FAF3F0',
          100: '#F6E6DF',
          200: '#EEC8B9',
          500: '#C85A32',
          600: '#B04B25',
          700: '#933C1A',
        },
        cobalt: {
          50: '#F0F4FC',
          100: '#E1E9F9',
          500: '#2349B8',
          600: '#1B3A97',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'card': '0 4px 20px -2px rgba(24, 23, 22, 0.06)',
        'card-hover': '0 12px 32px -4px rgba(24, 23, 22, 0.12)',
        'drawer': '-8px 0 32px -4px rgba(15, 14, 13, 0.16)',
        'modal': '0 24px 48px -12px rgba(15, 14, 13, 0.25)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-in-right': 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'badge-pulse': 'badgePulse 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        badgePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.25)' },
        },
      },
    },
  },
  plugins: [],
}
