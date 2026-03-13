module.exports = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
    './store/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f2ff',
          100: '#e7dcff',
          200: '#cdb2ff',
          300: '#b388ff',
          400: '#9b63ff',
          500: '#7e3ff2',
          600: '#5f2dc2',
          700: '#44208f',
          800: '#2d155f',
          900: '#1b0c38'
        },
        ink: {
          900: '#0f1419',
          800: '#1b242c',
          700: '#27333d',
          600: '#384652',
          500: '#4c5c69',
          300: '#9aa7b2'
        }
      },
      boxShadow: {
        lift: '0 12px 40px rgba(15, 20, 25, 0.18)'
      }
    }
  },
  plugins: []
};
