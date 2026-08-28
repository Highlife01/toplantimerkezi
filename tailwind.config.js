/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#080E1E',
          navy: '#0F172A',
          slate: '#1E293B',
          card: '#131D33',
          border: '#1E2E4A',
          gold: '#D4AF37',
          goldLight: '#E5C058',
          goldDark: '#B89225',
          amber: '#F59E0B',
          accent: '#2563EB',
          emerald: '#10B981',
          crimson: '#E11D48'
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif']
      },
      boxShadow: {
        'glow-gold': '0 0 25px -5px rgba(212, 175, 55, 0.3)',
        'glow-blue': '0 0 25px -5px rgba(37, 99, 235, 0.3)',
        'card-dark': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'premium': '0 20px 40px -15px rgba(0, 0, 0, 0.6)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gold-gradient': 'linear-gradient(135deg, #F9D976 0%, #D4AF37 50%, #A67C00 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0F172A 0%, #080E1E 100%)'
      }
    },
  },
  plugins: [],
}
