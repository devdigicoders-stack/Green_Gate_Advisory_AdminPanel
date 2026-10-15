/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: '#123F32',
          dark: '#0A251D',
          light: '#1B5242',
        },
        'deep-green': {
          DEFAULT: '#1E604A',
          dark: '#164838',
          light: '#287F63',
        },
        gold: {
          DEFAULT: '#D2AD67',
          dark: '#B8924B',
          light: '#E6C88A',
        },
        sage: {
          DEFAULT: '#F4F7F1',
          light: '#FAFBF8',
          dark: '#E7EDE2',
        },
        charcoal: {
          DEFAULT: '#182A24',
          muted: '#4A5E55',
          light: '#6E8077',
        },
        sand: {
          border: '#DFE7DC',
          surface: '#F8FAF6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['"Plus Jakarta Sans"', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', '"Plus Jakarta Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      boxShadow: {
        'subtle': '0 1px 3px rgba(18, 63, 50, 0.05), 0 1px 2px rgba(18, 63, 50, 0.03)',
        'premium': '0 10px 30px -5px rgba(18, 63, 50, 0.08), 0 4px 6px -2px rgba(18, 63, 50, 0.03)',
        'elevated': '0 20px 40px -10px rgba(18, 63, 50, 0.12), 0 8px 12px -4px rgba(18, 63, 50, 0.04)',
      },
    },
  },
  plugins: [],
}
