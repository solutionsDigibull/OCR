/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      colors: {
        surface: {
          DEFAULT: '#ffffff',
          dark: '#0a0a0a',
        },
        card: {
          DEFAULT: '#ffffff',
          dark: '#111111',
        },
        border: {
          DEFAULT: '#e5e7eb',
          dark: '#1a1a1a',
        },
      },
      animation: {
        'fade-in':       'fadeIn 0.2s ease-out',
        'slide-up':      'slideUp 0.3s ease-out',
        'slide-down':    'slideDown 0.25s ease-out',
        'slide-in-r':    'slideInR 0.3s ease-out',
        'scale-in':      'scaleIn 0.2s ease-out',
        'shimmer':       'shimmer 1.6s ease-in-out infinite',
        'spin-slow':     'spin 2s linear infinite',
        'pulse-subtle':  'pulseSubtle 2s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 1.4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp:      { from: { transform: 'translateY(12px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideDown:    { from: { transform: 'translateY(-12px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
        slideInR:     { from: { transform: 'translateX(12px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
        scaleIn:      { from: { transform: 'scale(0.96)', opacity: '0' }, to: { transform: 'scale(1)', opacity: '1' } },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-5px)' },
        },
      },
      boxShadow: {
        'xs':    '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        'glow':  '0 0 20px -5px rgb(37 99 235 / 0.3)',
        'glow-sm': '0 0 10px -3px rgb(37 99 235 / 0.2)',
      },
    },
  },
  plugins: [],
}
