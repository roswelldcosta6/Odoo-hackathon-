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
          blue: '#007BFF',
          hover: '#0062CC',
          light: '#EBF4FF',
          subtle: '#D0E3FF',
        },
        surface: {
          bg: '#F4F7FB',
          card: '#FFFFFF',
          border: '#E2E8F0',
          hover: '#F8FAFC',
        },
        accent: {
          cyan: '#00D2D3',
          'cyan-light': '#E0FAF8',
          mint: '#2ED573',
          'mint-light': '#E6F9EE',
          amber: '#FF9F43',
          'amber-light': '#FFF5EB',
          lavender: '#A4B0F5',
          'lavender-light': '#EEF1FD',
          rose: '#FF4757',
          'rose-light': '#FFEBEF',
        },
        slate: {
          dark: '#1E293B',
          body: '#334155',
          muted: '#64748B',
          light: '#8898AA',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 2px 10px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(15, 23, 42, 0.05)',
        'float': '0 10px 30px -5px rgba(0, 123, 255, 0.15)',
        'glow': '0 0 20px rgba(0, 123, 255, 0.35)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      }
    },
  },
  plugins: [],
}
