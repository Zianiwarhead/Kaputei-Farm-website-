/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        tomato: '#C8252C',
        'tomato-deep': '#9E1B22',
        chipotle: '#E07A1F',
        paprika: '#D94B2B',
        cream: '#FFF7EE',
        'cream-warm': '#FBE9D2',
        charcoal: '#1F1A17',
        leaf: '#5C8A3A',
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        hand: ['Caveat', 'cursive'],
        display: ['"Baloo 2"', 'Fraunces', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        warm: '0 10px 30px -10px rgba(216, 75, 43, 0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        sway: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(var(--float-rot, 0deg))' },
          '50%': { transform: 'translateY(-12px) rotate(var(--float-rot, 0deg))' },
        },
      },
      animation: {
        'fade-up': 'fade-up 700ms ease-out both',
        sway: 'sway 6s ease-in-out infinite',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
