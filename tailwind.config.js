/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./index.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
      },
      colors: {
        'kid-primary': '#FF6B6B',
        'kid-secondary': '#4ECDC4',
        'pro-bg': '#1E1E1E',
        'pro-sidebar': '#252526',
        'pro-accent': '#007ACC',
      },
      fontFamily: {
        mono: ['Fira Code', 'monospace'],
        sans: ['Inter', 'sans-serif'],
      }
    }
  },
  plugins: [],
}
