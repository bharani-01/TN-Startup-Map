/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        apple: {
          bg: '#F5F5F7',
          surface: 'rgba(255, 255, 255, 0.82)',
          surfaceElevated: 'rgba(255, 255, 255, 0.94)',
          border: 'rgba(0, 0, 0, 0.08)',
          borderLight: 'rgba(255, 255, 255, 0.65)',
          text: '#1D1D1F',
          secondary: '#86868B',
          tertiary: '#A1A1A6',
          blue: '#0071E3',
          blueHover: '#0077ED',
          indigo: '#5856D6',
          purple: '#AF52DE',
          emerald: '#34C759',
          amber: '#FF9500',
          rose: '#FF2D55',
          dark: '#161617',
          darkSurface: 'rgba(28, 28, 30, 0.85)',
          darkBorder: 'rgba(255, 255, 255, 0.12)',
        },
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        navy: {
          800: '#111827',
          900: '#0f172a',
          950: '#090d16',
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Plus Jakarta Sans"',
          'Manrope',
          'Inter',
          'system-ui',
          'sans-serif'
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"Outfit"',
          '"Plus Jakarta Sans"',
          'sans-serif'
        ],
        art: [
          'Syne',
          '-apple-system',
          'BlinkMacSystemFont',
          'sans-serif'
        ],
        editorial: [
          '"Instrument Serif"',
          'Didot',
          'Bodoni MT',
          'Georgia',
          'serif'
        ],
        tech: ['Space Grotesk', 'sans-serif'],
        mono: ['SF Mono', 'JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'apple-sm': '0 2px 8px -2px rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'apple-card': '0 8px 24px -4px rgba(0, 0, 0, 0.05), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
        'apple-hover': '0 16px 36px -6px rgba(0, 0, 0, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        'apple-glass': '0 20px 40px -15px rgba(0, 0, 0, 0.07), 0 0 1px 1px rgba(255, 255, 255, 0.8) inset',
        'apple-modal': '0 25px 60px -15px rgba(0, 0, 0, 0.2), 0 0 1px 1px rgba(255, 255, 255, 0.9) inset',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 12px 28px -5px rgba(0, 0, 0, 0.08), 0 6px 10px -6px rgba(0, 0, 0, 0.03)',
        'modal': '0 24px 48px -12px rgba(0, 0, 0, 0.16)',
        'subtle': '0 1px 2px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'apple-sm': '10px',
        'apple-md': '14px',
        'apple-lg': '18px',
        'apple-xl': '24px',
        'apple-2xl': '30px',
      },
      transitionTimingFunction: {
        'apple-spring': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'apple-bounce': 'cubic-bezier(0.175, 0.885, 0.32, 1.2)',
        'apple-snappy': 'cubic-bezier(0.2, 0, 0, 1)',
      },
    },
  },
  plugins: [],
}
