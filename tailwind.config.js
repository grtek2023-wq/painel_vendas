/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: '#00ff41',
          'green-dark': '#00cc33',
          black: '#0a0a0a',
          'gray-dark': '#1a1a1a',
          'gray-medium': '#2a2a2a',
          'gray-light': '#3a3a3a',
          red: '#ff0040',
          orange: '#ff9500',
          blue: '#00d4ff',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        none: '0',
      },
      boxShadow: {
        'neon-green': '0 0 10px rgba(0, 255, 65, 0.5)',
        'neon-red': '0 0 10px rgba(255, 0, 64, 0.5)',
      },
    },
  },
  plugins: [],
};
